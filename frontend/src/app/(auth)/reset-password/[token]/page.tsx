'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (!newPassword) errors.newPassword = 'Vui lòng nhập mật khẩu mới';
    else if (newPassword.length < 8) errors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự';
    if (newPassword !== confirmPassword) errors.confirmPassword = 'Mật khẩu không khớp';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await authApi.resetPassword({ token, password: newPassword });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (msg) setError(msg);
      else if (err?.response?.status === 400) setError('Link hết hạn hoặc không hợp lệ');
      else setError('Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-5xl mb-4 text-success-500">✓</div>
            <h1 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu thành công</h1>
            <p className="mt-2 text-sm text-gray-500">Đang chuyển hướng đến trang đăng nhập...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu</h1>
            <p className="mt-2 text-sm text-gray-500">Nhập mật khẩu mới cho tài khoản của bạn.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-danger-50 border border-danger-200 text-danger-600 text-sm rounded-lg flex items-center gap-2">
              <span>!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Mật khẩu mới"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={fieldErrors.newPassword}
              autoComplete="new-password"
            />
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={fieldErrors.confirmPassword}
              autoComplete="new-password"
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Đặt lại mật khẩu
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            <Link href="/login" className="text-primary-500 hover:text-primary-600 font-medium">
              Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
