import { mockCampaigns, mockCustomers, mockOrders, mockProducts, mockReturns, mockSyncLogs } from '../repositories/mockData';
import { getSalesforceConnection } from '../salesforce/salesforceClient';
import { SALESFORCE_OBJECTS } from '../salesforce/objectNames';

type SaveResult = {
  id?: string;
  success: boolean;
  errors?: unknown[];
};

type SeedOrderItem = {
  orderExternalId: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
};

const seedOrderItemData: SeedOrderItem[] = [
  { orderExternalId: 'SHOP-1001', productSku: 'WM-100', quantity: 1, unitPrice: 29.99 },
  { orderExternalId: 'SHOP-1001', productSku: 'DL-500', quantity: 1, unitPrice: 60.0 },
  { orderExternalId: 'SHOP-1002', productSku: 'DL-500', quantity: 1, unitPrice: 45.0 },
  { orderExternalId: 'SHOP-1003', productSku: 'DL-500', quantity: 1, unitPrice: 45.0 },
  { orderExternalId: 'SHOP-1003', productSku: 'LS-220', quantity: 2, unitPrice: 39.7 },
  { orderExternalId: 'SHOP-1004', productSku: 'RS-900', quantity: 1, unitPrice: 79.9 },
  { orderExternalId: 'SHOP-1005', productSku: 'RS-900', quantity: 2, unitPrice: 79.9 },
  { orderExternalId: 'SHOP-1005', productSku: 'VS-030', quantity: 2, unitPrice: 24.99 },
  { orderExternalId: 'SHOP-1005', productSku: 'LS-220', quantity: 1, unitPrice: 29.97 }
];

function ensureSuccess(result: SaveResult, context: string): string {
  if (!result.success || !result.id) {
    throw new Error(`${context} failed: ${JSON.stringify(result.errors ?? [])}`);
  }

  return result.id;
}

