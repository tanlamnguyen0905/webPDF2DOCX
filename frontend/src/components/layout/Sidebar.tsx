'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils/format';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const adminNav: NavItem[] = [
  { href: ROUTES.admin, label: 'Dashboard', icon: '📊' },
  { href: ROUTES.adminUsers, label: 'Người dùng', icon: '👥' },
  { href: ROUTES.adminCoinPackages, label: 'Gói coin', icon: '🪙' },
  { href: ROUTES.adminConversions, label: 'Chuyển đổi', icon: '📄' },
  { href: ROUTES.adminPayments, label: 'Thanh toán', icon: '💳' },
  { href: ROUTES.adminCoinTransactions, label: 'Giao dịch coin', icon: '🔄' },
  { href: ROUTES.adminTickets, label: 'Khiếu nại', icon: '🎫' },
  { href: ROUTES.adminSupportUsers, label: 'Hỗ trợ viên', icon: '👤' },
  { href: ROUTES.adminSettings, label: 'Cấu hình', icon: '⚙️' },
  { href: ROUTES.adminAuditLogs, label: 'Nhật ký', icon: '📝' },
];

const supportNav: NavItem[] = [
  { href: ROUTES.supportDashboard, label: 'Dashboard', icon: '📊' },
  { href: '/support-dashboard/tickets', label: 'Ticket', icon: '🎫' },
];

export function Sidebar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const items = isAdmin ? adminNav : supportNav;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen hidden lg:block">
      <nav className="p-4 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
