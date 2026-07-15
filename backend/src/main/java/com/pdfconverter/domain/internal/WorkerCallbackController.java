package com.pdfconverter.domain.internal;

import com.pdfconverter.common.exception.BusinessException;
import com.pdfconverter.common.exception.ErrorCode;
import com.pdfconverter.common.response.ApiResponse;
import com.pdfconverter.domain.coin.CoinTransaction;
import com.pdfconverter.domain.coin.CoinTransactionReason;
import com.pdfconverter.domain.coin.CoinTransactionRepository;
import com.pdfconverter.domain.conversion.ConversionJob;
import com.pdfconverter.domain.conversion.ConversionJobRepository;
import com.pdfconverter.domain.conversion.ConversionMode;
import com.pdfconverter.domain.conversion.ConversionStatus;
import com.pdfconverter.domain.user.User;
import com.pdfconverter.domain.user.UserRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Endpoint noi bo cho Python Worker callback (started/completed/failed).
 * Chi worker goi duoc bang header X-Worker-Token.
 */
@RestController
@RequestMapping("/api/v1/internal/worker/conversions")
@RequiredArgsConstructor
public class WorkerCallbackController {

    private final ConversionJobRepository conversionJobRepository;
    private final UserRepository userRepository;
    private final CoinTransactionRepository coinTransactionRepository;

    @Value("${app.worker.shared-secret}")
    private String workerSecret;

    @PostMapping("/{id}/started")
    public ApiResponse<Void> started(@PathVariable Long id,
                                     @RequestHeader("X-Worker-Token") String token) {
        validateWorkerToken(token);
        ConversionJob job = conversionJobRepository.findByIdWithLock(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Conversion job not found"));
        if (job.getStatus() != ConversionStatus.QUEUED) {
            throw new BusinessException(ErrorCode.CONVERSION_ALREADY_PROCESSED, "Job already processing");
        }
        job.setStatus(ConversionStatus.PROCESSING);
        conversionJobRepository.save(job);
        return ApiResponse.ok(null, "Job started");
    }

    @PostMapping("/{id}/completed")
    @Transactional
    public ApiResponse<Void> completed(@PathVariable Long id,
                                       @RequestHeader("X-Worker-Token") String token,
                                       @RequestBody Map<String, String> body) {
        validateWorkerToken(token);
        ConversionJob job = conversionJobRepository.findByIdWithLock(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Conversion job not found"));

        rejectIfNotTransient(job);

        job.setOutputFilePath(body.get("s3OutputKey"));
        job.setOutputFileName(body.get("outputFileName"));
        job.setFileExpiredAt(LocalDateTime.now().plusHours(
                job.getConversionMode() == ConversionMode.FREE ? 1 : 24));

        if (job.getConversionMode() == ConversionMode.PREMIUM) {
            User user = userRepository.findByIdWithLock(job.getUserId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "User not found"));
            if (user.getCoinBalance() < job.getCoinEstimated()) {
                job.setStatus(ConversionStatus.FAILED);
                job.setErrorMessage("Insufficient coin balance: " + user.getCoinBalance()
                        + " < " + job.getCoinEstimated());
                conversionJobRepository.save(job);
                return ApiResponse.ok(null, "Job failed due to insufficient coins");
            }
            user.setCoinBalance(user.getCoinBalance() - job.getCoinEstimated());
            userRepository.save(user);

            CoinTransaction tx = CoinTransaction.deduct(
                    user.getId(), job.getId(), job.getCoinEstimated(),
                    user.getCoinBalance() + job.getCoinEstimated(),
                    CoinTransactionReason.CONVERSION_DEDUCTION.name());
            tx.setTransactionCode("DEDUCT-" + job.getId() + "-" + System.currentTimeMillis());
            coinTransactionRepository.save(tx);

            job.setCoinCharged(job.getCoinEstimated());
        }

        job.setStatus(ConversionStatus.SUCCESS);
        conversionJobRepository.save(job);
        return ApiResponse.ok(null, "Job completed");
    }

    @PostMapping("/{id}/failed")
    @Transactional
    public ApiResponse<Void> failed(@PathVariable Long id,
                                    @RequestHeader("X-Worker-Token") String token,
                                    @RequestBody Map<String, String> body) {
        validateWorkerToken(token);
        ConversionJob job = conversionJobRepository.findByIdWithLock(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Conversion job not found"));

        rejectIfNotTransient(job);

        job.setStatus(ConversionStatus.FAILED);
        job.setErrorMessage(body.get("errorMessage"));

        if (job.getCoinCharged() > 0) {
            User user = userRepository.findByIdWithLock(job.getUserId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "User not found"));
            user.setCoinBalance(user.getCoinBalance() + job.getCoinCharged());
            userRepository.save(user);

            CoinTransaction tx = CoinTransaction.refund(
                    user.getId(), job.getId(), job.getCoinCharged(),
                    user.getCoinBalance() - job.getCoinCharged(),
                    CoinTransactionReason.CONVERSION_REFUND.name());
            tx.setTransactionCode("REFUND-" + job.getId() + "-" + System.currentTimeMillis());
            coinTransactionRepository.save(tx);

            job.setCoinCharged(0);
        }

        conversionJobRepository.save(job);
        return ApiResponse.ok(null, "Job failed acknowledged");
    }

    private void rejectIfNotTransient(ConversionJob job) {
        ConversionStatus s = job.getStatus();
        if (s == ConversionStatus.SUCCESS || s == ConversionStatus.FAILED) {
            throw new BusinessException(ErrorCode.CONVERSION_ALREADY_PROCESSED,
                    "Job already in terminal state: " + s);
        }
    }

    private void validateWorkerToken(String token) {
        if (!MessageDigest.isEqual(
                workerSecret.getBytes(StandardCharsets.UTF_8),
                token.getBytes(StandardCharsets.UTF_8))) {
            throw new BusinessException(ErrorCode.WORKER_TOKEN_INVALID, "Worker token không hợp lệ");
        }
    }
}
