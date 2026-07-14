'use client';

import { useState } from 'react';
import { UploadBox } from '@/components/upload/UploadBox';
import { FileInfoCard } from '@/components/upload/FileInfoCard';
import { useRouter } from 'next/navigation';
import type { UploadPreviewResponse } from '@/lib/types';
import { ROUTES } from '@/lib/constants/routes';

export default function UploadPage() {
  const router = useRouter();
  const [fileInfo, setFileInfo] = useState<UploadPreviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadSuccess = (data: UploadPreviewResponse) => {
    setFileInfo(data);
    setError(null);
  };

  const handleDelete = async () => {
    // TODO: call delete upload API
    setFileInfo(null);
  };

  const handleContinue = () => {
    if (fileInfo) {
      router.push(`${ROUTES.preview}?token=${fileInfo.uploadToken}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tải lên file PDF</h1>
          <p className="mt-2 text-gray-500">Chuyển đổi PDF sang DOCX nhanh chóng, chính xác</p>
        </div>

        {!fileInfo ? (
          <UploadBox onUploadSuccess={handleUploadSuccess} />
        ) : (
          <FileInfoCard
            fileInfo={fileInfo}
            onDelete={handleDelete}
            onContinue={handleContinue}
          />
        )}

        {error && (
          <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}