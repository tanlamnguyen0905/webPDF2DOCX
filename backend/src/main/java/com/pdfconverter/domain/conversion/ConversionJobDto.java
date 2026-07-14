package com.pdfconverter.domain.conversion;

import java.time.LocalDateTime;

/** DTO trả về cho các endpoint GET /api/v1/conversions. */
public record ConversionJobDto(
        Long id,
        String requestCode,
        String originalFileName,
        long fileSizeBytes,
        int totalPages,
        ConversionMode conversionMode,
        ProcessingType processingType,
        ConversionStatus status,
        String errorMessage,
        Integer coinEstimated,
        Integer coinCharged,
        boolean downloadAvailable,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ConversionJobDto from(ConversionJob job) {
        return new ConversionJobDto(
                job.getId(),
                job.getRequestCode(),
                job.getOriginalFileName(),
                job.getFileSizeBytes(),
                job.getTotalPages(),
                job.getConversionMode(),
                job.getProcessingType(),
                job.getStatus(),
                job.getErrorMessage(),
                job.getCoinEstimated(),
                job.getCoinCharged(),
                job.getStatus() == ConversionStatus.SUCCESS
                        && job.getFileExpiredAt() != null
                        && job.getFileExpiredAt().isAfter(LocalDateTime.now()),
                job.getCreatedAt(),
                job.getUpdatedAt()
        );
    }
}
