package com.pdfconverter.domain.conversion;

import com.pdfconverter.common.exception.BusinessException;
import com.pdfconverter.common.exception.ErrorCode;
import com.pdfconverter.common.response.ApiResponse;
import com.pdfconverter.domain.auth.GuestContext;
import com.pdfconverter.domain.auth.UserContext;
import com.pdfconverter.domain.conversion.UploadPreviewDto.CoinEstimate;
import com.pdfconverter.storage.S3StorageService;
import com.pdfconverter.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
public class UploadController {

    private static final long MAX_FILE_SIZE = 50L * 1024 * 1024; // 50MB
    private static final long FREE_MAX_FILE_SIZE = 5L * 1024 * 1024; // 5MB
    private static final int FREE_MAX_PAGES = 30;
    private static final byte[] PDF_MAGIC = {(byte) 0x25, (byte) 0x50, (byte) 0x44, (byte) 0x46};

    private final S3StorageService s3StorageService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserContext userContext;
    private final GuestContext guestContext;

    @PostMapping("/pdf/preview")
    public ApiResponse<UploadPreviewDto> uploadPreview(@RequestParam("file") MultipartFile file) {
        validateFile(file);

        int totalPages = countPages(file);
        long fileSize = file.getSize();
        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.isBlank()) {
            originalName = "document.pdf";
        }

        String key = s3StorageService.generateTmpUploadKey(originalName);
        s3StorageService.uploadFile(file, key);

        String uploadToken = generateUploadToken(key, originalName, fileSize, totalPages);

        boolean freeEligible = fileSize <= FREE_MAX_FILE_SIZE && totalPages <= FREE_MAX_PAGES;

        return ApiResponse.ok(new UploadPreviewDto(
                uploadToken,
                originalName,
                fileSize,
                totalPages,
                new CoinEstimate(estimateCoin(totalPages, ConversionMode.FREE, ProcessingType.NORMAL), "FREE"),
                new CoinEstimate(estimateCoin(totalPages, ConversionMode.FREE, ProcessingType.OCR), "OCR"),
                freeEligible
        ));
    }

    @DeleteMapping("/pdf/preview")
    public ResponseEntity<Void> deletePreview(@Valid @RequestBody UploadTokenBody body) {
        if (!jwtTokenProvider.validateToken(body.uploadToken())) {
            throw new BusinessException(ErrorCode.UPLOAD_TOKEN_INVALID, "Upload token không hợp lệ");
        }
        String s3Key = jwtTokenProvider.getClaimFromToken(body.uploadToken(), claims -> claims.get("s3Key", String.class));
        s3StorageService.deleteFile(s3Key);
        return ResponseEntity.noContent().build();
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE, "File rỗng");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException(ErrorCode.FILE_TOO_LARGE, "File vượt quá 50MB");
        }

        String name = file.getOriginalFilename();
        if (name == null || !name.toLowerCase().endsWith(".pdf")) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE, "Chỉ hỗ trợ file PDF");
        }

        String contentType = file.getContentType();
        if (contentType != null && !contentType.equalsIgnoreCase(MediaType.APPLICATION_PDF_VALUE)
                && !contentType.equals("application/octet-stream")) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE, "Content-Type không hợp lệ");
        }

        try (InputStream is = file.getInputStream()) {
            byte[] magic = new byte[4];
            int read = is.read(magic);
            if (read < 4 || magic[0] != PDF_MAGIC[0] || magic[1] != PDF_MAGIC[1]
                    || magic[2] != PDF_MAGIC[2] || magic[3] != PDF_MAGIC[3]) {
                throw new BusinessException(ErrorCode.INVALID_FILE_TYPE, "File không phải PDF hợp lệ");
            }
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.PDF_READ_FAILED, "Không thể đọc file PDF");
        }
    }

    private int countPages(MultipartFile file) {
        try (InputStream is = file.getInputStream(); PDDocument doc = Loader.loadPDF(is.readAllBytes())) {
            return doc.getNumberOfPages();
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.PDF_READ_FAILED, "Không thể đếm số trang PDF");
        }
    }

    private String generateUploadToken(String s3Key, String originalFileName, long fileSizeBytes, int totalPages) {
        Long userId = userContext.getCurrentUserId().orElse(null);
        String guestToken = guestContext.getGuestToken().orElse(null);

        Map<String, Object> claims = new HashMap<>();
        claims.put("s3Key", s3Key);
        claims.put("originalFileName", originalFileName);
        claims.put("fileSizeBytes", fileSizeBytes);
        claims.put("totalPages", totalPages);
        if (userId != null) claims.put("userId", userId);
        if (guestToken != null) claims.put("guestToken", guestToken);

        return jwtTokenProvider.createToken(claims, "upload-token", 3600L);
    }

    public static int estimateCoin(int pages, ConversionMode mode, ProcessingType type) {
        int rate = type == ProcessingType.OCR ? 2 : 1;
        int estimated = pages <= 30 ? pages * rate : 30 * rate + (pages - 30) * 3;
        if (mode == ConversionMode.FREE) {
            estimated = 0;
        }
        return estimated;
    }
}
