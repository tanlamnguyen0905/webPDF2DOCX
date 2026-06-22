package com.pdfconverter.common.exception;

/** Exception nghiệp vụ kèm ErrorCode để GlobalExceptionHandler map ra HTTP status. */
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
