import type { Request, Response } from 'express';
import { getCommerceRepository } from '../repositories/repositoryFactory';

export async function listCustomers(_req: Request, res: Response) {
  const repository = getCommerceRepository();
  const customers = await repository.listCustomers();

  res.json({
    success: true,
    data: customers
  });
}
