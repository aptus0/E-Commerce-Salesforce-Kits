import type {
  CampaignPerformance,
  CommerceOrder,
  CustomerProfile,
  DashboardSummary,
  Product,
  ReturnRequest,
  SyncLog
} from '../types/domain';
import { http, type ApiResponse } from './http';

export async function getDashboardSummary() {
  const response = await http.get<ApiResponse<DashboardSummary>>('/api/dashboard/summary');
  return response.data.data;
}

export async function getProducts(search?: string) {
  const response = await http.get<ApiResponse<Product[]>>('/api/products', {
    params: search ? { search } : undefined
  });

  return response.data.data;
}

export async function getCustomers() {
  const response = await http.get<ApiResponse<CustomerProfile[]>>('/api/customers');
  return response.data.data;
}

export async function getOrders() {
  const response = await http.get<ApiResponse<CommerceOrder[]>>('/api/orders');
  return response.data.data;
}

export async function getReturns() {
  const response = await http.get<ApiResponse<ReturnRequest[]>>('/api/returns');
  return response.data.data;
}

export async function getCampaigns() {
  const response = await http.get<ApiResponse<CampaignPerformance[]>>('/api/campaigns');
  return response.data.data;
}

export async function getSyncLogs() {
  const response = await http.get<ApiResponse<SyncLog[]>>('/api/sync/logs');
  return response.data.data;
}

export async function testSalesforceConnection() {
  const response = await http.post<ApiResponse<{ ok: boolean; message: string }>>('/api/sync/test');
  return response.data.data;
}
