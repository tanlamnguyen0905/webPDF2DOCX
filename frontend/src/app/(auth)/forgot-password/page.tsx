'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [sent, setSent] = useState(false);

  const validate = () => {
    if (!email.trim()) { setFieldError('Vui lòng nhập email'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFieldError('Email không hợp lệ'); return false; }
    setFieldError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (msg) setError(msg);
      else if (err?.response?.status === 404) setError('Email không tồn tại');
      else setError('Gửi yêu cầu thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-5xl mb-4 text-primary-500">✉</div>
            <h1 className="text-2xl font-bold text-gray-900">Đã gửi email</h1>
            <p className="mt-2 text-sm text-gray-500">
              Vui lòng kiểm tra email <strong>{email}</strong> để đặt lại mật khẩu.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block text-sm text-primary-500 hover:text-primary-600 font-medium"
            >
              Quay lại đăng nhập
            </Link>
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
            <h1 className="text-2xl font-bold text-gray-900">Quên mật khẩu</h1>
            <p className="mt-2 text-sm text-gray-500">
              Nhập email của bạn, chúng tôi sẽ gửi link đặt lại mật khẩu.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-danger-50 border border-danger-200 text-danger-600 text-sm rounded-lg flex items-center gap-2">
              <span>!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldError(''); }}
              error={fieldError}
              autoComplete="email"
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Gửi yêu cầu
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
