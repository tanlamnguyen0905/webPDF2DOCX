package com.pdfconverter.domain.conversion;

import jakarta.validation.constraints.NotBlank;

/** Request body cho POST /api/v1/conversions. */
public record UploadRequest(
        @NotBlank String uploadToken,
        ConversionMode conversionMode,
        ProcessingType processingType,
        boolean confirmCoin
) {}
