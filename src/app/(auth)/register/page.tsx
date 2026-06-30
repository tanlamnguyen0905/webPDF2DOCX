'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { Eye, EyeOff } from 'lucide-react'
import { AuthLayout } from '@/components/layout'
import { cn } from '@/lib/utils'
import { authApi, getErrorMessage } from '@/lib/api'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự').max(100, 'Họ tên tối đa 100 ký tự'),
    email: z.string().email('Email không hợp lệ').min(1, 'Email là bắt buộc'),
    password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: 'Bạn cần đồng ý với điều khoản sử dụng' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFieldError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const res = await authApi.register(data.fullName, data.email, data.password, data.confirmPassword)
      if (res.success) {
        router.push('/login?registered=true')
      } else {
        const apiErr = res as { error?: { code?: string; details?: { field: string; message: string }[]; message?: string } }
        const details = apiErr.error?.details
        if (details && details.length > 0) {
          details.forEach((d) => {
            if (d.field === 'email') {
              setFieldError('email', { message: d.message })
            } else if (d.field === 'fullName') {
              setFieldError('fullName', { message: d.message })
            }
          })
        }
        setError(apiErr.error?.message || 'Đã có lỗi xảy ra')
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể kết nối đến máy chủ'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-[480px] bg-surface border border-outline-variant rounded-xl shadow-overlay p-xl flex flex-col gap-xl">
        {/* Card Header */}
        <div className="flex flex-col items-center gap-sm text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-sm">
            <span
              className="material-symbols-outlined text-primary text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              person_add
            </span>
          </div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface">Đăng ký</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Tạo tài khoản mới để bắt đầu chuyển đổi tài liệu.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-lg w-full"
          noValidate
        >
          {error && (
            <div
              className="flex items-center gap-2 p-3 bg-error/5 border border-error/30 rounded-lg text-error text-body-sm"
              role="alert"
            >
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          {/* Full Name Input */}
          <Input
            label="Họ tên"
            id="fullName"
            type="text"
            placeholder="Nguyễn Văn A"
            icon={<span className="material-symbols-outlined text-[18px]">person</span>}
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          {/* Email Input */}
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="example@email.com"
            icon={<span className="material-symbols-outlined text-[18px]">mail</span>}
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Password Input */}
          <div className="flex flex-col gap-xs">
            <label className="text-label-md font-label-md text-on-surface" htmlFor="password">
              Mật khẩu
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                lock
              </span>
              <input
                {...register('password')}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Tối thiểu 8 ký tự"
                required
                className={cn(
                  'w-full pl-10 pr-12 py-3 rounded-lg border bg-background text-body-md font-body-md focus:bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors placeholder:text-outline-variant/70',
                  errors.password && 'border-error focus:ring-error'
                )}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors flex items-center justify-center p-1 rounded-full"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="font-body-sm text-body-sm text-error" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col gap-xs">
            <label className="text-label-md font-label-md text-on-surface" htmlFor="confirmPassword">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                lock
              </span>
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                required
                className={cn(
                  'w-full pl-10 pr-12 py-3 rounded-lg border bg-background text-body-md font-body-md focus:bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors placeholder:text-outline-variant/70',
                  errors.confirmPassword && 'border-error focus:ring-error'
                )}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors flex items-center justify-center p-1 rounded-full"
                aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="font-body-sm text-body-sm text-error" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Agree Terms */}
          <div className="flex items-start gap-2">
            <input
              {...register('agreeTerms')}
              id="agreeTerms"
              type="checkbox"
              className={cn(
                'mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary',
                errors.agreeTerms && 'border-error'
              )}
            />
            <label htmlFor="agreeTerms" className="text-body-sm font-body-sm text-on-surface-variant">
              Đồng ý với{' '}
              <Link href="/terms" className="text-primary hover:underline">
                điều khoản sử dụng
              </Link>
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="font-body-sm text-body-sm text-error -mt-2" role="alert">
              {errors.agreeTerms.message}
            </p>
          )}

          {/* Submit Button */}
          <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full">
          <div className="h-px bg-outline-variant flex-grow" />
          <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
            Hoặc
          </span>
          <div className="h-px bg-outline-variant flex-grow" />
        </div>

        {/* Login Link */}
        <div className="text-center">
          <span className="text-body-md font-body-md text-on-surface-variant">
            Đã có tài khoản?{' '}
          </span>
          <Link
            href="/login"
            className="text-label-md font-label-md text-primary hover:text-primary-container hover:underline transition-all"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
