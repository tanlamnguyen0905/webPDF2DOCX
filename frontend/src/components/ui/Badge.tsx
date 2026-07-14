'use client';

import { cn, statusLabel, statusColor } from '@/lib/utils/format';

export function Badge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusColor(status), className)}>
      {statusLabel(status)}
    </span>
  );
}
