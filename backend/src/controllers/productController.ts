import type { Request, Response } from 'express';
import { getCommerceRepository } from '../repositories/repositoryFactory';

export async function listProducts(req: Request, res: Response) {
  const repository = getCommerceRepository();
  const products = await repository.listProducts(req.query.search?.toString());

  res.json({
    success: true,
    data: products
  });
}

export async function createProduct(req: Request, res: Response) {
  const repository = getCommerceRepository();
  const product = await repository.createProduct(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
}

export async function updateProduct(req: Request, res: Response) {
  const repository = getCommerceRepository();
  const product = await repository.updateProduct(req.params.id, req.body);

  res.json({
    success: true,
    data: product
  });
}
