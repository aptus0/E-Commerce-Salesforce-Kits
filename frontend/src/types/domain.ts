export type ProductCategory =
  | 'Electronics'
  | 'Fashion'
  | 'Grocery'
  | 'Home'
  | 'Beauty'
  | 'Other';

export type OrderStatus =
  | 'Pending'
  | 'Paid'
  | 'Preparing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';
export type ShippingStatus = 'Not Started' | 'Preparing' | 'Shipped' | 'Delivered';
export type CustomerSegment = 'New' | 'Regular' | 'VIP' | 'At Risk' | 'Lost';
export type ReturnStatus = 'Requested' | 'Approved' | 'Rejected' | 'Refunded';
export type CampaignStatus = 'Draft' | 'Active' | 'Completed' | 'Paused';
export type SyncStatus = 'SUCCESS' | 'FAILED' | 'WARNING';

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  category: ProductCategory;
  isActive: boolean;
  imageUrl?: string;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  totalSpent: number;
  customerSegment: CustomerSegment;
  lastOrderDate?: string;
}

export interface CommerceOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  totalAmount: number;
  orderDate: string;
  externalOrderId?: string;
}

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderId: string;
  orderNumber: string;
  reason: string;
  status: ReturnStatus;
  refundAmount: number;
  requestedDate: string;
}

export interface CampaignPerformance {
  id: string;
  campaignName: string;
  discountCode: string;
  revenueGenerated: number;
  ordersCount: number;
  conversionRate: number;
  status: CampaignStatus;
}

export interface SyncLog {
  id: string;
  sourceSystem: string;
  operationType: string;
  status: SyncStatus;
  message: string;
  recordId?: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  vipCustomers: number;
  failedSyncCount: number;
  lowStockProducts: number;
  recentOrders: CommerceOrder[];
  topProducts: Product[];
}
