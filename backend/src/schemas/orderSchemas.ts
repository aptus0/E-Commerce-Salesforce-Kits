import { z } from 'zod';

export const updateOrderStatusSchema = z.object({
  orderStatus: z
    .enum(['Pending', 'Paid', 'Preparing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'])
    .optional(),
  paymentStatus: z.enum(['Pending', 'Paid', 'Failed', 'Refunded']).optional(),
  shippingStatus: z.enum(['Not Started', 'Preparing', 'Shipped', 'Delivered']).optional()
});
