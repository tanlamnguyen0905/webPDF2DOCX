export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(1)} ${units[i]}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatCoin(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'Chờ xử lý',
    QUEUED: 'Đang chờ',
    PROCESSING: 'Đang xử lý',
    SUCCESS: 'Hoàn thành',
    FAILED: 'Thất bại',
    EXPIRED: 'Hết hạn',
    DELETED: 'Đã xóa',
    ACTIVE: 'Hoạt động',
    LOCKED: 'Khóa',
    BANNED: 'Cấm',
    OPEN: 'Mở',
    IN_PROGRESS: 'Đang xử lý',
    RESOLVED: 'Đã giải quyết',
    CLOSED: 'Đã đóng',
  };
  return map[status] ?? status;
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    SUCCESS: 'bg-success-100 text-success-700',
    FAILED: 'bg-danger-100 text-danger-500',
    EXPIRED: 'bg-gray-100 text-gray-600',
    DELETED: 'bg-gray-100 text-gray-600',
    PENDING: 'bg-warning-100 text-warning-600',
    QUEUED: 'bg-primary-100 text-primary-600',
    PROCESSING: 'bg-primary-100 text-primary-600',
    ACTIVE: 'bg-success-100 text-success-700',
    LOCKED: 'bg-warning-100 text-warning-600',
    BANNED: 'bg-danger-100 text-danger-500',
    OPEN: 'bg-primary-100 text-primary-600',
    IN_PROGRESS: 'bg-warning-100 text-warning-600',
    RESOLVED: 'bg-success-100 text-success-700',
    CLOSED: 'bg-gray-100 text-gray-600',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600';
}
