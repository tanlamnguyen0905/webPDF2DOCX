'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Footer() {
  const footerLinks = [
    { name: 'Chính sách bảo mật', href: '/privacy' },
    { name: 'Điều khoản sử dụng', href: '/terms' },
    { name: 'Trung tâm trợ giúp', href: '/help' },
    { name: 'Tài liệu API', href: '/api-docs' },
  ]

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: 'facebook' },
    { name: 'Twitter', href: '#', icon: 'twitter' },
    { name: 'GitHub', href: '#', icon: 'github' },
    { name: 'LinkedIn', href: '#', icon: 'linkedin' },
  ]

  return (
    <footer className="bg-surface border-t border-outline-variant w-full mt-auto">
      <div className="w-full py-xl px-margin-desktop flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto gap-lg md:gap-0">
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-xs">
          <span className="text-label-md font-label-md font-semibold text-on-surface">Convert PDF to Word</span>
          <span className="text-body-md font-body-md text-on-surface-variant text-sm">
            © {new Date().getFullYear()} Convert PDF to Word. All rights reserved.
          </span>
        </div>

        {/* Footer Links */}
        <nav className="flex flex-wrap justify-center gap-md">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}