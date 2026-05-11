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
  },
  {
    id: 'p4',
    name: 'Running Shoes',
    sku: 'RS-900',
    price: 79.9,
    stockQuantity: 18,
    category: 'Fashion',
    isActive: true,
    imageUrl: ''
  },
  {
    id: 'p5',
    name: 'Vitamin C Serum',
    sku: 'VS-030',
    price: 24.99,
    stockQuantity: 9,
    category: 'Beauty',
    isActive: true,
    imageUrl: ''
  },
  {
    id: 'p6',
    name: 'Laptop Stand',
    sku: 'LS-220',
    price: 39.5,
    stockQuantity: 3,
    category: 'Electronics',
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
  },
  {
    id: 'c3',
    fullName: 'Olivia Brooks',
    email: 'olivia@example.com',
    phone: '+1 555 410 510',
    totalSpent: 540,
    customerSegment: 'Regular',
    lastOrderDate: '2026-05-08'
  },
  {
    id: 'c4',
    fullName: 'Daniel Kim',
    email: 'daniel@example.com',
    phone: '+1 555 610 710',
    totalSpent: 75,
    customerSegment: 'New',
    lastOrderDate: '2026-05-10'
  },
  {
    id: 'c5',
    fullName: 'Sophia Martinez',
    email: 'sophia@example.com',
    phone: '+1 555 810 910',
    totalSpent: 1840,
    customerSegment: 'VIP',
    lastOrderDate: '2026-05-11'
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
  },
  {
    id: 'o3',
    orderNumber: 'ORD-000003',
    customerId: 'c3',
    customerName: 'Olivia Brooks',
    orderStatus: 'Shipped',
    paymentStatus: 'Paid',
    shippingStatus: 'Shipped',
    totalAmount: 124.4,
    orderDate: '2026-05-08T09:15:00.000Z',
    externalOrderId: 'SHOP-1003'
  },
  {
    id: 'o4',
    orderNumber: 'ORD-000004',
    customerId: 'c4',
    customerName: 'Daniel Kim',
    orderStatus: 'Delivered',
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered',
    totalAmount: 79.9,
    orderDate: '2026-05-07T16:20:00.000Z',
    externalOrderId: 'SHOP-1004'
  },
  {
    id: 'o5',
    orderNumber: 'ORD-000005',
    customerId: 'c5',
    customerName: 'Sophia Martinez',
    orderStatus: 'Preparing',
    paymentStatus: 'Paid',
    shippingStatus: 'Preparing',
    totalAmount: 239.75,
    orderDate: '2026-05-11T07:45:00.000Z',
    externalOrderId: 'SHOP-1005'
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
  },
  {
    id: 'r2',
    returnNumber: 'RET-000002',
    orderId: 'o3',
    orderNumber: 'ORD-000003',
    reason: 'Package arrived damaged.',
    status: 'Approved',
    refundAmount: 124.4,
    requestedDate: '2026-05-09'
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
  },
  {
    id: 'cp3',
    campaignName: 'Summer Launch',
    discountCode: 'SUN25',
    revenueGenerated: 6320,
    ordersCount: 104,
    conversionRate: 9.2,
    status: 'Active'
  },
  {
    id: 'cp4',
    campaignName: 'Reactivation Push',
    discountCode: 'COME10',
    revenueGenerated: 980,
    ordersCount: 18,
    conversionRate: 4.7,
    status: 'Paused'
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
  },
  {
    id: 's3',
    sourceSystem: 'CommercePulse',
    operationType: 'UPSERT_ORDER',
    status: 'SUCCESS',
    message: 'Order ORD-000005 synced into the local mock pipeline.',
    recordId: 'o5',
    createdAt: '2026-05-11T09:05:00.000Z'
  },
  {
    id: 's4',
    sourceSystem: 'Salesforce',
    operationType: 'CAMPAIGN_REFRESH',
    status: 'SUCCESS',
    message: 'Campaign metrics cache refreshed for 4 active or recent campaigns.',
    createdAt: '2026-05-11T09:08:00.000Z'
  }
];
