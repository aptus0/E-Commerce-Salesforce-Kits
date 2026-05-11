import { Card } from '../components/ui/Card';
import { DataState } from '../components/ui/DataState';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAsyncData } from '../hooks/useAsyncData';
import { getCampaigns } from '../services/commerceApi';
import { formatCurrency } from '../utils/format';

export function CampaignsPage() {
  const { data, loading, error } = useAsyncData(getCampaigns);

  return (
    <>
      <PageHeader
        eyebrow="Marketing"
        title="Campaign Performance"
        description="Measure campaign revenue, order count and conversion rate from Salesforce."
      />

      <Card>
        <DataState loading={loading} error={error}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-3">Campaign</th>
                  <th>Code</th>
                  <th>Revenue</th>
                  <th>Orders</th>
                  <th>Conversion</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="py-3 font-semibold">{campaign.campaignName}</td>
                    <td>{campaign.discountCode}</td>
                    <td>{formatCurrency(campaign.revenueGenerated)}</td>
                    <td>{campaign.ordersCount}</td>
                    <td>{campaign.conversionRate}%</td>
                    <td>
                      <StatusBadge value={campaign.status} />
                    </td>
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
