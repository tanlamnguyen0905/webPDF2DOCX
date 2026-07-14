package com.pdfconverter.domain.conversion;

import com.pdfconverter.common.exception.BusinessException;
import com.pdfconverter.common.exception.ErrorCode;
import com.pdfconverter.common.response.ApiResponse;
import com.pdfconverter.common.response.PageResponse;
import com.pdfconverter.domain.auth.GuestContext;
import com.pdfconverter.domain.auth.UserContext;
import com.pdfconverter.queue.ConversionJobPublisher;
import com.pdfconverter.security.JwtTokenProvider;
import com.pdfconverter.storage.S3StorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Controller cho conversion endpoints.
 */
@RestController
@RequestMapping("/api/v1/conversions")
@RequiredArgsConstructor
public class ConversionController {

    private final ConversionJobRepository conversionJobRepository;
    private final FreeConversionUsageRepository freeConversionUsageRepository;
    private final ConversionJobPublisher conversionJobPublisher;
    private final S3StorageService s3StorageService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserContext userContext;
    private final GuestContext guestContext;

    @PostMapping
    @Transactional
    public ApiResponse<ConversionJobDto> createConversion(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @Valid @RequestBody UploadRequest request) {

        if (!jwtTokenProvider.validateToken(request.uploadToken())) {
            throw new BusinessException(ErrorCode.UPLOAD_TOKEN_INVALID, "Upload token không hợp lệ");
        }
        if (jwtTokenProvider.isTokenExpired(request.uploadToken())) {
            throw new BusinessException(ErrorCode.UPLOAD_TOKEN_EXPIRED, "Upload token đã hết hạn");
        }

        String s3Key = jwtTokenProvider.getClaimFromToken(request.uploadToken(), claims -> claims.get("s3Key", String.class));
        String originalFileName = jwtTokenProvider.getClaimFromToken(request.uploadToken(), claims -> claims.get("originalFileName", String.class));
        Long fileSizeBytes = jwtTokenProvider.getClaimFromToken(request.uploadToken(), claims -> claims.get("fileSizeBytes", Long.class));
        Integer totalPages = jwtTokenProvider.getClaimFromToken(request.uploadToken(), claims -> claims.get("totalPages", Integer.class));
        Long tokenUserId = jwtTokenProvider.getClaimFromToken(request.uploadToken(), claims -> claims.get("userId", Long.class));
        String guestToken = jwtTokenProvider.getClaimFromToken(request.uploadToken(), claims -> claims.get("guestToken", String.class));

        if (fileSizeBytes == null || totalPages == null) {
            throw new BusinessException(ErrorCode.UPLOAD_TOKEN_INVALID, "Upload token thiếu thông tin");
        }

        ConversionMode mode = request.conversionMode() != null ? request.conversionMode() : ConversionMode.FREE;
        ProcessingType procType = request.processingType() != null ? request.processingType() : ProcessingType.NORMAL;
        int estimatedCoin = UploadController.estimateCoin(totalPages, mode, procType);

        Long userId = userContext.getCurrentUserId().orElse(null);

        if (mode == ConversionMode.FREE) {
            if (fileSizeBytes > 5L * 1024 * 1024) {
                throw new BusinessException(ErrorCode.FREE_FILE_TOO_LARGE, "File vượt quá 5MB cho gói FREE");
            }
            if (totalPages > 30) {
                throw new BusinessException(ErrorCode.FREE_PAGE_TOO_MANY, "Số trang vượt quá 30 cho gói FREE");
            }
            String identityValue = userId != null ? "user:" + userId : (guestToken != null ? "guest:" + guestToken : "ip:" + guestContext.getClientIp());
            FreeConversionUsage.IdentityType identityType = userId != null
                    ? FreeConversionUsage.IdentityType.USER
                    : FreeConversionUsage.IdentityType.GUEST;
            Optional<FreeConversionUsage> usageOpt = freeConversionUsageRepository
                    .findByIdentityTypeAndIdentityValueAndUsageDate(identityType, identityValue, LocalDate.now());
            FreeConversionUsage usage = usageOpt.orElseGet(() -> {
                FreeConversionUsage u = new FreeConversionUsage();
                u.setIdentityType(identityType);
                u.setIdentityValue(identityValue);
                u.setUsageDate(LocalDate.now());
                u.setUsedCount(0);
                u.setDailyLimit(5);
                return u;
            });
            if (usage.getUsedCount() >= usage.getDailyLimit()) {
                throw new BusinessException(ErrorCode.FREE_LIMIT_EXCEEDED, "Đã vượt quá giới hạn chuyển đổi miễn phí hôm nay");
            }
        } else {
            if (userId == null) {
                throw new BusinessException(ErrorCode.AUTH_REQUIRED_FOR_PREMIUM, "Cần đăng nhập để sử dụng gói PREMIUM");
            }
            if (!request.confirmCoin()) {
                throw new BusinessException(ErrorCode.INSUFFICIENT_COIN, "Bạn cần xác nhận số coin sẽ sử dụng");
            }
        }

        String requestCode = generateRequestCode();

        ConversionJob job = new ConversionJob();
        job.setRequestCode(requestCode);
        job.setUserId(userId);
        job.setGuestToken(guestToken);
        job.setOriginalFileName(originalFileName);
        job.setOriginalFilePath(s3Key);
        job.setFileSizeBytes(fileSizeBytes);
        job.setTotalPages(totalPages);
        job.setConversionMode(mode);
        job.setProcessingType(procType);
        job.setCoinEstimated(estimatedCoin);
        job.setStatus(ConversionStatus.QUEUED);
        job = conversionJobRepository.save(job);

        String sourceKey = s3StorageService.generateSourceKey(job.getId(), originalFileName);
        s3StorageService.copyFile(s3Key, sourceKey);

        conversionJobPublisher.publish(job.getId(), s3StorageService.getBucket(), sourceKey,
                procType.name(), mode.name());

        if (mode == ConversionMode.FREE) {
            String identityValue = userId != null ? "user:" + userId : (guestToken != null ? "guest:" + guestToken : "ip:" + guestContext.getClientIp());
            FreeConversionUsage.IdentityType identityType = userId != null
                    ? FreeConversionUsage.IdentityType.USER
                    : FreeConversionUsage.IdentityType.GUEST;
            freeConversionUsageRepository.incrementIfUnderLimit(identityType, identityValue, LocalDate.now());
        }

        return ApiResponse.ok(ConversionJobDto.from(job), "Conversion job created");
    }

