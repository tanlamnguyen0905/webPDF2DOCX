'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { conversionApi } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import type { ConversionStatus, ConversionStatusResponse } from '@/lib/types';

interface ConvertStatusCardProps {
  jobId: number;
  onDone: (status: ConversionStatus, data: ConversionStatusResponse) => void;
  onCancel: () => void;
}

export function ConvertStatusCard({ jobId, onDone, onCancel }: ConvertStatusCardProps) {
  const [status, setStatus] = useState<ConversionStatus>('QUEUED');
  const [queuePosition, setQueuePosition] = useState<number | undefined>();
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneRef = useRef(false);

  const poll = useCallback(async () => {
    if (doneRef.current) return;
    try {
      const { data: res } = await conversionApi.getConversionStatus(jobId);
      const d: ConversionStatusResponse = res.data ?? res;
      setStatus(d.status);
      setQueuePosition(d.queuePosition);
      setProgress(d.progress ?? 0);
      setErrorMessage(d.errorMessage ?? null);

      if (['SUCCESS', 'FAILED', 'EXPIRED', 'DELETED'].includes(d.status)) {
        doneRef.current = true;
        if (intervalRef.current) clearInterval(intervalRef.current);
        onDone(d.status, d);
      }
    } catch {
      // ignore polling errors
    }
  }, [jobId, onDone]);

  useEffect(() => {
    poll();
    intervalRef.current = setInterval(poll, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [poll]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await conversionApi.cancelConversion(jobId);
      onCancel();
    } catch {
      setCancelling(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-xl mx-auto">
      {(status === 'QUEUED' || status === 'PENDING') && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg className="animate-spin h-12 w-12 text-primary-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Đang chờ xử lý...</h3>
            {queuePosition !== undefined && queuePosition > 0 && (
              <p className="text-sm text-gray-500 mt-1">Vị trí trong hàng đợi: {queuePosition}</p>
            )}
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm" loading={cancelling} onClick={handleCancel}>Hủy</Button>
          </div>
        </div>
      )}

      {status === 'PROCESSING' && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg className="animate-spin h-12 w-12 text-primary-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Đang chuyển đổi file...</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-md mx-auto">
            <div className="bg-primary-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.max(progress, 10)}%` }} />
          </div>
          <p className="text-sm text-gray-500">{progress}%</p>
        </div>
      )}

      {status === 'SUCCESS' && (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Chuyển đổi thành công!</h3>
          <p className="text-sm text-gray-500">Đang chuyển hướng...</p>
        </div>
      )}

      {status === 'FAILED' && (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Chuyển đổi thất bại</h3>
          <p className="text-sm text-danger-500">{errorMessage ?? 'Đã có lỗi xảy ra trong quá trình chuyển đổi.'}</p>
          <Button variant="primary" onClick={onCancel}>Thử lại</Button>
        </div>
      )}

      {status === 'EXPIRED' && (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Yêu cầu đã hết hạn</h3>
          <p className="text-sm text-gray-500">File đã hết hạn xử lý. Vui lòng tải lại file.</p>
          <Button variant="primary" onClick={onCancel}>Tải lại</Button>
        </div>
      )}
    </div>
  );
}
