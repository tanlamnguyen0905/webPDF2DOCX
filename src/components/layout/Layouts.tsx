'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Header } from './Header'
import { Footer } from './Footer'

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col bg-background text-on-background', className)}>
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  )
}

interface AuthLayoutProps {
  children: React.ReactNode
  className?: string
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col bg-background text-on-background', className)}>
      <header className="w-full px-margin-mobile md:px-margin-desktop py-lg flex justify-start items-center">
        <Link href="/" className="flex items-center gap-sm group">
          <span className="material-symbols-outlined text-primary text-[32px] group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
            picture_as_pdf
          </span>
          <span className="text-headline-md font-headline-md font-bold text-primary group-hover:text-primary-container transition-colors">
            Convert PDF to Word
          </span>
        </Link>
      </header>
      <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop">
        {children}
      </main>
    </div>
  )
}

interface AdminLayoutProps {
  children: React.ReactNode
  className?: string
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  return (
    <div className={cn('bg-background text-on-background font-body-md min-h-screen flex', className)}>
      {/* SideNavBar */}
      <nav className="bg-surface-container-low dark:bg-surface-dim shadow-sm flex flex-col h-screen py-lg px-md gap-sm border-r border-outline-variant docked left h-full w-64 hidden md:flex">
        <div className="mb-lg">
          <h1 className="text-label-md font-label-md font-bold text-on-surface dark:text-inverse-on-surface">Admin Panel</h1>
          <p className="text-label-sm text-on-surface-variant">System Control</p>
        </div>
        <ul className="flex-1 space-y-2">
          <li>
            <Link
              href="/admin"
              className="flex items-center gap-sm px-md py-sm bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary rounded-lg font-bold translate-x-1 transition-transform duration-200 hover:bg-surface-container-high dark:hover:bg-surface-variant"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
              <span className="text-label-md font-label-md">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className="flex items-center gap-sm px-md py-sm text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant/50 hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">group</span>
              <span className="text-label-md font-label-md">Users</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/coin-packages"
              className="flex items-center gap-sm px-md py-sm text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant/50 hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">payments</span>
              <span className="text-label-md font-label-md">Coin Packages</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/transactions"
              className="flex items-center gap-sm px-md py-sm text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant/50 hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">receipt_long</span>
              <span className="text-label-md font-label-md">Transactions</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/conversions"
              className="flex items-center gap-sm px-md py-sm text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant/50 hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">transform</span>
              <span className="text-label-md font-label-md">Conversions</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/settings"
              className="flex items-center gap-sm px-md py-sm text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant/50 hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="text-label-md font-label-md">Settings</span>
            </Link>
          </li>
        </ul>
        <div className="mt-auto pt-md border-t border-outline-variant">
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-surface-variant" />
            <span className="text-label-md font-label-md">Admin User</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-surface border-b border-outline-variant px-gutter py-md flex justify-between items-center shrink-0">
          <h2 className="text-headline-md font-headline-md text-on-surface">Xin chào, Admin</h2>
          <div className="flex items-center gap-md">
            <button className="p-sm rounded-full hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-primary-container object-cover border border-outline-variant" />
          </div>
        </header>

        {/* Body Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-gutter bg-background">
          <div className="max-w-7xl mx-auto space-y-gutter">{children}</div>
        </div>
      </main>
    </div>
  )
}