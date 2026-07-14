'use client';

import { useState, useRef, useCallback } from 'react';
import { conversionApi } from '@/lib/api/client';
import type { UploadPreviewResponse } from '@/lib/types';
import { cn } from '@/lib/utils/format';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface UploadBoxProps {
  onUploadSuccess: (data: UploadPreviewResponse) => void;
}

export function UploadBox({ onUploadSuccess }: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((file: File): string | null => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return 'File không đúng định dạng PDF';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File vượt quá dung lượng cho phép (50MB)';
    }
    return null;
  }, []);

  const upload = useCallback(async (file: File) => {
    const err = validate(file);
    if (err) { setError(err); return; }
    setError(null);
    setUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await conversionApi.uploadPreview(formData, (pct) => {
        setProgress(pct);
      });
      const result = data.data ?? data;
      onUploadSuccess(result as UploadPreviewResponse);
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Tải file thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  }, [validate, onUploadSuccess]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }, [upload]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    if (inputRef.current) inputRef.current.value = '';
  }, [upload]);

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors',
          isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50',
          uploading && 'pointer-events-none',
        )}
      >
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={handleChange} />
        {uploading ? (
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-700">Đang tải lên...</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-md mx-auto">
              <div className="bg-primary-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-sm text-gray-500">{progress}%</div>
          </div>
        ) : (
          <>
            <div className="text-5xl mb-4 text-gray-400">📄</div>
            <p className="text-gray-600 font-medium">Kéo thả file PDF vào đây hoặc click để chọn</p>
            <p className="text-sm text-gray-400 mt-2">Tối đa 5MB (miễn phí) / 50MB (nâng cao) • Tối đa 30 trang (miễn phí)</p>
          </>
        )}
      </div>
      {error && (
        <div className="mt-3 text-sm text-danger-500 flex items-center gap-2">
          <span>⚠</span> {error}
        </div>
      )}
    </div>
  );
}
