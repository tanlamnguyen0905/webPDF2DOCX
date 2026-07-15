'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { conversionApi } from '@/lib/api/client';
import { FileInfoCard } from '@/components/upload/FileInfoCard';
import { ROUTES } from '@/lib/constants/routes';

export default function PreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [mode, setMode] = useState<'free' | 'premium'>('free');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace(ROUTES.upload);
    }
  }, [token, router]);

  if (!token) return null;

  const handleDelete = () => {
    router.push(ROUTES.upload);
  };

  const handleContinue = async () => {
    setSubmitting(true);
    try {
      const idempotencyKey = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const { data: res } = await conversionApi.createConversion({
        uploadToken: token,
        mode,
      }, idempotencyKey);
      const job = res.data ?? res;
      router.push(`${ROUTES.converting}?jobId=${job.id}`);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Xem trước file</h1>
          <p className="mt-2 text-gray-500">Kiểm tra thông tin file trước khi chuyển đổi</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-medium text-gray-900 mb-4">Chọn chế độ chuyển đổi</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMode('free')}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                mode === 'free'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">Miễn phí</div>
              <div className="text-sm text-gray-500 mt-1">0 coin</div>
              <div className="text-sm text-gray-500">File tối đa 5MB, 30 trang</div>
            </button>
            <button
              onClick={() => setMode('premium')}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                mode === 'premium'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">Nâng cao</div>
              <div className="text-sm text-gray-500 mt-1">Trả bằng coin</div>
              <div className="text-sm text-gray-500">File tối đa 50MB</div>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Quay lại
          </button>
          <button
            onClick={handleContinue}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 disabled:opacity-50"
          >
            {submitting ? 'Đang xử lý...' : 'Bắt đầu chuyển đổi'}
          </button>
        </div>
      </div>
    </main>
  );
}
