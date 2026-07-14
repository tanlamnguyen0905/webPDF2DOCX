package com.pdfconverter.domain.conversion;

import java.time.LocalDateTime;

/** DTO ngắn cho endpoint GET /api/v1/conversions/{id}/status (polling). */
public record ConversionStatusDto(
        Long id,
        ConversionStatus status,
        int progress,
        String message,
        boolean downloadAvailable,
        String errorMessage,
        LocalDateTime updatedAt
) {
    public static ConversionStatusDto from(ConversionJob job) {
        int progress = switch (job.getStatus()) {
            case PENDING, QUEUED -> 0;
            case PROCESSING -> 50;
            case SUCCESS -> 100;
            case FAILED, EXPIRED, DELETED -> 0;
        };
        String message = switch (job.getStatus()) {
            case PENDING -> "Đang chờ xử lý";
            case QUEUED -> "Đang trong hàng đợi";
            case PROCESSING -> "Đang xử lý...";
            case SUCCESS -> "Hoàn thành";
            case FAILED -> "Thất bại";
            case EXPIRED -> "Đã hết hạn";
            case DELETED -> "Đã xóa";
        };
        boolean available = job.getStatus() == ConversionStatus.SUCCESS
                && job.getFileExpiredAt() != null
                && job.getFileExpiredAt().isAfter(LocalDateTime.now());
        return new ConversionStatusDto(
                job.getId(), job.getStatus(), progress, message,
                available, job.getErrorMessage(), job.getUpdatedAt());
    }
}
