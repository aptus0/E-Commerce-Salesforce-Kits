import type { Request, Response } from 'express';
import { getCommerceRepository } from '../repositories/repositoryFactory';

export async function listCampaigns(_req: Request, res: Response) {
  const repository = getCommerceRepository();
  const campaigns = await repository.listCampaigns();

  res.json({
    success: true,
    data: campaigns
  });
}
