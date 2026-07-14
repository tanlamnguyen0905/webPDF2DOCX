'use client';

import { Button } from '@/components/ui/Button';
import { formatFileSize } from '@/lib/utils/format';
import type { UploadPreviewResponse } from '@/lib/types';

interface FileInfoCardProps {
  fileInfo: UploadPreviewResponse;
  onDelete: () => void;
  onContinue: () => void;
}

export function FileInfoCard({ fileInfo, onDelete, onContinue }: FileInfoCardProps) {
  const isFreeEligible = fileInfo.fileSizeBytes <= 5 * 1024 * 1024 && fileInfo.totalPages <= 30;
  const coinEstimate = isFreeEligible ? 0 : fileInfo.totalPages;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-14 bg-danger-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-2xl text-danger-500">📕</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{fileInfo.originalFileName}</h3>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
            <span>{formatFileSize(fileInfo.fileSizeBytes)}</span>
            <span>•</span>
            <span>{fileInfo.totalPages} trang</span>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700">
              Đã tải lên thành công
            </span>
          </div>
          <div className="mt-1 text-sm">
            {isFreeEligible ? (
              <span className="text-gray-500">Miễn phí • 0 coin</span>
            ) : (
              <span className="text-warning-600">Nâng cao • {coinEstimate.toLocaleString('vi-VN')} coin</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4 pt-4 border-t">
        <Button variant="outline" size="sm" onClick={onDelete}>Xóa file</Button>
        <Button variant="primary" size="sm" onClick={onContinue}>Tiếp tục</Button>
      </div>
    </div>
  );
}
