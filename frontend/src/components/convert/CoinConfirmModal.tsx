'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface CoinConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  coinAmount: number;
  loading: boolean;
}

export function CoinConfirmModal({ open, onClose, onConfirm, coinAmount, loading }: CoinConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Xác nhận chuyển đổi">
      <div className="space-y-4">
        <p className="text-gray-600">
          Bạn có chắc muốn trừ <strong className="text-gray-900">{coinAmount.toLocaleString('vi-VN')} coin</strong> để chuyển đổi file này?
        </p>
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button variant="primary" loading={loading} onClick={onConfirm}>Xác nhận</Button>
        </div>
      </div>
    </Modal>
  );
}
