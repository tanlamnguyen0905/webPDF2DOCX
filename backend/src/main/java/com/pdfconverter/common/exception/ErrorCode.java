package com.pdfconverter.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Mã lỗi nghiệp vụ. Tham khảo bảng error code trong done/backend/api_spec.md.
 */
public enum ErrorCode {
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED),
    ACCOUNT_LOCKED(HttpStatus.FORBIDDEN),
    ACCESS_DENIED(HttpStatus.FORBIDDEN),
    NOT_FOUND(HttpStatus.NOT_FOUND),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT),
    INVALID_FILE_TYPE(HttpStatus.UNSUPPORTED_MEDIA_TYPE),
    FILE_TOO_LARGE(HttpStatus.PAYLOAD_TOO_LARGE),
    PDF_READ_FAILED(HttpStatus.UNPROCESSABLE_ENTITY),
    FREE_LIMIT_EXCEEDED(HttpStatus.TOO_MANY_REQUESTS),
    INSUFFICIENT_COIN(HttpStatus.UNPROCESSABLE_ENTITY),
    QUEUE_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR);

    private final HttpStatus status;

    ErrorCode(HttpStatus status) {
        this.status = status;
    }

    public HttpStatus status() {
        return status;
    }
}
