'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { ROUTES } from '@/lib/constants/routes';
import { useState } from 'react';
import { formatCoin } from '@/lib/utils/format';

export function Header() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={ROUTES.home} className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <span className="text-2xl">PDF</span>
            <span className="text-gray-800">2</span>
            <span className="text-2xl">DOCX</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href={ROUTES.upload} className="hover:text-primary-600 transition-colors">Tải lên</Link>
            <Link href={ROUTES.pricing} className="hover:text-primary-600 transition-colors">Bảng giá</Link>
            <Link href={ROUTES.guide} className="hover:text-primary-600 transition-colors">Hướng dẫn</Link>
            <Link href={ROUTES.support} className="hover:text-primary-600 transition-colors">Hỗ trợ</Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
            ) : user ? (
              <>
                {user.coinBalance > 0 && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-warning-600 bg-warning-50 px-3 py-1 rounded-full">
                    <span>🪙</span>
                    <span>{formatCoin(user.coinBalance)}</span>
                  </span>
                )}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <span className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold">
                      {(user.fullName?.[0] || user.email[0]).toUpperCase()}
                    </span>
                    <span className="hidden lg:block">{user.fullName || user.email}</span>
                  </button>
                  {menuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b">{user.email}</div>
                        <Link href={ROUTES.dashboard} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Dashboard</Link>
                        <Link href={ROUTES.conversions} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Lịch sử</Link>
                        <Link href={ROUTES.profile} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Hồ sơ</Link>
                        <Link href={ROUTES.wallet} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Ví coin</Link>
                        {user.role === 'ADMIN' && (
                          <Link href={ROUTES.admin} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50 border-t">Admin</Link>
                        )}
                        {user.role === 'SUPPORT' && (
                          <Link href={ROUTES.supportDashboard} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50 border-t">Support</Link>
                        )}
                        <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-danger-500 hover:bg-gray-50 border-t">
                          Đăng xuất
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={ROUTES.login} className="text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-2">Đăng nhập</Link>
                <Link href={ROUTES.register} className="text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 px-4 py-2 rounded-lg">Đăng ký</Link>
              </div>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <Link href={ROUTES.upload} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-primary-600">Tải lên</Link>
          <Link href={ROUTES.pricing} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-primary-600">Bảng giá</Link>
          <Link href={ROUTES.guide} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-primary-600">Hướng dẫn</Link>
          <Link href={ROUTES.support} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-primary-600">Hỗ trợ</Link>
          {user && (
            <>
              <hr />
              <Link href={ROUTES.dashboard} onClick={() => setMobileOpen(false)} className="block text-sm font-medium">Dashboard</Link>
              <Link href={ROUTES.profile} onClick={() => setMobileOpen(false)} className="block text-sm font-medium">Hồ sơ</Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block text-sm font-medium text-danger-500">Đăng xuất</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
