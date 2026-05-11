import type { Request, Response } from 'express';
import { getCommerceRepository } from '../repositories/repositoryFactory';

export async function listSyncLogs(_req: Request, res: Response) {
  const repository = getCommerceRepository();
  const logs = await repository.listSyncLogs();

  res.json({
    success: true,
    data: logs
  });
}

export async function testConnection(_req: Request, res: Response) {
  const repository = getCommerceRepository();
  const result = await repository.testConnection();

  res.json({
    success: true,
    data: result
  });
}
