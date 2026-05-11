import { Card } from '../components/ui/Card';
import { DataState } from '../components/ui/DataState';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAsyncData } from '../hooks/useAsyncData';
import { getCustomers } from '../services/commerceApi';
import { formatCurrency, formatDate } from '../utils/format';

export function CustomersPage() {
  const { data, loading, error } = useAsyncData(getCustomers);

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="Customers"
        description="View customer profiles, total spending and segmentation from Salesforce."
      />

      <Card>
        <DataState loading={loading} error={error}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-3">Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Total Spent</th>
                  <th>Segment</th>
                  <th>Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.map((customer) => (
                  <tr key={customer.id}>
                    <td className="py-3 font-semibold">{customer.fullName}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone ?? '-'}</td>
                    <td>{formatCurrency(customer.totalSpent)}</td>
                    <td>
                      <StatusBadge value={customer.customerSegment} />
                    </td>
                    <td>{formatDate(customer.lastOrderDate)}</td>
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
