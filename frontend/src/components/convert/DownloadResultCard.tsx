'use client';

import { useState, useEffect, useCallback } from 'react';
import { conversionApi } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants/routes';
import { useRouter } from 'next/navigation';

interface DownloadResultCardProps {
  id: number;
  fileName: string | null;
  expiredAt: string | null;
  onRetry: () => void;
}

function formatRemaining(expiredAt: string): { minutes: number; seconds: number } {
  const diff = new Date(expiredAt).getTime() - Date.now();
  if (diff <= 0) return { minutes: 0, seconds: 0 };
  return {
    minutes: Math.floor(diff / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function DownloadResultCard({ id, fileName, expiredAt, onRetry }: DownloadResultCardProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [remaining, setRemaining] = useState(expiredAt ? formatRemaining(expiredAt) : null);

  useEffect(() => {
    if (!expiredAt) return;
    const tick = () => setRemaining(formatRemaining(expiredAt!));
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiredAt]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const { data: res } = await conversionApi.downloadUrl(id);
      const { url } = res;
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName ?? 'document.docx';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch {
      // silent — toast handled upstream
    } finally {
      setDownloading(false);
    }
  }, [id, fileName]);

  const isExpired = remaining && remaining.minutes === 0 && remaining.seconds === 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-xl mx-auto">
      {isExpired ? (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">File đã hết hạn</h3>
          <p className="text-sm text-gray-500">File tải về đã hết hạn. Vui lòng chuyển đổi lại.</p>
          <Button variant="primary" onClick={onRetry}>Chuyển đổi lại</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Chuyển đổi thành công!</h3>
          {fileName && <p className="text-sm text-gray-500">{fileName}</p>}
          <Button variant="primary" loading={downloading} onClick={handleDownload}>
            Tải về
          </Button>
          {remaining && (
            <p className="text-sm text-gray-400">
              Còn {remaining.minutes} phút {remaining.seconds} giây
            </p>
          )}
          <div className="pt-2">
            <Button variant="outline" onClick={() => router.push(ROUTES.upload)}>Convert thêm</Button>
          </div>
        </div>
      )}
    </div>
  );
}
