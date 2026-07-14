import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">PDF2DOCX</h3>
            <p className="text-sm text-gray-500">Chuyển đổi PDF sang Word nhanh chóng, chính xác.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Dịch vụ</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href={ROUTES.upload} className="hover:text-primary-600">Chuyển đổi PDF</Link></li>
              <li><Link href={ROUTES.pricing} className="hover:text-primary-600">Bảng giá</Link></li>
              <li><Link href={ROUTES.guide} className="hover:text-primary-600">Hướng dẫn</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href={ROUTES.support} className="hover:text-primary-600">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Pháp lý</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Điều khoản sử dụng</li>
              <li>Chính sách bảo mật</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} PDF2DOCX. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
