import type {
  CampaignPerformance,
  CommerceOrder,
  CustomerProfile,
  DashboardSummary,
  Product,
  ReturnRequest,
  SyncLog
} from '../types/domain';

export interface ProductCreateInput {
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  category: Product['category'];
  isActive: boolean;
  imageUrl?: string;
}

export type ProductUpdateInput = Partial<ProductCreateInput>;

export interface OrderStatusUpdateInput {
  orderStatus?: CommerceOrder['orderStatus'];
  paymentStatus?: CommerceOrder['paymentStatus'];
  shippingStatus?: CommerceOrder['shippingStatus'];
}

export interface ICommerceRepository {
  getDashboardSummary(): Promise<DashboardSummary>;

  listProducts(search?: string): Promise<Product[]>;
  createProduct(input: ProductCreateInput): Promise<Product>;
  updateProduct(id: string, input: ProductUpdateInput): Promise<Product>;

  listCustomers(): Promise<CustomerProfile[]>;
  listOrders(): Promise<CommerceOrder[]>;
  updateOrderStatus(id: string, input: OrderStatusUpdateInput): Promise<CommerceOrder>;

  listReturns(): Promise<ReturnRequest[]>;
  listCampaigns(): Promise<CampaignPerformance[]>;
  listSyncLogs(): Promise<SyncLog[]>;

  testConnection(): Promise<{ ok: boolean; message: string }>;
}

