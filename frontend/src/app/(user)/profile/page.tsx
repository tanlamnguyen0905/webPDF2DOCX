'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Feedback';

type Tab = 'profile' | 'password';

export default function ProfilePage() {
  const { user, loading: authLoading, updateProfile, changePassword } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Profile form
  const [fullName, setFullName] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);
  }, [user]);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile({ fullName: fullName || undefined });
      addToast('success', 'Cập nhật hồ sơ thành công');
    } catch {
      addToast('error', 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) { setPasswordError('Vui lòng nhập mật khẩu hiện tại'); return; }
    if (!newPassword || newPassword.length < 8) { setPasswordError('Mật khẩu mới phải có ít nhất 8 ký tự'); return; }
    if (newPassword !== confirmNewPassword) { setPasswordError('Mật khẩu không khớp'); return; }

    setPasswordLoading(true);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword: confirmNewPassword });
      addToast('success', 'Đổi mật khẩu thành công');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (msg) setPasswordError(msg);
      else if (err?.response?.status === 400) setPasswordError('Mật khẩu hiện tại không đúng');
      else setPasswordError('Đổi mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-40 w-full mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!user) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profile', label: 'Hồ sơ' },
    { key: 'password', label: 'Đổi mật khẩu' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hồ sơ cá nhân</h1>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Avatar + Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold shrink-0">
            {(user.fullName?.[0] || user.email[0]).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user.fullName || 'Chưa có tên'}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-warning-600 font-medium mt-1">
              Số dư: <span className="font-bold">{new Intl.NumberFormat('vi-VN').format(user.coinBalance)}</span> coin
            </p>
          </div>
        </div>
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <Input
              label="Họ và tên"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
            />
            <Input
              label="Email"
              type="email"
              value={user.email}
              disabled
              className="bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <Button type="submit" loading={profileLoading}>
              Lưu thay đổi
            </Button>
          </form>
        </div>
      )}

      {/* Password tab */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Đổi mật khẩu</h3>

          {passwordError && (
            <div className="mb-4 p-3 bg-danger-50 border border-danger-200 text-danger-600 text-sm rounded-lg">
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <Input
              label="Mật khẩu hiện tại"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Input
              label="Mật khẩu mới"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <Input
              label="Xác nhận mật khẩu mới"
              type="password"
              placeholder="••••••••"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <Button type="submit" loading={passwordLoading}>
              Đổi mật khẩu
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
