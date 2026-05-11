import { config } from '../config/env';
import { getSalesforceConnection } from '../salesforce/salesforceClient';
import { SALESFORCE_OBJECTS } from '../salesforce/objectNames';
import type {
  CampaignPerformance,
  CommerceOrder,
  CustomerProfile,
  DashboardSummary,
  Product,
  ReturnRequest,
  SyncLog
} from '../types/domain';
import { ApiError } from '../utils/ApiError';
import { escapeSoqlString, toLikePattern } from '../utils/soql';
import type {
  ICommerceRepository,
  OrderStatusUpdateInput,
  ProductCreateInput,
  ProductUpdateInput
} from './ICommerceRepository';

type SalesforceQueryResult<T> = {
  records: T[];
  totalSize: number;
};

type ProductRecord = {
  Id: string;
  Name: string;
  SKU__c: string;
  Price__c: number;
  Stock_Quantity__c: number;
  Category__c: Product['category'];
  Is_Active__c: boolean;
  Image_URL__c?: string;
};

type CustomerRecord = {
  Id: string;
  Name: string;
  Email__c: string;
  Phone__c?: string;
  Total_Spent__c: number;
  Customer_Segment__c: CustomerProfile['customerSegment'];
  Last_Order_Date__c?: string;
};

type OrderRecord = {
  Id: string;
  Name: string;
  Customer__c: string;
  Customer__r?: { Name: string };
  Order_Status__c: CommerceOrder['orderStatus'];
  Payment_Status__c: CommerceOrder['paymentStatus'];
  Shipping_Status__c: CommerceOrder['shippingStatus'];
  Total_Amount__c: number;
  Order_Date__c: string;
  External_Order_Id__c?: string;
};

type ReturnRecord = {
  Id: string;
  Name: string;
  Order__c: string;
  Order__r?: { Name: string };
  Reason__c: string;
  Status__c: ReturnRequest['status'];
  Refund_Amount__c: number;
  Requested_Date__c: string;
};

type CampaignRecord = {
  Id: string;
  Name: string;
  Discount_Code__c: string;
  Revenue_Generated__c: number;
  Orders_Count__c: number;
  Conversion_Rate__c: number;
  Status__c: CampaignPerformance['status'];
};

type SyncLogRecord = {
  Id: string;
  Source_System__c: string;
  Operation_Type__c: string;
  Status__c: SyncLog['status'];
  Message__c: string;
  Record_Id__c?: string;
  Created_At__c: string;
};

function mapProduct(record: ProductRecord): Product {
  return {
    id: record.Id,
    name: record.Name,
    sku: record.SKU__c,
    price: record.Price__c ?? 0,
    stockQuantity: record.Stock_Quantity__c ?? 0,
    category: record.Category__c ?? 'Other',
    isActive: Boolean(record.Is_Active__c),
    imageUrl: record.Image_URL__c
  };
}

function mapCustomer(record: CustomerRecord): CustomerProfile {
  return {
    id: record.Id,
    fullName: record.Name,
    email: record.Email__c,
    phone: record.Phone__c,
    totalSpent: record.Total_Spent__c ?? 0,
    customerSegment: record.Customer_Segment__c ?? 'New',
    lastOrderDate: record.Last_Order_Date__c
  };
}

function mapOrder(record: OrderRecord): CommerceOrder {
  return {
    id: record.Id,
    orderNumber: record.Name,
    customerId: record.Customer__c,
    customerName: record.Customer__r?.Name ?? 'Unknown Customer',
    orderStatus: record.Order_Status__c,
    paymentStatus: record.Payment_Status__c,
    shippingStatus: record.Shipping_Status__c,
    totalAmount: record.Total_Amount__c ?? 0,
    orderDate: record.Order_Date__c,
    externalOrderId: record.External_Order_Id__c
  };
}

