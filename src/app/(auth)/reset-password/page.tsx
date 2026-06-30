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

const resetSchema = z
  .object({
    password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  })

type ResetFormData = z.infer<typeof resetSchema>

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [isExpired, setIsExpired] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const res = await authApi.resetPassword(params.token, data.password, data.confirmPassword)
      if (res.success) {
        router.push('/login?reset=success')
      } else {
        const errRes = res as { error?: { code?: string } }
        if (errRes.error?.code === 'TOKEN_EXPIRED') {
          setIsExpired(true)
        } else {
          setError('Token đặt lại mật khẩu không hợp lệ')
        }
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
              key
            </span>
          </div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface">Đặt lại mật khẩu</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {/* Token Expired */}
        {isExpired ? (
          <div className="flex flex-col items-center gap-md text-center">
            <span
              className="material-symbols-outlined text-warning text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              timer_off
            </span>
            <h2 className="text-headline-md font-headline-md text-on-surface">
              Link đã hết hạn
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Link đặt lại mật khẩu đã hết hạn. Vui lòng gửi yêu cầu mới.
            </p>
            <Link href="/forgot-password">
              <button className="mt-md bg-primary text-white px-6 py-3 rounded-lg text-label-md font-label-md hover:bg-primary/90 transition-all">
                Gửi lại yêu cầu
              </button>
            </Link>
          </div>
        ) : (
          <>
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

              {/* New Password */}
              <div className="flex flex-col gap-xs">
                <label className="text-label-md font-label-md text-on-surface" htmlFor="password">
                  Mật khẩu mới
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors p-1 rounded-full"
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

              {/* Confirm Password */}
              <div className="flex flex-col gap-xs">
                <label
                  className="text-label-md font-label-md text-on-surface"
                  htmlFor="confirmPassword"
                >
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors p-1 rounded-full"
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

              {/* Submit */}
              <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/login"
                className="text-label-md font-label-md text-primary hover:text-primary-container hover:underline transition-all"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
