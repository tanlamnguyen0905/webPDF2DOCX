'use client';

import { cn } from '@/lib/utils/format';
import type { ConversionMode, ProcessingType } from '@/lib/types';

interface ConvertModeSelectorProps {
  conversionMode: ConversionMode;
  processingType: ProcessingType;
  onChangeMode: (mode: ConversionMode) => void;
  onChangeType: (type: ProcessingType) => void;
  totalPages: number;
  isFreeEligible: boolean;
}

export function ConvertModeSelector({
  conversionMode,
  processingType,
  onChangeMode,
  onChangeType,
  totalPages,
  isFreeEligible,
}: ConvertModeSelectorProps) {
  const coinEstimate = isFreeEligible
    ? 0
    : processingType === 'NORMAL'
      ? totalPages
      : totalPages * 2;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Chế độ chuyển đổi</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChangeMode('FREE')}
            disabled={!isFreeEligible}
            className={cn(
              'relative rounded-lg border-2 p-4 text-left transition-all',
              conversionMode === 'FREE'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300',
              !isFreeEligible && 'opacity-50 cursor-not-allowed',
            )}
          >
            <div className="font-medium text-gray-900">Miễn phí</div>
            <div className="text-sm text-gray-500 mt-1">0 coin</div>
            {!isFreeEligible && (
              <div className="text-xs text-gray-400 mt-1">File vượt quá giới hạn miễn phí</div>
            )}
            {conversionMode === 'FREE' && (
              <span className="absolute top-2 right-2 text-primary-600 text-lg">✓</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => onChangeMode('PREMIUM')}
            className={cn(
              'relative rounded-lg border-2 p-4 text-left transition-all',
              conversionMode === 'PREMIUM'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300',
            )}
          >
            <div className="font-medium text-gray-900">Nâng cao</div>
            <div className="text-sm text-gray-500 mt-1">{coinEstimate.toLocaleString('vi-VN')} coin</div>
            <div className="text-xs text-gray-400 mt-1">Chất lượng cao, hỗ trợ OCR</div>
            {conversionMode === 'PREMIUM' && (
              <span className="absolute top-2 right-2 text-primary-600 text-lg">✓</span>
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Xử lý văn bản</label>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => onChangeType('NORMAL')}
            className={cn(
              'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
              processingType === 'NORMAL'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300',
            )}
          >
            Thường
          </button>
          <button
            type="button"
            onClick={() => onChangeType('OCR')}
            className={cn(
              'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
              processingType === 'OCR'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300',
            )}
          >
            OCR
          </button>
          <span className="text-xs text-gray-400">OCR giúp nhận dạng chữ trong hình ảnh, tốn gấp đôi coin</span>
        </div>
      </div>
    </div>
  );
}