    @GetMapping
    public ApiResponse<PageResponse<ConversionJobDto>> listConversions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) ConversionStatus status,
            @RequestParam(required = false) ConversionMode conversionMode,
            @RequestParam(required = false) ProcessingType processingType,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {

        Long userId = userContext.getCurrentUserId()
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_REQUIRED_FOR_PREMIUM, "Cần đăng nhập"));

        Page<ConversionJob> jobs = conversionJobRepository.findAllByUserId(userId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        Page<ConversionJobDto> dtoPage = jobs.map(ConversionJobDto::from);
        return ApiResponse.ok(PageResponse.from(dtoPage));
    }

    @GetMapping("/{id}")
    public ApiResponse<ConversionJobDto> getById(@PathVariable Long id) {
        ConversionJob job = conversionJobRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Conversion job not found"));
        assertOwnership(job);
        return ApiResponse.ok(ConversionJobDto.from(job));
    }

    @GetMapping("/{id}/status")
    public ApiResponse<ConversionStatusDto> getStatus(@PathVariable Long id) {
        ConversionJob job = conversionJobRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Conversion job not found"));
        assertOwnership(job);
        return ApiResponse.ok(ConversionStatusDto.from(job));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        ConversionJob job = conversionJobRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Conversion job not found"));
        assertOwnership(job);

        if (job.getStatus() != ConversionStatus.SUCCESS) {
            throw new BusinessException(ErrorCode.CONVERSION_NOT_SUCCESS, "File chưa sẵn sàng để tải");
        }
        if (job.getFileExpiredAt() != null && job.getFileExpiredAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException(ErrorCode.FILE_EXPIRED, "File đã hết hạn");
        }
        if (job.getOutputFilePath() == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "File không tồn tại");
        }

        InputStream inputStream = s3StorageService.downloadFile(job.getOutputFilePath());
        String outputName = job.getOutputFileName() != null ? job.getOutputFileName()
                : job.getOriginalFileName().replace(".pdf", ".docx");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + outputName + "\"")
                .body(new InputStreamResource(inputStream));
    }

    @GetMapping("/{id}/download-url")
    public ApiResponse<Map<String, Object>> getDownloadUrl(@PathVariable Long id) {
        ConversionJob job = conversionJobRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Conversion job not found"));
        assertOwnership(job);

        if (job.getStatus() != ConversionStatus.SUCCESS || job.getOutputFilePath() == null) {
            throw new BusinessException(ErrorCode.CONVERSION_NOT_SUCCESS, "File chưa sẵn sàng");
        }

        String presignedUrl = s3StorageService.generatePresignedUrl(job.getOutputFilePath(), 5);
        Map<String, Object> result = new HashMap<>();
        result.put("url", presignedUrl);
        result.put("expiresIn", 300);
        return ApiResponse.ok(result);
    }

    @PostMapping("/{id}/retry")
    @Transactional
    public ApiResponse<ConversionJobDto> retry(@PathVariable Long id) {
        ConversionJob job = conversionJobRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Conversion job not found"));
        assertOwnership(job);

        if (job.getStatus() != ConversionStatus.FAILED) {
            throw new BusinessException(ErrorCode.CONVERSION_ALREADY_PROCESSED, "Job không ở trạng thái FAILED");
        }
        if (job.getCoinCharged() > 0) {
            throw new BusinessException(ErrorCode.CONVERSION_ALREADY_PROCESSED, "Job đã được tính phí, không thể thử lại");
        }

        job.setStatus(ConversionStatus.QUEUED);
        job.setErrorMessage(null);
        job = conversionJobRepository.save(job);

        String sourceKey = s3StorageService.generateSourceKey(job.getId(), job.getOriginalFileName());
        conversionJobPublisher.publish(job.getId(), s3StorageService.getBucket(), sourceKey,
                job.getProcessingType().name(), job.getConversionMode().name());

        return ApiResponse.ok(ConversionJobDto.from(job), "Job queued for retry");
    }

    @PostMapping("/{id}/cancel")
    @Transactional
    public ApiResponse<ConversionJobDto> cancel(@PathVariable Long id) {
        ConversionJob job = conversionJobRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Conversion job not found"));
        assertOwnership(job);

        if (job.getStatus() != ConversionStatus.PENDING && job.getStatus() != ConversionStatus.QUEUED) {
            throw new BusinessException(ErrorCode.CONVERSION_ALREADY_PROCESSED, "Job không thể hủy");
        }

        job.setStatus(ConversionStatus.DELETED);
        job = conversionJobRepository.save(job);
        return ApiResponse.ok(ConversionJobDto.from(job), "Job cancelled");
    }

    @GetMapping("/free-usage/today")
    public ApiResponse<Map<String, Object>> getFreeUsageToday() {
        Long userId = userContext.getCurrentUserId().orElse(null);
        String guestToken = guestContext.getGuestToken().orElse(null);

        String identityValue;
        FreeConversionUsage.IdentityType identityType;

        if (userId != null) {
            identityValue = "user:" + userId;
            identityType = FreeConversionUsage.IdentityType.USER;
        } else if (guestToken != null) {
            identityValue = "guest:" + guestToken;
            identityType = FreeConversionUsage.IdentityType.GUEST;
        } else {
            identityValue = "ip:" + guestContext.getClientIp();
            identityType = FreeConversionUsage.IdentityType.IP;
        }

        FreeConversionUsage usage = freeConversionUsageRepository
                .findByIdentityTypeAndIdentityValueAndUsageDate(identityType, identityValue, LocalDate.now())
                .orElse(null);

        int usedCount = usage != null ? usage.getUsedCount() : 0;
        int dailyLimit = usage != null ? usage.getDailyLimit() : 5;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("identityType", identityType.name());
        result.put("usedCount", usedCount);
        result.put("dailyLimit", dailyLimit);
        result.put("remaining", dailyLimit - usedCount);
        result.put("usageDate", LocalDate.now().toString());
        return ApiResponse.ok(result);
    }

    private void assertOwnership(ConversionJob job) {
        Long userId = userContext.getCurrentUserId().orElse(null);
        String guestToken = guestContext.getGuestToken().orElse(null);
        boolean owned = (userId != null && userId.equals(job.getUserId()))
                || (guestToken != null && guestToken.equals(job.getGuestToken()));
        if (!owned) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED, "Bạn không có quyền truy cập job này");
        }
    }

    private String generateRequestCode() {
        return "CVT-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-"
                + String.format("%04d", (int) (Math.random() * 10000));
    }
}
