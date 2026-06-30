'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'
import { CheckCircle2 } from 'lucide-react'
import { AuthLayout } from '@/components/layout'
import { authApi, getErrorMessage } from '@/lib/api'

const forgotSchema = z.object({
  email: z.string().email('Email không hợp lệ').min(1, 'Email là bắt buộc'),
})

type ForgotFormData = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [isSuccess, setIsSuccess] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const res = await authApi.forgotPassword(data.email)
      if (res.success) {
        setIsSuccess(true)
      } else {
        setError('Không tìm thấy tài khoản với email này')
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
              lock_reset
            </span>
          </div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface">Quên mật khẩu</h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Nhập email để nhận link đặt lại mật khẩu
          </p>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="flex flex-col items-center gap-md text-center">
            <CheckCircle2 className="w-16 h-16 text-success" />
            <h2 className="text-headline-md font-headline-md text-on-surface">
              Yêu cầu thành công
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Vui lòng kiểm tra email để đặt lại mật khẩu
            </p>
            <Link
              href="/login"
              className="text-label-md font-label-md text-primary hover:text-primary-container hover:underline transition-all mt-md"
            >
              Quay lại đăng nhập
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

              {/* Email Input */}
              <Input
                label="Email"
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                icon={<span className="material-symbols-outlined text-[18px]">mail</span>}
                error={errors.email?.message}
                {...register('email')}
              />

              {/* Submit Button */}
              <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
                {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
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
