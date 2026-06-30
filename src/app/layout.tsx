import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'Convert PDF to Word',
  description: 'Chuyển đổi PDF sang Word trực tuyến, nhanh chóng và chính xác',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface font-body min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
