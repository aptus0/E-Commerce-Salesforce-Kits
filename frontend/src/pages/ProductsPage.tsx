import { useCallback, useState } from 'react';
import { Card } from '../components/ui/Card';
import { DataState } from '../components/ui/DataState';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAsyncData } from '../hooks/useAsyncData';
import { getProducts } from '../services/commerceApi';
import { formatCurrency } from '../utils/format';

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const loader = useCallback(() => getProducts(search), [search]);
  const { data, loading, error, reload } = useAsyncData(loader);

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="Manage e-commerce products that are stored in Salesforce."
      />

      <Card>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-500 md:max-w-sm"
            placeholder="Search product or SKU"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            onClick={() => void reload()}
          >
            Search
          </button>
        </div>

        <DataState loading={loading} error={error}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-3">Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.map((product) => (
                  <tr key={product.id}>
                    <td className="py-3 font-semibold">{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.stockQuantity}</td>
                    <td>
                      <StatusBadge value={product.isActive ? 'Active' : 'Paused'} />
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
