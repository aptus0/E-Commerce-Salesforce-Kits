import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../components/ui/Card';
import { DataState } from '../components/ui/DataState';
import { MetricCard } from '../components/ui/MetricCard';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAsyncData } from '../hooks/useAsyncData';
import { getDashboardSummary } from '../services/commerceApi';
import { formatCurrency, formatDate } from '../utils/format';

export function DashboardPage() {
  const { data, loading, error } = useAsyncData(getDashboardSummary);

  const chartData =
    data?.recentOrders.map((order) => ({
      name: order.orderNumber,
      revenue: order.totalAmount
    })) ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Commerce Dashboard"
        description="Monitor sales, orders, customers, low stock alerts and Salesforce synchronization status."
      />

      <DataState loading={loading} error={error}>
        {data ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              <MetricCard label="Total Revenue" value={formatCurrency(data.totalRevenue)} />
              <MetricCard label="Total Orders" value={data.totalOrders} />
              <MetricCard label="Pending Orders" value={data.pendingOrders} />
              <MetricCard label="VIP Customers" value={data.vipCustomers} />
              <MetricCard label="Failed Sync" value={data.failedSyncCount} />
              <MetricCard label="Low Stock" value={data.lowStockProducts} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <Card title="Recent Order Revenue">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Recent Orders">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-slate-500">
                      <tr>
                        <th className="py-3">Order</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="py-3 font-semibold">{order.orderNumber}</td>
                          <td>{order.customerName}</td>
                          <td>
                            <StatusBadge value={order.orderStatus} />
                          </td>
                          <td>{formatCurrency(order.totalAmount)}</td>
                          <td>{formatDate(order.orderDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        ) : null}
      </DataState>
    </>
  );
}
