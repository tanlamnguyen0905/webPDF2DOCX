'use client';

import { useState } from 'react';
import { UploadBox } from '@/components/upload/UploadBox';
import { FileInfoCard } from '@/components/upload/FileInfoCard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';
import type { UploadPreviewResponse } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const [fileInfo, setFileInfo] = useState<UploadPreviewResponse | null>(null);

  const handleUploadSuccess = (data: UploadPreviewResponse) => {
    setFileInfo(data);
  };

  const handleDelete = () => {
    setFileInfo(null);
  };

  const handleContinue = () => {
    if (fileInfo) {
      router.push(`${ROUTES.preview}?token=${fileInfo.uploadToken}`);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold">Convert PDF sang Word nhanh ch&oacute;ng</h1>
      <p className="mt-4 text-gray-600">
        Tải l&ecirc;n file PDF v&agrave; chuyển đổi sang file Word .docx. Hỗ trợ chế độ miễn ph&iacute; v&agrave;
        chế độ n&acirc;ng cao bằng coin.
      </p>

      <div className="mt-10 text-left max-w-xl mx-auto">
        {!fileInfo ? (
          <UploadBox onUploadSuccess={handleUploadSuccess} />
        ) : (
          <FileInfoCard
            fileInfo={fileInfo}
            onDelete={handleDelete}
            onContinue={handleContinue}
          />
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="text-3xl mb-3">📄</div>
          <h3 className="font-semibold text-gray-900">Tải file PDF</h3>
          <p className="text-sm text-gray-500 mt-1">K&eacute;o thả hoặc chọn file PDF từ m&aacute;y t&iacute;nh của bạn</p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="text-3xl mb-3">⚙️</div>
          <h3 className="font-semibold text-gray-900">Chuyển đổi tự động</h3>
          <p className="text-sm text-gray-500 mt-1">Hệ thống tự động chuyển PDF sang DOCX với độ ch&iacute;nh x&aacute;c cao</p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <div className="text-3xl mb-3">⬇️</div>
          <h3 className="font-semibold text-gray-900">Tải file kết quả</h3>
          <p className="text-sm text-gray-500 mt-1">Tải file DOCX đ&atilde; chuyển đổi về m&aacute;y ngay lập tức</p>
        </div>
      </div>

      <div className="mt-12">
        <Link
          href={ROUTES.upload}
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Bắt đầu chuyển đổi ngay
        </Link>
      </div>
    </main>
  );
}
