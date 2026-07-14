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

export interface UploadPreviewResponse {
  uploadToken: string;
  originalFileName: string;
  fileSizeBytes: number;
  totalPages: number;
  previewUrl?: string;
}

export interface ConversionSettings {
  preserveTables?: boolean;
  preserveImages?: boolean;
  fontMode?: 'AUTO' | 'PRESERVE' | 'SANITIZE';
  imageQuality?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface CreateConversionRequest {
  uploadToken: string;
  conversionMode: ConversionMode;
  processingType: ProcessingType;
  settings?: ConversionSettings;
}

export interface CreateConversionResponse {
  jobId: number;
  requestCode: string;
  coinEstimated: number;
  status: ConversionStatus;
}

export interface ConversionStatusResponse {
  id: number;
  requestCode: string;
  status: ConversionStatus;
  progress?: number;
  queuePosition?: number;
  errorMessage?: string | null;
  fileExpiredAt?: string | null;
  outputFileName?: string | null;
}

export type CoinTransactionType = 'ADD' | 'DEDUCT' | 'REFUND' | 'ADJUST';
export type PaymentMethod = 'MANUAL' | 'BANK_TRANSFER' | 'MOMO' | 'VNPAY' | 'ZALOPAY';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELED';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

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

export interface CoinPackageDto {
  id: number;
  name: string;
  coinAmount: number;
  bonusCoin: number;
  price: number;
  active: boolean;
}

export interface CoinTransactionDto {
  id: number;
  userId: number;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  type: CoinTransactionType;
  referenceType: string | null;
  referenceId: number | null;
  description: string | null;
  createdAt: string;
}

export interface PaymentDto {
  id: number;
  userId: number;
  coinPackageId: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketDto {
  id: number;
  userId: number;
  title: string;
  issueType: string;
  content: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface ApiListResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalConversions: number;
  totalRevenue: number;
  activeToday: number;
  conversionSuccess: number;
  conversionFailed: number;
}
