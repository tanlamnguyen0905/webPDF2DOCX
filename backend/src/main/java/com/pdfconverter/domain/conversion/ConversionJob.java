package com.pdfconverter.domain.conversion;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.LastModifiedDate;

/**
 * Entity ánh xạ bảng conversion_jobs. Xem done/TechSpec/schema.md §5.5.
 * Đây là entity mẫu thể hiện cách map; các domain khác làm tương tự.
 */
@Entity
@Table(name = "conversion_jobs")
@Getter
@Setter
public class ConversionJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_code", nullable = false, unique = true, length = 64)
    private String requestCode;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "guest_token", length = 100)
    private String guestToken;

    @Column(name = "idempotency_key", length = 255)
    private String idempotencyKey;

    @Column(name = "original_file_name", nullable = false)
    private String originalFileName;

    @Column(name = "original_file_path", nullable = false, length = 500)
    private String originalFilePath;

    @Column(name = "output_file_name")
    private String outputFileName;

    @Column(name = "output_file_path", length = 500)
    private String outputFilePath;

    @Column(name = "file_size_bytes", nullable = false)
    private Long fileSizeBytes;

    @Column(name = "total_pages", nullable = false)
    private Integer totalPages;

    @Enumerated(EnumType.STRING)
    @Column(name = "conversion_mode", nullable = false)
    private ConversionMode conversionMode;

    @Enumerated(EnumType.STRING)
    @Column(name = "processing_type", nullable = false)
    private ProcessingType processingType = ProcessingType.NORMAL;

    @Column(name = "coin_estimated", nullable = false)
    private Integer coinEstimated = 0;

    @Column(name = "coin_charged", nullable = false)
    private Integer coinCharged = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ConversionStatus status = ConversionStatus.PENDING;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "file_expired_at")
    private LocalDateTime fileExpiredAt;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
