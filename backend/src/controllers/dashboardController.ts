import type { Request, Response } from 'express';
import { getCommerceRepository } from '../repositories/repositoryFactory';

export async function getDashboardSummary(_req: Request, res: Response) {
  const repository = getCommerceRepository();
  const data = await repository.getDashboardSummary();

  res.json({
    success: true,
    data
  });
}
