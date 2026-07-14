package com.pdfconverter.domain.coin;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Entity ánh xạ bảng coin_transactions.
 */
@Entity
@Table(name = "coin_transactions")
@Getter
@Setter
public class CoinTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_code", nullable = false, unique = true, length = 64)
    private String transactionCode;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "payment_id")
    private Long paymentId;

    @Column(name = "conversion_job_id")
    private Long conversionJobId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CoinTransactionType type;

    @Column(nullable = false)
    private Integer amount;

    @Column(name = "balance_before", nullable = false)
    private Integer balanceBefore;

    @Column(name = "balance_after", nullable = false)
    private Integer balanceAfter;

    @Column(nullable = false, length = 255)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CoinTransactionStatus status = CoinTransactionStatus.SUCCESS;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private LocalDateTime createdAt;

    public static CoinTransaction deduct(Long userId, Long jobId, Integer amount,
                                          Integer balanceBefore, String reason) {
        CoinTransaction tx = new CoinTransaction();
        tx.setUserId(userId);
        tx.setConversionJobId(jobId);
        tx.setType(CoinTransactionType.DEDUCT);
        tx.setAmount(amount);
        tx.setBalanceBefore(balanceBefore);
        tx.setBalanceAfter(balanceBefore - amount);
        tx.setReason(reason);
        tx.setStatus(CoinTransactionStatus.SUCCESS);
        return tx;
    }

    public static CoinTransaction refund(Long userId, Long jobId, Integer amount,
                                          Integer balanceBefore, String reason) {
        CoinTransaction tx = new CoinTransaction();
        tx.setUserId(userId);
        tx.setConversionJobId(jobId);
        tx.setType(CoinTransactionType.REFUND);
        tx.setAmount(amount);
        tx.setBalanceBefore(balanceBefore);
        tx.setBalanceAfter(balanceBefore + amount);
        tx.setReason(reason);
        tx.setStatus(CoinTransactionStatus.SUCCESS);
        return tx;
    }
}
