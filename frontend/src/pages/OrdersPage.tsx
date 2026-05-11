import { Card } from '../components/ui/Card';
import { DataState } from '../components/ui/DataState';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAsyncData } from '../hooks/useAsyncData';
import { getOrders } from '../services/commerceApi';
import { formatCurrency, formatDate } from '../utils/format';

export function OrdersPage() {
  const { data, loading, error } = useAsyncData(getOrders);

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Orders"
        description="Track order, payment and shipping statuses from Salesforce."
      />

      <Card>
        <DataState loading={loading} error={error}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-3">Order</th>
                  <th>Customer</th>
                  <th>Order Status</th>
                  <th>Payment</th>
                  <th>Shipping</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 font-semibold">{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>
                      <StatusBadge value={order.orderStatus} />
                    </td>
                    <td>
                      <StatusBadge value={order.paymentStatus} />
                    </td>
                    <td>
                      <StatusBadge value={order.shippingStatus} />
                    </td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td>{formatDate(order.orderDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataState>
      </Card>
    </>
  );
}