function mapReturn(record: ReturnRecord): ReturnRequest {
  return {
    id: record.Id,
    returnNumber: record.Name,
    orderId: record.Order__c,
    orderNumber: record.Order__r?.Name ?? 'Unknown Order',
    reason: record.Reason__c,
    status: record.Status__c,
    refundAmount: record.Refund_Amount__c ?? 0,
    requestedDate: record.Requested_Date__c
  };
}

function mapCampaign(record: CampaignRecord): CampaignPerformance {
  return {
    id: record.Id,
    campaignName: record.Name,
    discountCode: record.Discount_Code__c,
    revenueGenerated: record.Revenue_Generated__c ?? 0,
    ordersCount: record.Orders_Count__c ?? 0,
    conversionRate: (record.Conversion_Rate__c ?? 0) * 100,
    status: record.Status__c
  };
}

function mapSyncLog(record: SyncLogRecord): SyncLog {
  return {
    id: record.Id,
    sourceSystem: record.Source_System__c,
    operationType: record.Operation_Type__c,
    status: record.Status__c,
    message: record.Message__c,
    recordId: record.Record_Id__c,
    createdAt: record.Created_At__c
  };
}

function firstAggregateValue(record: Record<string, unknown>, alias: string): number {
  const value = record[alias] ?? record.expr0 ?? 0;
  return typeof value === 'number' ? value : Number(value ?? 0);
}

export class SalesforceCommerceRepository implements ICommerceRepository {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const [revenueResult, orderCountResult, pendingOrderResult, vipCustomerResult, failedSyncResult] =
      await Promise.all([
        this.query<Record<string, unknown>>(
          `SELECT SUM(Total_Amount__c) revenue FROM ${SALESFORCE_OBJECTS.order} WHERE Payment_Status__c = 'Paid'`
        ),
        this.query<Record<string, unknown>>(
          `SELECT COUNT(Id) total FROM ${SALESFORCE_OBJECTS.order}`
        ),
        this.query<Record<string, unknown>>(
          `SELECT COUNT(Id) total FROM ${SALESFORCE_OBJECTS.order} WHERE Order_Status__c = 'Pending'`
        ),
        this.query<Record<string, unknown>>(
          `SELECT COUNT(Id) total FROM ${SALESFORCE_OBJECTS.customer} WHERE Customer_Segment__c = 'VIP'`
        ),
        this.query<Record<string, unknown>>(
          `SELECT COUNT(Id) total FROM ${SALESFORCE_OBJECTS.syncLog} WHERE Status__c = 'FAILED'`
        )
      ]);

    const lowStockProducts = await this.query<Record<string, unknown>>(
      `SELECT COUNT(Id) total FROM ${SALESFORCE_OBJECTS.product} WHERE Stock_Quantity__c <= ${config.lowStockThreshold}`
    );

    const [recentOrders, topProducts] = await Promise.all([
      this.listOrders(),
      this.listProducts()
    ]);

