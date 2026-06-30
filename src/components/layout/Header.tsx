'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { Avatar, Dropdown, Badge } from '@/components/ui'
import { Menu, X, Bell, LogOut, User, Settings, LayoutDashboard, FileText, History, CreditCard } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const navigation = [
  { name: 'Trang chủ', href: '/', icon: LayoutDashboard },
  { name: 'Tải lên', href: '/upload', icon: FileText },
  { name: 'Lịch sử', href: '/history', icon: History },
]

const userMenuItems = [
  { name: 'Hồ sơ', href: '/profile', icon: User },
  { name: 'Giao dịch', href: '/transactions', icon: CreditCard },
  { name: 'Cài đặt', href: '/settings', icon: Settings },
]

const adminMenuItems = [
  { name: 'Bảng điều khiển', href: '/admin', icon: LayoutDashboard },
  { name: 'Quản lý người dùng', href: '/admin/users', icon: User },
  { name: 'Gói coin', href: '/admin/coin-packages', icon: CreditCard },
  { name: 'Giao dịch', href: '/admin/transactions', icon: FileText },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoggedIn, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant w-full sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 max-w-[1280px] mx-auto">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            picture_as_pdf
          </span>
          <span className="text-headline-md font-headline-md font-bold text-primary hidden sm:block">
            Convert PDF to Word
          </span>
          <span className="text-headline-md font-headline-md font-bold text-primary sm:hidden">
            PDF2Word
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-lg h-full pt-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-label-md font-label-md h-full flex items-center gap-1.5 transition-colors',
                isActive(item.href)
                  ? 'text-primary border-b-2 border-primary opacity-80'
                  : 'text-on-surface-variant hover:text-primary'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Trailing Actions */}
        <div className="flex items-center gap-md">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {isLoggedIn && user ? (
            <>
              {/* Coin Balance */}
              <div className="hidden sm:flex items-center gap-xs bg-surface-container-low px-sm py-xs rounded-full border border-outline-variant">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  monetization_on
                </span>
                <span className="text-label-sm font-label-sm text-primary">{user.coinBalance.toLocaleString('vi-VN')} Coins</span>
              </div>

              {/* Notifications */}
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low"
                aria-label="Thông báo"
                aria-expanded={notificationsOpen}
              >
                <Bell className="w-5 h-5" />
              </button>

              {/* User Profile Dropdown */}
              <Dropdown
                trigger={
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
                    {user.avatarUrl ? (
                      <img alt={user.fullName} className="w-full h-full object-cover" src={user.avatarUrl} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-container text-on-primary-container">
                        <span className="font-bold text-label-md">
                          {getInitials(user.fullName)}
                        </span>
                      </div>
                    )}
                  </div>
                }
                items={[
                  ...userMenuItems.map(item => ({
                    label: item.name,
                    onClick: () => {/* navigation handled by Link */},
                    icon: <item.icon className="w-4 h-4" />,
                  })),
                  { divider: true },
                  (user.role === 'ADMIN' || user.role === 'SUPPORT') && {
                    label: 'Quản trị',
                    onClick: () => router.push('/admin'),
                    icon: <LayoutDashboard className="w-4 h-4" />,
                  },
                  { divider: true },
                  {
                    label: 'Đăng xuất',
                    onClick: () => logout(),
                    icon: <LogOut className="w-4 h-4" />,
                    danger: true,
                  },
                ].filter(Boolean) as any}
                align="right"
              />
            </>
          ) : (
            <div className="flex items-center gap-md">
              <Link href="/login">
                <Button variant="ghost" size="sm">Đăng nhập</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface animate-slide-in">
          <nav className="px-margin-mobile py-md space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-label-md font-label-md transition-colors',
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
            {isLoggedIn && user ? (
              <div className="px-3 py-2">
                <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                  Tài khoản
                </p>
                {userMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors block"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
                {(user.role === 'ADMIN' || user.role === 'SUPPORT') && (
                  <div className="pt-2 border-t border-outline-variant">
                    <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                      Quản trị
                    </p>
                    {adminMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors block"
                      >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-label-md font-label-md text-error hover:bg-error/5 transition-colors mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="px-3 py-2 flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" fullWidth>Đăng nhập</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" fullWidth>Đăng ký</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Notifications Dropdown */}
      {notificationsOpen && (
        <div className="fixed top-16 right-margin-mobile md:right-margin-desktop z-50 w-80 bg-surface border border-outline-variant rounded-xl shadow-overlay animate-scale-in">
          <div className="p-4 border-b border-outline-variant flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Thông báo</h3>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <div className="p-4 text-center text-on-surface-variant">
              Chưa có thông báo mới
            </div>
          </div>
          <div className="p-4 border-t border-outline-variant">
            <Link
              href="/notifications"
              onClick={() => setNotificationsOpen(false)}
              className="w-full text-center text-label-md font-label-md text-primary hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}