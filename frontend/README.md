# Frontend — Next.js

Giao diện người dùng, admin và hỗ trợ viên cho website Convert PDF to Word.
Dùng **Next.js App Router** + TypeScript + Tailwind CSS.

## Cài đặt & chạy

```bash
cp .env.local.example .env.local
npm install
npm run dev          # http://localhost:3000
```

## Cấu trúc `src/`

```
src/
├── app/                      # App Router
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Trang chủ
│   ├── (public)/             # Route group: upload, pricing, guide, support
│   ├── (auth)/               # login, register, forgot-password
│   ├── (user)/               # dashboard, conversions, wallet, payments, tickets, profile
│   ├── admin/                # Trang quản trị (layout sidebar riêng)
│   └── support-dashboard/    # Trang hỗ trợ viên (layout riêng)
├── components/
│   ├── layout/               # Header, Footer, Sidebar
│   ├── upload/               # UploadBox, FileInfoCard, ConvertModeSelector
│   ├── convert/              # ConvertStatusCard, DownloadResultCard, CoinConfirmModal
│   ├── coin/                 # CoinBalanceCard
│   ├── support/              # TicketChatBox, Chatbot
│   ├── admin/                # AdminDataTable
│   └── ui/                   # Component dùng chung (Button, Badge, Modal...)
└── lib/
    ├── api/                  # axios client + nhóm endpoint theo domain
    ├── hooks/                # custom hooks (useUpload, useConversionStatus...)
    ├── types/                # TypeScript types khớp DTO backend
    ├── utils/                # tiện ích (format dung lượng, ngày tháng...)
    └── constants/            # enum, route, hằng số

```

## Route (tham khảo `done/UI_UX_Design/ui_flow.md` §18)

- **Public**: `/` `/upload` `/pricing` `/guide` `/support` `/login` `/register` `/forgot-password`
- **User**: `/dashboard` `/conversions` `/conversions/[id]` `/wallet` `/wallet/transactions` `/payments` `/payments/[id]` `/tickets` `/tickets/[id]` `/profile`
- **Admin**: `/admin` `/admin/users` `/admin/coin-packages` `/admin/payments` `/admin/conversions` `/admin/coin-transactions` `/admin/tickets` `/admin/support-users` `/admin/settings` `/admin/audit-logs`
- **Support**: `/support-dashboard` `/support-dashboard/tickets` `/support-dashboard/tickets/[id]`