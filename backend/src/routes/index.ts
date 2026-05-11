import { Router } from 'express';
import { listCampaigns } from '../controllers/campaignController';
import { listCustomers } from '../controllers/customerController';
import { getDashboardSummary } from '../controllers/dashboardController';
import { listOrders, updateOrderStatus } from '../controllers/orderController';
import { createProduct, listProducts, updateProduct } from '../controllers/productController';
import { listReturns } from '../controllers/returnController';
import { listSyncLogs, testConnection } from '../controllers/syncController';
import { validateBody } from '../middleware/validate';
import { updateOrderStatusSchema } from '../schemas/orderSchemas';
import { createProductSchema, updateProductSchema } from '../schemas/productSchemas';
import { asyncHandler } from '../utils/asyncHandler';

export const apiRouter = Router();

apiRouter.get('/dashboard/summary', asyncHandler(getDashboardSummary));

apiRouter.get('/products', asyncHandler(listProducts));
apiRouter.post('/products', validateBody(createProductSchema), asyncHandler(createProduct));
apiRouter.patch('/products/:id', validateBody(updateProductSchema), asyncHandler(updateProduct));

apiRouter.get('/customers', asyncHandler(listCustomers));

apiRouter.get('/orders', asyncHandler(listOrders));
apiRouter.patch(
  '/orders/:id/status',
  validateBody(updateOrderStatusSchema),
  asyncHandler(updateOrderStatus)
);

apiRouter.get('/returns', asyncHandler(listReturns));
apiRouter.get('/campaigns', asyncHandler(listCampaigns));

apiRouter.get('/sync/logs', asyncHandler(listSyncLogs));
apiRouter.post('/sync/test', asyncHandler(testConnection));
