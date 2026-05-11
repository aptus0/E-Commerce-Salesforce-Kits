import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Boxes,
  Megaphone,
  Package,
  RefreshCw,
  RotateCcw,
  Settings,
  ShoppingCart,
  Users
} from 'lucide-react';

const navigation = [
  { label: 'Dashboard', to: '/dashboard', icon: BarChart3 },
  { label: 'Products', to: '/products', icon: Package },
  { label: 'Orders', to: '/orders', icon: ShoppingCart },
  { label: 'Customers', to: '/customers', icon: Users },
  { label: 'Returns', to: '/returns', icon: RotateCcw },
  { label: 'Campaigns', to: '/campaigns', icon: Megaphone },
  { label: 'Sync Center', to: '/sync', icon: RefreshCw },
  { label: 'Settings', to: '/settings', icon: Settings }
];

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Boxes size={22} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Starter Kit</p>
            <h1 className="text-lg font-bold">CommercePulse 360</h1>
          </div>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'bg-slate-900 text-white shadow-soft'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  ].join(' ')
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-slate-500">Salesforce Integrated E-Commerce Kit</p>
              <h2 className="text-xl font-bold">Operations Control Center</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              API Ready
            </div>
          </div>
        </header>

        <div className="px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
