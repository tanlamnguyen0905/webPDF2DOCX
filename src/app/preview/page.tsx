'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { FileText, ArrowLeft, ArrowRight, Info, Shield, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { conversionApi, getErrorMessage } from '@/lib/api'
import type { UploadPreviewDto } from '@/lib/types'

export default function PreviewPage() {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [mode, setMode] = React.useState<'FREE' | 'PREMIUM'>('FREE')
  const [isConverting, setIsConverting] = React.useState(false)
  const [error, setError] = React.useState('')

  // Get preview data from session storage
  const previewData: UploadPreviewDto | null = React.useMemo(() => {
    try {
      const stored = sessionStorage.getItem('uploadPreview')
      if (!stored) return null
      return JSON.parse(stored)
    } catch {
      return null
    }
  }, [])

  const fileName = typeof window !== 'undefined' ? sessionStorage.getItem('uploadFileName') || 'document.pdf' : 'document.pdf'

  // Redirect if no preview data
  React.useEffect(() => {
    if (!previewData) {
      router.replace('/upload')
    }
  }, [previewData, router])

  if (!previewData) {
    return null
  }

  const coinEstimate = mode === 'PREMIUM' ? previewData.coinEstimate.normal : 0
  const fileSizeMB = (previewData.file.fileSizeBytes / (1024 * 1024)).toFixed(1)

  const handleConvert = async () => {
    setIsConverting(true)
    setError('')

    try {
      const processingType = previewData.scanAnalysis?.recommendedProcessingType || 'NORMAL'
      const res = await conversionApi.create(previewData.uploadToken, mode, processingType, mode === 'PREMIUM')
      if (res.success) {
        sessionStorage.setItem('conversionJobId', String((res.data as { id: number }).id))
        sessionStorage.setItem('conversionMode', mode)
        router.push('/converting')
      } else {
        const apiErr = res as { error?: { message?: string; code?: string } }
        switch (apiErr.error?.code) {
          case 'INSUFFICIENT_COIN':
            setError('Không đủ coin. Vui lòng nạp thêm coin để sử dụng chế độ nâng cao.')
            break
          case 'AUTH_REQUIRED_FOR_PREMIUM':
            setError('Vui lòng đăng nhập để sử dụng chế độ nâng cao.')
            break
          case 'FREE_LIMIT_EXCEEDED':
            setError('Bạn đã hết lượt chuyển đổi miễn phí hôm nay. Vui lòng đăng ký tài khoản hoặc nâng cấp.')
            break
          default:
            setError(apiErr.error?.message || 'Không thể tạo yêu cầu chuyển đổi.')
        }
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể kết nối đến máy chủ'))
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <MainLayout>
      <div className="container-main page-section">
        <div className="max-w-[640px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-body-sm text-on-surface-variant mb-lg">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link href="/upload" className="hover:text-primary transition-colors">Upload</Link>
            <span>/</span>
            <span className="text-on-surface">Xem trước</span>
          </div>

          {/* Card */}
          <div className="card p-xl">
            {/* File Icon & Name */}
            <div className="flex flex-col items-center text-center mb-lg">
              <div className="w-20 h-20 rounded-2xl bg-error/10 flex items-center justify-center mb-md">
                <FileText className="w-10 h-10 text-error" />
              </div>
              <h1 className="text-headline-md font-headline-md text-on-surface">
                {fileName}
              </h1>
            </div>

            {/* File Info */}
            <div className="flex flex-col gap-md mb-lg">
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                <Info className="w-5 h-5 text-on-surface-variant" />
                <div className="flex justify-between flex-1">
                  <span className="text-body-md font-body-md text-on-surface-variant">Dung lượng</span>
                  <span className="text-body-md font-body-md text-on-surface">{fileSizeMB} MB</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                <Info className="w-5 h-5 text-on-surface-variant" />
                <div className="flex justify-between flex-1">
                  <span className="text-body-md font-body-md text-on-surface-variant">Số trang</span>
                  <span className="text-body-md font-body-md text-on-surface">{previewData.file.totalPages} trang</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                <Info className="w-5 h-5 text-on-surface-variant" />
                <div className="flex justify-between flex-1">
                  <span className="text-body-md font-body-md text-on-surface-variant">Phí</span>
                  <span className={cn('text-body-md font-body-md', mode === 'PREMIUM' ? 'text-primary' : 'text-success')}>
                    {mode === 'FREE' ? '0 coin' : `${coinEstimate} coin`}
                  </span>
                </div>
              </div>
              {previewData.freeEligibility && !previewData.freeEligibility.eligible && (
                <div className="flex items-center gap-3 p-3 bg-warning/5 border border-warning/30 rounded-lg">
                  <Info className="w-5 h-5 text-warning" />
                  <div className="flex-1">
                    <span className="text-body-sm font-body-sm text-warning">File không đủ điều kiện chế độ miễn phí.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mode Selector */}
            <div className="mb-lg">
              <p className="text-label-md font-label-md text-on-surface mb-sm">Chế độ chuyển đổi</p>
              <div className="flex gap-md">
                <button
                  onClick={() => setMode('FREE')}
                  disabled={!previewData.freeEligibility?.eligible}
                  className={cn(
                    'flex-1 p-4 rounded-xl border-2 transition-all text-center',
                    mode === 'FREE'
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant hover:border-primary/50',
                    !previewData.freeEligibility?.eligible && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <span className="block text-label-md font-label-md text-on-surface">Miễn phí</span>
                  <span className="text-body-sm text-on-surface-variant">0 coin</span>
                  <span className="block text-body-sm text-on-surface-variant mt-xs">Chất lượng cơ bản</span>
                </button>
                <button
                  onClick={() => setMode('PREMIUM')}
                  className={cn(
                    'flex-1 p-4 rounded-xl border-2 transition-all text-center',
                    mode === 'PREMIUM'
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant hover:border-primary/50'
                  )}
                >
                  <span className="block text-label-md font-label-md text-on-surface">Nâng cao</span>
                  <span className="text-body-sm text-primary">{coinEstimate} coin</span>
                  <span className="block text-body-sm text-on-surface-variant mt-xs">Chất lượng cao nhất</span>
                </button>
              </div>
              {!isLoggedIn && mode === 'PREMIUM' && (
                <p className="text-body-sm text-on-surface-variant mt-sm text-center">
                  <Link href="/login" className="text-primary hover:underline">Đăng nhập</Link>{' '}
                  để sử dụng chế độ nâng cao
                </p>
              )}
            </div>

            {/* Note */}
            <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg mb-lg">
              <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-body-sm text-on-surface-variant">
                File sẽ được xóa sau{' '}
                <strong className="text-on-surface">1 tiếng</strong> (miễn phí) /{' '}
                <strong className="text-on-surface">24 tiếng</strong> (nâng cao)
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-error/5 border border-error/30 rounded-lg text-error text-body-sm mb-lg">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-md">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={isConverting}
                onClick={handleConvert}
                icon={!isConverting ? <ArrowRight className="w-5 h-5" /> : undefined}
              >
                {isConverting ? 'Đang xử lý...' : 'Convert ngay'}
              </Button>
              <Link href="/upload" className="w-full">
                <Button variant="ghost" size="md" fullWidth>
                  <ArrowLeft className="w-4 h-4" />
                  Chọn file khác
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
