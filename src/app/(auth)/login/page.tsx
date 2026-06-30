'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { AuthLayout } from '@/components/layout'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ').min(1, 'Email là bắt buộc'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login: authLogin } = useAuth()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')

    try {
      await authLogin(data.email, data.password)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sai email hoặc mật khẩu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-[480px] bg-surface border border-outline-variant rounded-xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.05)] p-xl flex flex-col gap-xl">
        {/* Card Header */}
        <div className="flex flex-col items-center gap-sm text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-sm">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              login
            </span>
          </div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface">Đăng nhập</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Truy cập vào tài khoản của bạn để tiếp tục chuyển đổi tài liệu.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-lg w-full" noValidate>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-error/5 border border-error/30 rounded-lg text-error text-body-sm" role="alert">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

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
            <div className="flex justify-between items-center w-full">
              <label className="text-label-md font-label-md text-on-surface" htmlFor="password">
                Mật khẩu
              </label>
              <Link
                href="/forgot-password"
                className="text-label-sm font-label-sm text-primary hover:text-primary-container hover:underline transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                lock
              </span>
              <input
                {...register('password')}
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                required
                className={cn(
                  'w-full pl-10 pr-12 py-3 rounded-lg border bg-background text-body-md font-body-md focus:bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors placeholder:text-outline-variant/70',
                  errors.password && 'border-error focus:ring-error'
                )}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors flex items-center justify-center p-1 rounded-full focus:outline-none focus:bg-surface-variant/50"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="font-body-sm text-body-sm text-error" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            icon={!isLoading ? <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span> : undefined}
            iconPosition="right"
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full">
          <div className="h-px bg-outline-variant flex-grow"></div>
          <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Hoặc</span>
          <div className="h-px bg-outline-variant flex-grow"></div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <span className="text-body-md font-body-md text-on-surface-variant">Chưa có tài khoản? </span>
          <Link
            href="/register"
            className="text-label-md font-label-md text-primary hover:text-primary-container hover:underline transition-all"
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}