function escapeSoql(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function normalizeOperationType(value: string): string {
  if (value === 'UPSERT_ORDER') return 'UPDATE';
  if (value === 'CAMPAIGN_REFRESH') return 'QUERY';
  return value;
}

async function seedProducts() {
  const conn = await getSalesforceConnection();
  const skuValues = mockProducts.map((product) => `'${escapeSoql(product.sku)}'`).join(', ');
  const existing = await conn.query<{
    Id: string;
    SKU__c: string;
  }>(
    `SELECT Id, SKU__c FROM ${SALESFORCE_OBJECTS.product} WHERE SKU__c IN (${skuValues})`
  );

  const existingBySku = new Map(existing.records.map((record) => [record.SKU__c, record.Id]));
  const productIdsBySku = new Map<string, string>();

  for (const product of mockProducts) {
    const payload = {
      Name: product.name,
      SKU__c: product.sku,
      Price__c: product.price,
      Stock_Quantity__c: product.stockQuantity,
      Category__c: product.category,
      Is_Active__c: product.isActive,
      Image_URL__c: product.imageUrl || null
    };

    const existingId = existingBySku.get(product.sku);

    if (existingId) {
      const updateResult = await conn.sobject(SALESFORCE_OBJECTS.product).update({
        Id: existingId,
        ...payload
      });
      const result = Array.isArray(updateResult) ? updateResult[0] : updateResult;
      productIdsBySku.set(product.sku, ensureSuccess(result, `Product ${product.sku}`));
      continue;
    }

    const createResult = await conn.sobject(SALESFORCE_OBJECTS.product).create(payload);
    const result = Array.isArray(createResult) ? createResult[0] : createResult;
    productIdsBySku.set(product.sku, ensureSuccess(result, `Product ${product.sku}`));
  }

  return productIdsBySku;
}

async function seedCustomers() {
  const conn = await getSalesforceConnection();
  const emailValues = mockCustomers.map((customer) => `'${escapeSoql(customer.email)}'`).join(', ');
  const existing = await conn.query<{
    Id: string;
    Email__c: string;
  }>(
    `SELECT Id, Email__c FROM ${SALESFORCE_OBJECTS.customer} WHERE Email__c IN (${emailValues})`
  );

  const existingByEmail = new Map(existing.records.map((record) => [record.Email__c, record.Id]));
  const customerIdsByEmail = new Map<string, string>();

  for (const customer of mockCustomers) {
    const payload = {
      Name: customer.fullName,
      Email__c: customer.email,
      Phone__c: customer.phone || null,
      Total_Spent__c: customer.totalSpent,
      Customer_Segment__c: customer.customerSegment,
      Last_Order_Date__c: customer.lastOrderDate || null
    };

    const existingId = existingByEmail.get(customer.email);

    if (existingId) {
      const updateResult = await conn.sobject(SALESFORCE_OBJECTS.customer).update({
        Id: existingId,
        ...payload
      });
      const result = Array.isArray(updateResult) ? updateResult[0] : updateResult;
      customerIdsByEmail.set(customer.email, ensureSuccess(result, `Customer ${customer.email}`));
      continue;
    }

    const createResult = await conn.sobject(SALESFORCE_OBJECTS.customer).create(payload);
    const result = Array.isArray(createResult) ? createResult[0] : createResult;
    customerIdsByEmail.set(customer.email, ensureSuccess(result, `Customer ${customer.email}`));
  }

  return customerIdsByEmail;
}

async function seedOrders(customerIdsByEmail: Map<string, string>) {
  const conn = await getSalesforceConnection();
  const orderIdsByExternalId = new Map<string, string>();
  const externalOrderIds = mockOrders
    .map((order) => order.externalOrderId)
    .filter((value): value is string => Boolean(value));
  const externalValues = externalOrderIds.map((value) => `'${escapeSoql(value)}'`).join(', ');
  const existing = externalValues
    ? await conn.query<{
        Id: string;
        External_Order_Id__c: string;
      }>(
        `SELECT Id, External_Order_Id__c
         FROM ${SALESFORCE_OBJECTS.order}
         WHERE External_Order_Id__c IN (${externalValues})`
      )
    : { records: [] };

  const existingByExternalId = new Map(
    existing.records.map((record) => [record.External_Order_Id__c, record.Id])
  );

  for (const order of mockOrders) {
    const customer = mockCustomers.find((item) => item.id === order.customerId);

    if (!customer) {
      throw new Error(`Customer ${order.customerId} not found for order ${order.externalOrderId}`);
    }

    const customerId = customerIdsByEmail.get(customer.email);

    if (!customerId) {
      throw new Error(`Customer Salesforce Id missing for ${customer.email}`);
    }

    const payload = {
      Customer__c: customerId,
      Order_Status__c: order.orderStatus,
      Payment_Status__c: order.paymentStatus,
      Shipping_Status__c: order.shippingStatus,
      Order_Date__c: order.orderDate,
      Total_Amount__c: order.totalAmount,
      External_Order_Id__c: order.externalOrderId || null
    };

    const key = order.externalOrderId;

    if (key && existingByExternalId.has(key)) {
      const updateResult = await conn.sobject(SALESFORCE_OBJECTS.order).update({
        Id: existingByExternalId.get(key)!,
        ...payload
      });
      const result = Array.isArray(updateResult) ? updateResult[0] : updateResult;
      orderIdsByExternalId.set(key, ensureSuccess(result, `Order ${key}`));
      continue;
    }

    const createResult = await conn.sobject(SALESFORCE_OBJECTS.order).create(payload);
    const result = Array.isArray(createResult) ? createResult[0] : createResult;
    const createdId = ensureSuccess(result, `Order ${order.externalOrderId ?? order.id}`);

    if (key) {
      orderIdsByExternalId.set(key, createdId);
    }
  }

  return orderIdsByExternalId;
}

async function seedOrderItems(orderIdsByExternalId: Map<string, string>, productIdsBySku: Map<string, string>) {
  const conn = await getSalesforceConnection();
  const externalValues = [...orderIdsByExternalId.keys()]
    .map((value) => `'${escapeSoql(value)}'`)
    .join(', ');
  const skuValues = [...productIdsBySku.keys()].map((value) => `'${escapeSoql(value)}'`).join(', ');

  const existing =
    externalValues && skuValues
      ? await conn.query<{
          Id: string;
          Order__r?: { External_Order_Id__c?: string };
          Product__r?: { SKU__c?: string };
        }>(
          `SELECT Id, Order__r.External_Order_Id__c, Product__r.SKU__c
           FROM ${SALESFORCE_OBJECTS.orderItem}
           WHERE Order__r.External_Order_Id__c IN (${externalValues})
           AND Product__r.SKU__c IN (${skuValues})`
        )
      : { records: [] };

  const existingByComposite = new Map<string, string>();
  for (const record of existing.records) {
    const orderExternalId = record.Order__r?.External_Order_Id__c;
    const productSku = record.Product__r?.SKU__c;
    if (orderExternalId && productSku) {
      existingByComposite.set(`${orderExternalId}::${productSku}`, record.Id);
    }
  }

  for (const item of seedOrderItemData) {
    const orderId = orderIdsByExternalId.get(item.orderExternalId);
    const productId = productIdsBySku.get(item.productSku);

    if (!orderId || !productId) {
      throw new Error(`Missing relation for order item ${item.orderExternalId} / ${item.productSku}`);
    }

    const payload = {
      Order__c: orderId,
      Product__c: productId,
      Quantity__c: item.quantity,
      Unit_Price__c: item.unitPrice
    };

    const compositeKey = `${item.orderExternalId}::${item.productSku}`;
    const existingId = existingByComposite.get(compositeKey);

    if (existingId) {
      const updateResult = await conn.sobject(SALESFORCE_OBJECTS.orderItem).update({
        Id: existingId,
        Quantity__c: item.quantity,
        Unit_Price__c: item.unitPrice
      });
      const result = Array.isArray(updateResult) ? updateResult[0] : updateResult;
      ensureSuccess(result, `Order item ${compositeKey}`);
      continue;
    }

    const createResult = await conn.sobject(SALESFORCE_OBJECTS.orderItem).create(payload);
    const result = Array.isArray(createResult) ? createResult[0] : createResult;
    ensureSuccess(result, `Order item ${compositeKey}`);
  }
}

async function seedReturns(orderIdsByExternalId: Map<string, string>) {
  const conn = await getSalesforceConnection();
  const externalValues = [...orderIdsByExternalId.keys()]
    .map((value) => `'${escapeSoql(value)}'`)
    .join(', ');

  const existing = externalValues
    ? await conn.query<{
        Id: string;
        Reason__c: string;
        Order__r?: { External_Order_Id__c?: string };
      }>(
        `SELECT Id, Reason__c, Order__r.External_Order_Id__c
         FROM ${SALESFORCE_OBJECTS.returnRequest}
         WHERE Order__r.External_Order_Id__c IN (${externalValues})`
      )
    : { records: [] };

  const existingByComposite = new Map<string, string>();
  for (const record of existing.records) {
    const orderExternalId = record.Order__r?.External_Order_Id__c;
    if (orderExternalId) {
      existingByComposite.set(`${orderExternalId}::${record.Reason__c}`, record.Id);
    }
  }

  for (const returnRequest of mockReturns) {
    const order = mockOrders.find((item) => item.id === returnRequest.orderId);
    const orderExternalId = order?.externalOrderId;

    if (!orderExternalId) {
      throw new Error(`Missing external order id for return ${returnRequest.id}`);
    }

    const orderId = orderIdsByExternalId.get(orderExternalId);
    if (!orderId) {
      throw new Error(`Missing Salesforce order id for return ${returnRequest.id}`);
    }

    const payload = {
      Order__c: orderId,
      Reason__c: returnRequest.reason,
      Status__c: returnRequest.status,
      Refund_Amount__c: returnRequest.refundAmount,
      Requested_Date__c: returnRequest.requestedDate
    };

    const compositeKey = `${orderExternalId}::${returnRequest.reason}`;
    const existingId = existingByComposite.get(compositeKey);

    if (existingId) {
      const updateResult = await conn.sobject(SALESFORCE_OBJECTS.returnRequest).update({
        Id: existingId,
        ...payload
      });
      const result = Array.isArray(updateResult) ? updateResult[0] : updateResult;
      ensureSuccess(result, `Return ${compositeKey}`);
      continue;
    }

    const createResult = await conn.sobject(SALESFORCE_OBJECTS.returnRequest).create(payload);
    const result = Array.isArray(createResult) ? createResult[0] : createResult;
    ensureSuccess(result, `Return ${compositeKey}`);
  }
}

async function seedCampaigns() {
  const conn = await getSalesforceConnection();
  const nameValues = mockCampaigns.map((campaign) => `'${escapeSoql(campaign.campaignName)}'`).join(', ');
  const existing = await conn.query<{
    Id: string;
    Name: string;
  }>(
    `SELECT Id, Name FROM ${SALESFORCE_OBJECTS.campaign} WHERE Name IN (${nameValues})`
  );

  const existingByName = new Map(existing.records.map((record) => [record.Name, record.Id]));

  for (const campaign of mockCampaigns) {
    const payload = {
      Name: campaign.campaignName,
      Discount_Code__c: campaign.discountCode,
      Revenue_Generated__c: campaign.revenueGenerated,
      Orders_Count__c: campaign.ordersCount,
      Conversion_Rate__c: campaign.conversionRate / 100,
      Status__c: campaign.status
    };

    const existingId = existingByName.get(campaign.campaignName);

    if (existingId) {
      const updateResult = await conn.sobject(SALESFORCE_OBJECTS.campaign).update({
        Id: existingId,
        ...payload
      });
      const result = Array.isArray(updateResult) ? updateResult[0] : updateResult;
      ensureSuccess(result, `Campaign ${campaign.campaignName}`);
      continue;
    }

    const createResult = await conn.sobject(SALESFORCE_OBJECTS.campaign).create(payload);
    const result = Array.isArray(createResult) ? createResult[0] : createResult;
    ensureSuccess(result, `Campaign ${campaign.campaignName}`);
  }
}

async function seedSyncLogs(orderIdsByExternalId: Map<string, string>) {
  const conn = await getSalesforceConnection();

  for (const log of mockSyncLogs) {
    let recordId = log.recordId;
    if (recordId && orderIdsByExternalId.has('SHOP-1005') && recordId === 'o5') {
      recordId = orderIdsByExternalId.get('SHOP-1005');
    }

    const payload = {
      Source_System__c: log.sourceSystem,
      Operation_Type__c: normalizeOperationType(log.operationType),
      Status__c: log.status,
      Message__c: log.message,
      Record_Id__c: recordId || null,
      Created_At__c: log.createdAt
    };

    const createResult = await conn.sobject(SALESFORCE_OBJECTS.syncLog).create(payload);
    const result = Array.isArray(createResult) ? createResult[0] : createResult;
    ensureSuccess(result, `Sync log ${log.operationType}`);
  }
}

async function main() {
  const conn = await getSalesforceConnection();
  const identity = await conn.identity();

  console.log(`Seeding Salesforce org: ${identity.organization_id}`);
  console.log(`User: ${identity.username}`);

  const productIdsBySku = await seedProducts();
  const customerIdsByEmail = await seedCustomers();
  const orderIdsByExternalId = await seedOrders(customerIdsByEmail);
  await seedOrderItems(orderIdsByExternalId, productIdsBySku);
  await seedReturns(orderIdsByExternalId);
  await seedCampaigns();
  await seedSyncLogs(orderIdsByExternalId);

  console.log('Salesforce seed completed successfully.');
  console.log(
    JSON.stringify(
      {
        products: productIdsBySku.size,
        customers: customerIdsByEmail.size,
        orders: orderIdsByExternalId.size,
        orderItems: seedOrderItemData.length,
        returns: mockReturns.length,
        campaigns: mockCampaigns.length,
        syncLogs: mockSyncLogs.length
      },
      null,
      2
    )
  );
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
