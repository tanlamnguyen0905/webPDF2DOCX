'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConvertStatusCard } from '@/components/convert/ConvertStatusCard';
import { ROUTES } from '@/lib/constants/routes';

export default function ConvertingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get('jobId');
  const [jobId, setJobId] = useState<number | null>(null);

  useEffect(() => {
    if (jobIdParam) {
      const id = parseInt(jobIdParam, 10);
      if (!isNaN(id)) setJobId(id);
    } else {
      router.replace(ROUTES.upload);
    }
  }, [jobIdParam, router]);

  if (!jobId) return null;

  const handleDone = () => {
    router.push(ROUTES.conversions);
  };

  const handleCancel = () => {
    router.push(ROUTES.upload);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đang chuyển đổi</h1>
          <p className="mt-2 text-gray-500">Vui lòng chờ trong khi file của bạn được xử lý</p>
        </div>

        <ConvertStatusCard
          jobId={jobId}
          onDone={handleDone}
          onCancel={handleCancel}
        />
      </div>
    </main>
  );
}
