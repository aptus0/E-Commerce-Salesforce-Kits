import type { Request, Response } from 'express';
import { getCommerceRepository } from '../repositories/repositoryFactory';

export async function listOrders(_req: Request, res: Response) {
  const repository = getCommerceRepository();
  const orders = await repository.listOrders();

  res.json({
    success: true,
    data: orders
  });
}

export async function updateOrderStatus(req: Request, res: Response) {
  const repository = getCommerceRepository();
  const order = await repository.updateOrderStatus(req.params.id, req.body);

  res.json({
    success: true,
    data: order
  });
}
