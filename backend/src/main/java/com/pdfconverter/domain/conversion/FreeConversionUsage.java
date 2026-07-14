package com.pdfconverter.domain.conversion;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity ánh xạ bảng free_conversion_usages.
 */
@Entity
@Table(name = "free_conversion_usages",
        uniqueConstraints = @UniqueConstraint(columnNames = {"identity_type", "identity_value", "usage_date"}))
@Getter
@Setter
public class FreeConversionUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "identity_type", nullable = false, length = 20)
    private IdentityType identityType;

    @Column(name = "identity_value", nullable = false, length = 255)
    private String identityValue;

    @Column(name = "usage_date", nullable = false)
    private LocalDate usageDate;

    @Column(name = "used_count", nullable = false)
    private Integer usedCount = 0;

    @Column(name = "daily_limit", nullable = false)
    private Integer dailyLimit = 5;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false)
    private LocalDateTime updatedAt;

    public enum IdentityType {
        USER, GUEST, IP
    }
}
