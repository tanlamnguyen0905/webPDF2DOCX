package com.pdfconverter.domain.conversion;

/** DTO cho response preview upload (POST /api/v1/uploads/pdf/preview). */
public record UploadPreviewDto(
        String uploadToken,
        String originalFileName,
        long fileSizeBytes,
        int totalPages,
        CoinEstimate normal,
        CoinEstimate ocr,
        boolean freeEligible
) {
    public record CoinEstimate(int coin, String label) {}
}
