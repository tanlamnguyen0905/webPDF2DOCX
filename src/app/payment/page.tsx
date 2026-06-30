'use client'

import * as React from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { Loader2, CheckCircle2, AlertCircle, CreditCard, Banknote, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { paymentApi, getErrorMessage } from '@/lib/api'
import type { CoinPackageDto, PaymentDto } from '@/lib/types'

export default function PaymentPage() {
  const [packages, setPackages] = React.useState<CoinPackageDto[]>([])
  const [selectedPackage, setSelectedPackage] = React.useState<CoinPackageDto | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCreating, setIsCreating] = React.useState(false)
  const [error, setError] = React.useState('')
  const [payment, setPayment] = React.useState<PaymentDto | null>(null)

  React.useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await paymentApi.getPackages(true)
        if (res.success) {
          setPackages(res.data as CoinPackageDto[])
          if ((res.data as CoinPackageDto[]).length > 0) setSelectedPackage((res.data as CoinPackageDto[])[0])
        } else {
          setError('Không thể tải gói coin.')
        }
      } catch (err) {
        setError(getErrorMessage(err, 'Không thể kết nối đến máy chủ.'))
      } finally {
        setIsLoading(false)
      }
    }
    fetchPackages()
  }, [])

  const handleCreatePayment = async () => {
    if (!selectedPackage) return
    setIsCreating(true)
    setError('')
    try {
      const res = await paymentApi.createPayment(selectedPackage.id, 'MANUAL')
      if (res.success) {
        setPayment(res.data as PaymentDto)
      } else {
        const apiErr = res as { error?: { message?: string } }
        setError(apiErr.error?.message || 'Không thể tạo giao dịch.')
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể kết nối đến máy chủ.'))
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container-main page-section">
          <div className="max-w-[600px] mx-auto text-center">
            <div className="card p-xl">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container-main page-section">
        <div className="max-w-[600px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-body-sm text-on-surface-variant mb-lg">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link href="/profile" className="hover:text-primary transition-colors">Hồ sơ</Link>
            <span>/</span>
            <span className="text-on-surface">Nạp coin</span>
          </div>

          {payment ? (
            // Payment Created — show instructions
            <div className="card p-xl text-center">
              <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-lg" />
              <h1 className="text-headline-lg font-headline-lg text-on-surface mb-sm">
                Đã tạo yêu cầu nạp coin
              </h1>
              <p className="text-body-md font-body-md text-on-surface-variant mb-lg">
                Vui lòng chuyển khoản theo thông tin bên dưới
              </p>

              <div className="bg-surface-container-low rounded-xl p-lg text-left mb-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-body-sm text-on-surface-variant">Mã giao dịch</span>
                  <span className="text-body-sm font-label-md text-on-surface">{payment.paymentCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-sm text-on-surface-variant">Gói coin</span>
                  <span className="text-body-sm font-label-md text-on-surface">{payment.coinAmount} coin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-sm text-on-surface-variant">Số tiền</span>
                  <span className="text-body-sm font-label-md text-on-surface">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amountVnd)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-sm text-on-surface-variant">Trạng thái</span>
                  <span className="text-body-sm text-warning">Chờ xác nhận</span>
                </div>
                <hr className="border-outline-variant" />
                <p className="text-body-sm text-on-surface-variant">
                  Nội dung chuyển khoản:{' '}
                  <strong className="text-on-surface">{payment.paymentContent}</strong>
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-lg text-left mb-lg">
                <p className="text-body-sm text-on-surface-variant">
                  <strong className="text-on-surface">Hướng dẫn:</strong><br />
                  1. Chuyển khoản đến tài khoản ngân hàng với nội dung trên.<br />
                  2. Admin sẽ xác nhận và cộng coin trong vòng 24h.<br />
                  3. Nếu cần hỗ trợ, vui lòng{' '}
                  <Link href="/support" className="text-primary hover:underline">liên hệ hỗ trợ</Link>.
                </p>
              </div>

              <div className="flex flex-col gap-md">
                <Link href="/profile">
                  <Button variant="primary" fullWidth>Quay lại hồ sơ</Button>
                </Link>
                <Button variant="ghost" onClick={() => { setPayment(null); setSelectedPackage(null) }}>
                  Nạp thêm
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-headline-lg font-headline-lg text-on-surface mb-lg">Nạp coin</h1>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-error/5 border border-error/30 rounded-lg text-error text-body-sm mb-lg">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {/* Package Selection */}
              <div className="grid grid-cols-1 gap-md mb-lg">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={cn(
                      'card p-lg text-left transition-all border-2',
                      selectedPackage?.id === pkg.id
                        ? 'border-primary bg-primary/5'
                        : 'border-outline-variant hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-headline-md font-headline-md text-on-surface">{pkg.name}</p>
                        <p className="text-body-sm text-on-surface-variant">{pkg.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-headline-md font-headline-md text-primary">{pkg.coinAmount} coin</p>
                        <p className="text-body-sm text-on-surface-variant">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pkg.priceVnd)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {packages.length === 0 && (
                <div className="card p-xl text-center">
                  <p className="text-body-md text-on-surface-variant">Chưa có gói coin nào.</p>
                </div>
              )}

              {/* Actions */}
              {selectedPackage && (
                <div className="flex flex-col gap-md">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isCreating}
                    onClick={handleCreatePayment}
                  >
                    <CreditCard className="w-5 h-5" />
                    Nạp {selectedPackage.coinAmount} coin
                  </Button>
                  <Link href="/profile">
                    <Button variant="ghost" fullWidth>
                      <ArrowLeft className="w-4 h-4" />
                      Quay lại
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
