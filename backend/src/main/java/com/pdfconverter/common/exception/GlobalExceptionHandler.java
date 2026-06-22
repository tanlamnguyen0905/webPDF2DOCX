package com.pdfconverter.common.exception;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Bắt exception toàn cục và trả về body lỗi chuẩn { success:false, error:{...} }. */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Object> handleBusiness(BusinessException ex) {
        return ResponseEntity.status(ex.getErrorCode().status())
                .body(Map.of(
                        "success", false,
                        "error", Map.of(
                                "code", ex.getErrorCode().name(),
                                "message", ex.getMessage())));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneric(Exception ex) {
        return ResponseEntity.status(ErrorCode.INTERNAL_ERROR.status())
                .body(Map.of(
                        "success", false,
                        "error", Map.of(
                                "code", ErrorCode.INTERNAL_ERROR.name(),
                                "message", "Lỗi hệ thống.")));
    }
}
