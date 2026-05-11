import type { Request, Response } from 'express';
import { getCommerceRepository } from '../repositories/repositoryFactory';

export async function listReturns(_req: Request, res: Response) {
  const repository = getCommerceRepository();
  const returns = await repository.listReturns();

  res.json({
    success: true,
    data: returns
  });
}
