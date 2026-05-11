import { Card } from '../components/ui/Card';
import { DataState } from '../components/ui/DataState';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAsyncData } from '../hooks/useAsyncData';
import { getReturns } from '../services/commerceApi';
import { formatCurrency, formatDate } from '../utils/format';

export function ReturnsPage() {
  const { data, loading, error } = useAsyncData(getReturns);

  return (
    <>
      <PageHeader
        eyebrow="After Sales"
        title="Return Requests"
        description="Track customer return requests and refund status."
      />

      <Card>
        <DataState loading={loading} error={error}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-3">Return</th>
                  <th>Order</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Refund</th>
                  <th>Requested</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 font-semibold">{item.returnNumber}</td>
                    <td>{item.orderNumber}</td>
                    <td>{item.reason}</td>
                    <td>
                      <StatusBadge value={item.status} />
                    </td>
                    <td>{formatCurrency(item.refundAmount)}</td>
                    <td>{formatDate(item.requestedDate)}</td>
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
