import { config } from '../config/env';
import type {
  CampaignPerformance,
  CommerceOrder,
  CustomerProfile,
  DashboardSummary,
  Product,
  ReturnRequest,
  SyncLog
} from '../types/domain';
import type {
  ICommerceRepository,
  OrderStatusUpdateInput,
  ProductCreateInput,
  ProductUpdateInput
} from './ICommerceRepository';
import {
  mockCampaigns,
  mockCustomers,
  mockOrders,
  mockProducts,
  mockReturns,
  mockSyncLogs
} from './mockData';

export class MockCommerceRepository implements ICommerceRepository {
  private products = [...mockProducts];
  private orders = [...mockOrders];

  async getDashboardSummary(): Promise<DashboardSummary> {
    const totalRevenue = this.orders
      .filter((order) => order.paymentStatus === 'Paid')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalRevenue,
      totalOrders: this.orders.length,
      pendingOrders: this.orders.filter((order) => order.orderStatus === 'Pending').length,
      vipCustomers: mockCustomers.filter((customer) => customer.customerSegment === 'VIP').length,
      failedSyncCount: mockSyncLogs.filter((log) => log.status === 'FAILED').length,
      lowStockProducts: this.products.filter(
        (product) => product.stockQuantity <= config.lowStockThreshold
      ).length,
      recentOrders: this.orders.slice(0, 5),
      topProducts: this.products.slice(0, 5)
    };
  }

  async listProducts(search?: string): Promise<Product[]> {
    if (!search) return this.products;

    const normalized = search.toLowerCase();

    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalized) ||
        product.sku.toLowerCase().includes(normalized)
    );
  }

  async createProduct(input: ProductCreateInput): Promise<Product> {
    const product: Product = {
      id: `mock-product-${Date.now()}`,
      ...input
    };

    this.products.unshift(product);
    return product;
  }

  async updateProduct(id: string, input: ProductUpdateInput): Promise<Product> {
    const product = this.products.find((item) => item.id === id);

    if (!product) {
      throw new Error('Product not found');
    }

    Object.assign(product, input);
    return product;
  }

  async listCustomers(): Promise<CustomerProfile[]> {
    return mockCustomers;
  }

  async listOrders(): Promise<CommerceOrder[]> {
    return this.orders;
  }

  async updateOrderStatus(id: string, input: OrderStatusUpdateInput): Promise<CommerceOrder> {
    const order = this.orders.find((item) => item.id === id);

    if (!order) {
      throw new Error('Order not found');
    }

    Object.assign(order, input);
    return order;
  }

  async listReturns(): Promise<ReturnRequest[]> {
    return mockReturns;
  }

  async listCampaigns(): Promise<CampaignPerformance[]> {
    return mockCampaigns;
  }

  async listSyncLogs(): Promise<SyncLog[]> {
    return mockSyncLogs;
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    return {
      ok: true,
      message: 'Mock repository is active. Set USE_MOCK_DATA=false for Salesforce mode.'
    };
  }
}