    return {
      totalRevenue: firstAggregateValue(revenueResult.records[0] ?? {}, 'revenue'),
      totalOrders: firstAggregateValue(orderCountResult.records[0] ?? {}, 'total'),
      pendingOrders: firstAggregateValue(pendingOrderResult.records[0] ?? {}, 'total'),
      vipCustomers: firstAggregateValue(vipCustomerResult.records[0] ?? {}, 'total'),
      failedSyncCount: firstAggregateValue(failedSyncResult.records[0] ?? {}, 'total'),
      lowStockProducts: firstAggregateValue(lowStockProducts.records[0] ?? {}, 'total'),
      recentOrders: recentOrders.slice(0, 5),
      topProducts: topProducts.slice(0, 5)
    };
  }

  async listProducts(search?: string): Promise<Product[]> {
    const where = search
      ? `WHERE Name LIKE '${toLikePattern(search)}' OR SKU__c LIKE '${toLikePattern(search)}'`
      : '';

    const result = await this.query<ProductRecord>(
      `SELECT Id, Name, SKU__c, Price__c, Stock_Quantity__c, Category__c, Is_Active__c, Image_URL__c
       FROM ${SALESFORCE_OBJECTS.product}
       ${where}
       ORDER BY CreatedDate DESC
       LIMIT 100`
    );

    return result.records.map(mapProduct);
  }

  async createProduct(input: ProductCreateInput): Promise<Product> {
    const conn = await getSalesforceConnection();

    const result = await conn.sobject(SALESFORCE_OBJECTS.product).create({
      Name: input.name,
      SKU__c: input.sku,
      Price__c: input.price,
      Stock_Quantity__c: input.stockQuantity,
      Category__c: input.category,
      Is_Active__c: input.isActive,
      Image_URL__c: input.imageUrl || null
    });

    if (!result.success || !result.id) {
      throw new ApiError(400, 'Salesforce product creation failed.', result.errors);
    }

    await this.createSyncLog({
      operationType: 'CREATE',
      status: 'SUCCESS',
      message: 'Product created successfully.',
      recordId: result.id,
      requestPayload: input,
      responsePayload: result
    });

    return this.getProductById(result.id);
  }

  async updateProduct(id: string, input: ProductUpdateInput): Promise<Product> {
    const conn = await getSalesforceConnection();

    const payload: Record<string, unknown> = {
      Id: id
    };

    if (input.name !== undefined) payload.Name = input.name;
    if (input.sku !== undefined) payload.SKU__c = input.sku;
    if (input.price !== undefined) payload.Price__c = input.price;
    if (input.stockQuantity !== undefined) payload.Stock_Quantity__c = input.stockQuantity;
    if (input.category !== undefined) payload.Category__c = input.category;
    if (input.isActive !== undefined) payload.Is_Active__c = input.isActive;
    if (input.imageUrl !== undefined) payload.Image_URL__c = input.imageUrl || null;

    const updateResult = await conn.sobject(SALESFORCE_OBJECTS.product).update(payload as any);
    const result = Array.isArray(updateResult) ? updateResult[0] : updateResult;

    if (!result.success) {
      throw new ApiError(400, 'Salesforce product update failed.', result.errors);
    }

    await this.createSyncLog({
      operationType: 'UPDATE',
      status: 'SUCCESS',
      message: 'Product updated successfully.',
      recordId: id,
      requestPayload: input,
      responsePayload: result
    });

    return this.getProductById(id);
  }

  async listCustomers(): Promise<CustomerProfile[]> {
    const result = await this.query<CustomerRecord>(
      `SELECT Id, Name, Email__c, Phone__c, Total_Spent__c, Customer_Segment__c, Last_Order_Date__c
       FROM ${SALESFORCE_OBJECTS.customer}
       ORDER BY LastModifiedDate DESC
       LIMIT 100`
    );

    return result.records.map(mapCustomer);
  }

  async listOrders(): Promise<CommerceOrder[]> {
    const result = await this.query<OrderRecord>(
      `SELECT Id, Name, Customer__c, Customer__r.Name, Order_Status__c, Payment_Status__c,
              Shipping_Status__c, Total_Amount__c, Order_Date__c, External_Order_Id__c
       FROM ${SALESFORCE_OBJECTS.order}
       ORDER BY Order_Date__c DESC
       LIMIT 100`
    );

    return result.records.map(mapOrder);
  }

  async updateOrderStatus(id: string, input: OrderStatusUpdateInput): Promise<CommerceOrder> {
    const conn = await getSalesforceConnection();

    const payload: Record<string, unknown> = {
      Id: id
    };

    if (input.orderStatus !== undefined) payload.Order_Status__c = input.orderStatus;
    if (input.paymentStatus !== undefined) payload.Payment_Status__c = input.paymentStatus;
    if (input.shippingStatus !== undefined) payload.Shipping_Status__c = input.shippingStatus;

    const updateResult = await conn.sobject(SALESFORCE_OBJECTS.order).update(payload as any);
    const result = Array.isArray(updateResult) ? updateResult[0] : updateResult;

    if (!result.success) {
      throw new ApiError(400, 'Salesforce order update failed.', result.errors);
    }

    await this.createSyncLog({
      operationType: 'UPDATE',
      status: 'SUCCESS',
      message: 'Order status updated successfully.',
      recordId: id,
      requestPayload: input,
      responsePayload: result
    });

    const orders = await this.listOrders();
    const order = orders.find((item) => item.id === id);

    if (!order) {
      throw new ApiError(404, 'Order updated but could not be reloaded.');
    }

    return order;
  }

  async listReturns(): Promise<ReturnRequest[]> {
    const result = await this.query<ReturnRecord>(
      `SELECT Id, Name, Order__c, Order__r.Name, Reason__c, Status__c, Refund_Amount__c, Requested_Date__c
       FROM ${SALESFORCE_OBJECTS.returnRequest}
       ORDER BY Requested_Date__c DESC
       LIMIT 100`
    );

    return result.records.map(mapReturn);
  }

  async listCampaigns(): Promise<CampaignPerformance[]> {
    const result = await this.query<CampaignRecord>(
      `SELECT Id, Name, Discount_Code__c, Revenue_Generated__c, Orders_Count__c, Conversion_Rate__c, Status__c
       FROM ${SALESFORCE_OBJECTS.campaign}
       ORDER BY LastModifiedDate DESC
       LIMIT 100`
    );

    return result.records.map(mapCampaign);
  }

  async listSyncLogs(): Promise<SyncLog[]> {
    const result = await this.query<SyncLogRecord>(
      `SELECT Id, Source_System__c, Operation_Type__c, Status__c, Message__c, Record_Id__c, Created_At__c
       FROM ${SALESFORCE_OBJECTS.syncLog}
       ORDER BY Created_At__c DESC
       LIMIT 100`
    );

    return result.records.map(mapSyncLog);
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    const conn = await getSalesforceConnection();
    await conn.identity();

    await this.createSyncLog({
      operationType: 'HEALTH_CHECK',
      status: 'SUCCESS',
      message: 'Salesforce connection is healthy.'
    });

    return {
      ok: true,
      message: 'Salesforce connection is healthy.'
    };
  }

  private async getProductById(id: string): Promise<Product> {
    const result = await this.query<ProductRecord>(
      `SELECT Id, Name, SKU__c, Price__c, Stock_Quantity__c, Category__c, Is_Active__c, Image_URL__c
       FROM ${SALESFORCE_OBJECTS.product}
       WHERE Id = '${escapeSoqlString(id)}'
       LIMIT 1`
    );

    const record = result.records[0];

    if (!record) {
      throw new ApiError(404, 'Product not found.');
    }

    return mapProduct(record);
  }

  private async query<T extends Record<string, unknown>>(soql: string): Promise<SalesforceQueryResult<T>> {
    const conn = await getSalesforceConnection();
    return (await conn.query<T>(soql)) as unknown as SalesforceQueryResult<T>;
  }

  private async createSyncLog(input: {
    operationType: string;
    status: SyncLog['status'];
    message: string;
    recordId?: string;
    requestPayload?: unknown;
    responsePayload?: unknown;
  }): Promise<void> {
    try {
      const conn = await getSalesforceConnection();

      await conn.sobject(SALESFORCE_OBJECTS.syncLog).create({
        Source_System__c: 'CommercePulse',
        Operation_Type__c: input.operationType,
        Status__c: input.status,
        Message__c: input.message,
        Record_Id__c: input.recordId,
        Request_Payload__c: input.requestPayload
          ? JSON.stringify(input.requestPayload).slice(0, 32000)
          : null,
        Response_Payload__c: input.responsePayload
          ? JSON.stringify(input.responsePayload).slice(0, 32000)
          : null,
        Created_At__c: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to create Salesforce sync log:', error);
    }
  }
}
