import { config } from '../config/env';
import type { ICommerceRepository } from './ICommerceRepository';
import { MockCommerceRepository } from './MockCommerceRepository';
import { SalesforceCommerceRepository } from './SalesforceCommerceRepository';

let repository: ICommerceRepository | null = null;

export function getCommerceRepository(): ICommerceRepository {
  if (repository) return repository;

  repository = config.useMockData
    ? new MockCommerceRepository()
    : new SalesforceCommerceRepository();

  return repository;
}
