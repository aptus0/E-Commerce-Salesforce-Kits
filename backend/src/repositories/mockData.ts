import type {
  CampaignPerformance,
  CommerceOrder,
  CustomerProfile,
  Product,
  ReturnRequest,
  SyncLog
} from '../types/domain';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Mouse',
    sku: 'WM-100',
    price: 29.99,
    stockQuantity: 22,
    category: 'Electronics',
    isActive: true,
    imageUrl: ''
  },
  {
    id: 'p2',
    name: 'Organic Coffee',
    sku: 'OC-250',
    price: 14.5,
    stockQuantity: 4,
    category: 'Grocery',
    isActive: true,
    imageUrl: ''
  },
  {
    id: 'p3',
    name: 'Desk Lamp',
    sku: 'DL-500',
    price: 45,
    stockQuantity: 11,
    category: 'Home',
    isActive: true,
    imageUrl: ''
  }
];

export const mockCustomers: CustomerProfile[] = [
  {
    id: 'c1',
    fullName: 'Emily Carter',
    email: 'emily@example.com',
    phone: '+1 555 100 200',
    totalSpent: 1280,
    customerSegment: 'VIP',
    lastOrderDate: '2026-05-01'
  },
  {
    id: 'c2',
    fullName: 'Sam Wilson',
    email: 'sam@example.com',
    phone: '+1 555 300 400',
    totalSpent: 220,
    customerSegment: 'Regular',
    lastOrderDate: '2026-04-18'
  }
];

export const mockOrders: CommerceOrder[] = [
  {
    id: 'o1',
    orderNumber: 'ORD-000001',
    customerId: 'c1',
    customerName: 'Emily Carter',
    orderStatus: 'Paid',
    paymentStatus: 'Paid',
    shippingStatus: 'Preparing',
    totalAmount: 89.99,
    orderDate: '2026-05-10T10:30:00.000Z',
    externalOrderId: 'SHOP-1001'
  },
  {
    id: 'o2',
    orderNumber: 'ORD-000002',
    customerId: 'c2',
    customerName: 'Sam Wilson',
    orderStatus: 'Pending',
    paymentStatus: 'Pending',
    shippingStatus: 'Not Started',
    totalAmount: 45,
    orderDate: '2026-05-09T14:00:00.000Z',
    externalOrderId: 'SHOP-1002'
  }
];

export const mockReturns: ReturnRequest[] = [
  {
    id: 'r1',
    returnNumber: 'RET-000001',
    orderId: 'o2',
    orderNumber: 'ORD-000002',
    reason: 'Customer selected wrong product.',
    status: 'Requested',
    refundAmount: 45,
    requestedDate: '2026-05-10'
  }
];

export const mockCampaigns: CampaignPerformance[] = [
  {
    id: 'cp1',
    campaignName: 'Spring Sale',
    discountCode: 'SPRING20',
    revenueGenerated: 4500,
    ordersCount: 82,
    conversionRate: 8.4,
    status: 'Active'
  },
  {
    id: 'cp2',
    campaignName: 'VIP Weekend',
    discountCode: 'VIP15',
    revenueGenerated: 2100,
    ordersCount: 31,
    conversionRate: 6.1,
    status: 'Completed'
  }
];

export const mockSyncLogs: SyncLog[] = [
  {
    id: 's1',
    sourceSystem: 'CommercePulse',
    operationType: 'HEALTH_CHECK',
    status: 'SUCCESS',
    message: 'Mock mode is running successfully.',
    createdAt: '2026-05-11T09:00:00.000Z'
  },
  {
    id: 's2',
    sourceSystem: 'CommercePulse',
    operationType: 'QUERY',
    status: 'WARNING',
    message: 'Salesforce mode is not enabled. Using mock repository.',
    createdAt: '2026-05-11T09:01:00.000Z'
  }
];
