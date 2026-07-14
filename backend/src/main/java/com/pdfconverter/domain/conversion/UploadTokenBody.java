package com.pdfconverter.domain.conversion;

import jakarta.validation.constraints.NotBlank;

/** Request body cho DELETE /api/v1/uploads/pdf/preview. */
public record UploadTokenBody(
        @NotBlank String uploadToken
) {}
