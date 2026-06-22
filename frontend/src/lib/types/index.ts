// TypeScript types khớp với DTO/enum của backend.
// Tham khảo: done/backend/api_spec.md §3, §4

export type UserRole = 'USER' | 'ADMIN' | 'SUPPORT';
export type UserStatus = 'ACTIVE' | 'LOCKED' | 'BANNED';

export type ConversionMode = 'FREE' | 'PREMIUM';
export type ProcessingType = 'NORMAL' | 'OCR';
export type ConversionStatus =
  | 'PENDING'
  | 'QUEUED'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'EXPIRED'
  | 'DELETED';

export type CoinTransactionType = 'ADD' | 'DEDUCT' | 'REFUND' | 'ADJUST';
export type PaymentMethod = 'MANUAL' | 'BANK_TRANSFER' | 'MOMO' | 'VNPAY' | 'ZALOPAY';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELED';

export interface UserDto {
  id: number;
  fullName: string | null;
  email: string;
  role: UserRole;
  coinBalance: number;
  status: UserStatus;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversionJobDto {
  id: number;
  requestCode: string;
  originalFileName: string;
  outputFileName: string | null;
  fileSizeBytes: number;
  totalPages: number;
  conversionMode: ConversionMode;
  processingType: ProcessingType;
  coinEstimated: number;
  coinCharged: number;
  status: ConversionStatus;
  errorMessage: string | null;
  fileExpiredAt: string | null;
  createdAt: string;
  downloadAvailable: boolean;
}
