'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { cn } from '@/lib/utils'
import { Upload, FileText, AlertCircle, X, Loader2 } from 'lucide-react'
import { uploadApi, getErrorMessage } from '@/lib/api'
import type { UploadPreviewDto } from '@/lib/types'

export default function UploadPage() {
  const router = useRouter()
  const [isDragging, setIsDragging] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [error, setError] = React.useState('')
  const [previewData, setPreviewData] = React.useState<UploadPreviewDto | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    validateAndSetFile(droppedFile)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) validateAndSetFile(selectedFile)
  }

  const validateAndSetFile = (file: File) => {
    setError('')
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Sai định dạng file. Vui lòng chọn file PDF.')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File vượt quá 50MB. Vui lòng chọn file nhỏ hơn.')
      return
    }
    setFile(file)
  }

  const handleUpload = async () => {
    if (!file) return
    setIsUploading(true)
    setUploadProgress(0)
    setError('')

    // Simulate progress for UX
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90))
    }, 300)

    try {
      const res = await uploadApi.preview(file)
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (res.success) {
        setPreviewData(res.data as UploadPreviewDto)
        // Store preview data for the next page
        sessionStorage.setItem('uploadPreview', JSON.stringify(res.data))
        sessionStorage.setItem('uploadFileName', file.name)
        await new Promise((r) => setTimeout(r, 500))
        router.push('/preview')
      } else {
        const apiError = res as { error?: { message?: string } }
        setError(apiError.error?.message || 'Không thể tải file lên máy chủ.')
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError(getErrorMessage(err, 'Không thể kết nối đến máy chủ'))
    } finally {
      clearInterval(progressInterval)
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setError('')
    setUploadProgress(0)
    setPreviewData(null)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <MainLayout>
      <div className="container-main page-section">
        <div className="max-w-[800px] mx-auto">
          {/* Page Title */}
          <div className="text-center mb-lg">
            <h1 className="text-headline-lg font-headline-lg text-on-surface mb-sm">
              Chuyển đổi PDF sang Word
            </h1>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Tải lên file PDF của bạn và chúng tôi sẽ chuyển đổi sang định dạng DOCX
            </p>
          </div>

          {/* Dropzone */}
          {!file && !isUploading && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
              className={cn(
                'dropzone cursor-pointer',
                isDragging && 'dropzone-active'
              )}
            >
              <div className="dropzone-icon">
                <Upload className="w-10 h-10" />
              </div>
              <div>
                <p className="text-headline-md font-headline-md text-on-surface mb-xs">
                  {isDragging ? 'Thả file vào đây' : 'Kéo thả file PDF vào đây'}
                </p>
                <p className="text-body-md font-body-md text-on-surface-variant">hoặc</p>
              </div>
              <button
                type="button"
                className="btn-secondary btn-md"
                onClick={(e) => {
                  e.stopPropagation()
                  document.getElementById('file-input')?.click()
                }}
              >
                Chọn file
              </button>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-sm">
                Tối đa 5MB (miễn phí) / 50MB (nâng cao) | Tối đa 30 trang (miễn phí)
              </p>
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="card p-xl text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-lg">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <p className="text-body-md font-body-md text-on-surface mb-md">
                Đang tải...
              </p>
              <div className="w-full bg-outline-variant/30 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-sm">
                {uploadProgress}%
              </p>
            </div>
          )}

          {/* File Selected */}
          {file && !isUploading && (
            <div className="card p-xl">
              <div className="flex items-center gap-lg">
                <div className="w-14 h-14 rounded-xl bg-error/10 flex items-center justify-center shrink-0">
                  <FileText className="w-7 h-7 text-error" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md font-body-md text-on-surface truncate">
                    {file.name}
                  </p>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    {formatSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={handleRemove}
                  className="p-2 rounded-lg hover:bg-surface-variant/50 text-on-surface-variant hover:text-error transition-colors"
                  aria-label="Xóa file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleUpload}
                className="btn-primary btn-lg btn-full mt-lg"
              >
                Tiếp tục
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-error/5 border border-error/30 rounded-xl mt-lg">
              <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
              <div>
                <p className="text-body-sm font-body-sm text-error">{error}</p>
                {file && (
                  <button
                    onClick={handleRemove}
                    className="text-label-sm font-label-sm text-error hover:underline mt-sm"
                  >
                    Xóa file và thử lại
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md mt-xl">
            <div className="card p-lg text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-sm">
                <span className="material-symbols-outlined text-primary">bolt</span>
              </div>
              <p className="text-label-md font-label-md text-on-surface">Nhanh chóng</p>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-xs">
                Chuyển đổi trong vài giây
              </p>
            </div>
            <div className="card p-lg text-center">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-sm">
                <span className="material-symbols-outlined text-success">lock</span>
              </div>
              <p className="text-label-md font-label-md text-on-surface">Bảo mật</p>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-xs">
                File tự động xóa sau 1 giờ
              </p>
            </div>
            <div className="card p-lg text-center">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-sm">
                <span className="material-symbols-outlined text-warning">devices</span>
              </div>
              <p className="text-label-md font-label-md text-on-surface">Đa nền tảng</p>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-xs">
                Hoạt động trên mọi thiết bị
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
