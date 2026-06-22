import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'PDF to Word Converter',
  description: 'Chuyển đổi PDF sang Word nhanh chóng, hỗ trợ chế độ miễn phí và nâng cao bằng coin.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}