'use client'

import * as React from 'react'
import { AdminLayout } from '@/components/layout'
import { Button } from '@/components/ui'

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <h2 className="text-headline-md font-headline-md text-on-surface mb-lg">Cài đặt hệ thống</h2>
      <div className="card p-xl max-w-2xl">
        <div className="flex flex-col gap-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-md font-body-md text-on-surface">Max file size (MB)</p>
              <p className="text-body-sm text-on-surface-variant">Dung lượng tối đa mỗi file</p>
            </div>
            <input type="number" defaultValue={50} className="w-24 px-3 py-2 rounded-lg border border-outline-variant bg-surface text-body-md text-right" />
          </div>
          <div className="border-t border-outline-variant" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-md font-body-md text-on-surface">Max pages per file</p>
              <p className="text-body-sm text-on-surface-variant">Số trang tối đa mỗi file</p>
            </div>
            <input type="number" defaultValue={100} className="w-24 px-3 py-2 rounded-lg border border-outline-variant bg-surface text-body-md text-right" />
          </div>
          <div className="border-t border-outline-variant" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-md font-body-md text-on-surface">File retention (hours)</p>
              <p className="text-body-sm text-on-surface-variant">Thời gian lưu file miễn phí</p>
            </div>
            <input type="number" defaultValue={1} className="w-24 px-3 py-2 rounded-lg border border-outline-variant bg-surface text-body-md text-right" />
          </div>
          <div className="border-t border-outline-variant" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-md font-body-md text-on-surface">Premium file retention (hours)</p>
              <p className="text-body-sm text-on-surface-variant">Thời gian lưu file nâng cao</p>
            </div>
            <input type="number" defaultValue={24} className="w-24 px-3 py-2 rounded-lg border border-outline-variant bg-surface text-body-md text-right" />
          </div>
          <div className="border-t border-outline-variant pt-lg">
            <Button variant="primary">Lưu cấu hình</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
