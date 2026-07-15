import axios from 'axios';
import type {
  ApiListResponse,
  CreateConversionRequest,
  CreateConversionResponse,
  ConversionStatusResponse,
  ConversionJobDto,
  UploadPreviewResponse,
  CoinPackageDto,
  CoinTransactionDto,
  PaymentDto,
  TicketDto,
  UserDto,
  DashboardStats,
  AuthTokens,
} from '@/lib/types';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
}

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    const guestToken = window.localStorage.getItem('guestToken');
    if (!token && guestToken) config.headers['X-Guest-Token'] = guestToken;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = window.localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          { refreshToken },
        );
        const newToken = data.data?.accessToken ?? data.accessToken;
        if (!newToken) throw new Error('Refresh response missing access token');
        window.localStorage.setItem('accessToken', newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

// ---- Auth API ----
export const authApi = {
  register: (data: { email: string; password: string; fullName?: string }) =>
    apiClient.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),
  forgotPassword: (data: { email: string }) =>
    apiClient.post('/auth/forgot-password', data),
  resetPassword: (data: { token: string; password: string }) =>
    apiClient.post('/auth/reset-password', data),
  me: () => apiClient.get('/auth/me'),
  updateProfile: (data: { fullName?: string; avatarUrl?: string }) =>
    apiClient.put('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    apiClient.patch('/auth/profile/password', data),
  logout: () => apiClient.post('/auth/logout'),
};

// ---- Conversion API ----
export const conversionApi = {
  upload: (formData: FormData, onProgress?: (pct: number) => void) =>
    apiClient.post('/conversions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
      },
    }),
  uploadPreview: (formData: FormData, onProgress?: (pct: number) => void) =>
    apiClient.post('/uploads/pdf/preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
      },
    }),
  deleteUpload: (uploadToken: string) =>
    apiClient.delete(`/uploads/pdf/preview`, { data: { uploadToken } }),
  createConversion: (data: CreateConversionRequest, idempotencyKey: string) =>
    apiClient.post<CreateConversionResponse>('/conversions', data, {
      headers: { 'Idempotency-Key': idempotencyKey },
    }),
  getById: (id: number) => apiClient.get<ConversionJobDto>(`/conversions/${id}`),
  getConversionStatus: (id: number) =>
    apiClient.get<ConversionStatusResponse>(`/conversions/${id}/status`),
  list: (params?: { page?: number; size?: number; status?: string; mode?: string }) =>
    apiClient.get<ApiListResponse<ConversionJobDto>>('/conversions', { params }),
  startConversion: (id: number, mode: string) =>
    apiClient.post(`/conversions/${id}/start`, { conversionMode: mode }),
  downloadUrl: (id: number) =>
    apiClient.get<{ url: string }>(`/conversions/${id}/download-url`),
  retryConversion: (id: number, data?: CreateConversionRequest) =>
    apiClient.post(`/conversions/${id}/retry`, data ?? {}),
  cancelConversion: (id: number) =>
    apiClient.post(`/conversions/${id}/cancel`),
  getFreeUsage: () =>
    apiClient.get('/conversions/free-usage/today'),
  delete: (id: number) => apiClient.delete(`/conversions/${id}`),
};

// ---- Coin / Payment API ----
export const coinApi = {
  getPackages: () => apiClient.get('/coin-packages'),
  createPayment: (data: { packageId: number; method: string }) =>
    apiClient.post('/payments', data),
  listTransactions: (params?: { page?: number; size?: number; type?: string }) =>
    apiClient.get<ApiListResponse<CoinTransactionDto>>('/coin-transactions', { params }),
};

export const paymentApi = {
  list: (params?: { page?: number; size?: number; status?: string }) =>
    apiClient.get<ApiListResponse<PaymentDto>>('/payments', { params }),
  getById: (id: number) => apiClient.get<PaymentDto>(`/payments/${id}`),
};

// ---- Ticket API ----
export const ticketApi = {
  create: (data: { title: string; issueType: string; content: string }) =>
    apiClient.post('/tickets', data),
  list: (params?: { page?: number; size?: number; status?: string }) =>
    apiClient.get<ApiListResponse<TicketDto>>('/tickets', { params }),
  getById: (id: number) => apiClient.get<TicketDto>(`/tickets/${id}`),
  reply: (id: number, data: { content: string }) =>
    apiClient.post(`/tickets/${id}/reply`, data),
};

// ---- Admin API ----
export const adminApi = {
  dashboardStats: () => apiClient.get<DashboardStats>('/admin/dashboard'),
  listUsers: (params?: { page?: number; size?: number; search?: string }) =>
    apiClient.get<ApiListResponse<UserDto>>('/admin/users', { params }),
  getUserById: (id: number) => apiClient.get<UserDto>(`/admin/users/${id}`),
  updateUser: (id: number, data: Partial<{ fullName?: string; role?: string; status?: string }>) => apiClient.put(`/admin/users/${id}`, data),
  listCoinPackages: () => apiClient.get<CoinPackageDto[]>('/admin/coin-packages'),
  createCoinPackage: (data: Omit<CoinPackageDto, 'id'>) => apiClient.post<CoinPackageDto>('/admin/coin-packages', data),
  updateCoinPackage: (id: number, data: Partial<CoinPackageDto>) => apiClient.put<CoinPackageDto>(`/admin/coin-packages/${id}`, data),
  deleteCoinPackage: (id: number) => apiClient.delete(`/admin/coin-packages/${id}`),
  listConversions: (params?: { page?: number; size?: number }) =>
    apiClient.get<ApiListResponse<ConversionJobDto>>('/admin/conversions', { params }),
  listPayments: (params?: { page?: number; size?: number }) =>
    apiClient.get<ApiListResponse<PaymentDto>>('/admin/payments', { params }),
  listTickets: (params?: { page?: number; size?: number }) =>
    apiClient.get<ApiListResponse<TicketDto>>('/admin/tickets', { params }),
  listSupportUsers: () => apiClient.get<UserDto[]>('/admin/support-users'),
  listAuditLogs: (params?: { page?: number; size?: number }) =>
    apiClient.get<ApiListResponse<Record<string, unknown>>>('/admin/audit-logs', { params }),
  updateTicketStatus: (id: number, status: string) =>
    apiClient.put(`/admin/tickets/${id}/status`, { status }),
};
