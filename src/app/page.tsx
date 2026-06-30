'use client'

import * as React from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { Upload, FileText, Shield, Zap, ArrowRight, Star } from 'lucide-react'

const features = [
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: 'Chuyển đổi nhanh chóng',
    desc: 'Chỉ mất vài giây để chuyển đổi file PDF sang Word với công nghệ OCR tiên tiến.',
  },
  {
    icon: <Shield className="w-6 h-6 text-success" />,
    title: 'Bảo mật tuyệt đối',
    desc: 'File của bạn được mã hóa và tự động xóa sau 1 giờ. Chúng tôi không lưu trữ dữ liệu.',
  },
  {
    icon: <Star className="w-6 h-6 text-warning" />,
    title: 'Giữ nguyên định dạng',
    desc: 'Font chữ, bảng biểu, hình ảnh được giữ nguyên vẹn sau khi chuyển đổi.',
  },
]

const steps = [
  { step: '1', title: 'Tải file PDF', desc: 'Kéo thả hoặc chọn file PDF từ máy tính của bạn.' },
  { step: '2', title: 'Chuyển đổi', desc: 'Hệ thống tự động xử lý và chuyển đổi sang DOCX.' },
  { step: '3', title: 'Tải về', desc: 'Tải file Word hoàn chỉnh về máy ngay lập tức.' },
]

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5 pointer-events-none" />
        <div className="container-main page-section">
          <div className="max-w-[800px] mx-auto text-center">
            <h1 className="text-display font-display text-on-surface mb-md">
              Chuyển đổi PDF sang{' '}
              <span className="text-primary">Word</span>
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant mb-xl max-w-[600px] mx-auto">
              Công cụ chuyển đổi PDF sang DOCX trực tuyến, nhanh chóng, chính xác và bảo mật.
              Miễn phí cho file dưới 5MB và 30 trang.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-md">
              <Link href="/upload">
                <Button variant="primary" size="lg" icon={<Upload className="w-5 h-5" />}>
                  Bắt đầu chuyển đổi
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  Đăng nhập
                </Button>
              </Link>
            </div>
            <p className="text-body-sm text-on-surface-variant mt-lg">
              Miễn phí • Không cần đăng ký • Bảo mật tuyệt đối
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-surface-container-low/50 py-2xl">
        <div className="container-main">
          <div className="max-w-[960px] mx-auto">
            <h2 className="text-headline-lg font-headline-lg text-center text-on-surface mb-xl">
              Tại sao chọn chúng tôi?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {features.map((f) => (
                <div key={f.title} className="card p-xl text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-md">
                    {f.icon}
                  </div>
                  <h3 className="text-headline-sm font-headline-sm text-on-surface mb-sm">{f.title}</h3>
                  <p className="text-body-md font-body-md text-on-surface-variant">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-2xl">
        <div className="container-main">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-headline-lg font-headline-lg text-center text-on-surface mb-xl">
              Cách hoạt động
            </h2>
            <div className="flex flex-col md:flex-row items-start justify-center gap-lg">
              {steps.map((s, i) => (
                <React.Fragment key={s.step}>
                  <div className="flex-1 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-md text-headline-md font-headline-md">
                      {s.step}
                    </div>
                    <h3 className="text-headline-sm font-headline-sm text-on-surface mb-sm">{s.title}</h3>
                    <p className="text-body-md font-body-md text-on-surface-variant">{s.desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex items-center pt-8">
                      <ArrowRight className="w-6 h-6 text-outline-variant" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-2xl">
        <div className="container-main text-center">
          <div className="max-w-[600px] mx-auto">
            <h2 className="text-headline-lg font-headline-lg text-on-surface mb-md">
              Sẵn sàng chuyển đổi?
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant mb-lg">
              Không cần tài khoản. Bắt đầu chuyển đổi file PDF của bạn ngay bây giờ.
            </p>
            <Link href="/upload">
              <Button variant="primary" size="lg" icon={<FileText className="w-5 h-5" />}>
                Chọn file PDF
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
