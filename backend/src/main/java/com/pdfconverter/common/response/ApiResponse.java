package com.pdfconverter.common.response;

/**
 * Bao bọc response thống nhất: { success, data, message, requestId }.
 * Xem done/backend/api_spec.md §2.4.
 */
public record ApiResponse<T>(boolean success, T data, String message, String requestId) {

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, "OK", null);
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, data, message, null);
    }
}
