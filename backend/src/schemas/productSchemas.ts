import { z } from 'zod';

export const productCategorySchema = z.enum([
  'Electronics',
  'Fashion',
  'Grocery',
  'Home',
  'Beauty',
  'Other'
]);

export const createProductSchema = z.object({
  name: z.string().min(2).max(120),
  sku: z.string().min(2).max(80),
  price: z.number().nonnegative(),
  stockQuantity: z.number().int().nonnegative(),
  category: productCategorySchema,
  isActive: z.boolean().default(true),
  imageUrl: z.string().url().optional().or(z.literal(''))
});

export const updateProductSchema = createProductSchema.partial();
