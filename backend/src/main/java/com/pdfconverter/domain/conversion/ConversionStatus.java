package com.pdfconverter.domain.conversion;

/** Trạng thái convert. Xem done/backend/api_spec.md §3.2. */
public enum ConversionStatus {
    PENDING,
    QUEUED,
    PROCESSING,
    SUCCESS,
    FAILED,
    EXPIRED,
    DELETED
}
