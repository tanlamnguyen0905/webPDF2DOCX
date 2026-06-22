// Tập trung định nghĩa route để tránh hard-code chuỗi rải rác.
export const ROUTES = {
  home: '/',
  upload: '/upload',
  pricing: '/pricing',
  guide: '/guide',
  support: '/support',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',

  dashboard: '/dashboard',
  conversions: '/conversions',
  conversion: (id: string | number) => `/conversions/${id}`,
  wallet: '/wallet',
  walletTransactions: '/wallet/transactions',
  payments: '/payments',
  tickets: '/tickets',
  profile: '/profile',

  admin: '/admin',
  adminUsers: '/admin/users',
  adminCoinPackages: '/admin/coin-packages',
  adminPayments: '/admin/payments',
  adminConversions: '/admin/conversions',
  adminCoinTransactions: '/admin/coin-transactions',
  adminTickets: '/admin/tickets',
  adminSupportUsers: '/admin/support-users',
  adminSettings: '/admin/settings',
  adminAuditLogs: '/admin/audit-logs',

  supportDashboard: '/support-dashboard',
} as const;
