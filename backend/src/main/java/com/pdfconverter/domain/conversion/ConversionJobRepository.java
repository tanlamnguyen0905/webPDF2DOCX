package com.pdfconverter.domain.conversion;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

public interface ConversionJobRepository extends JpaRepository<ConversionJob, Long> {

    Optional<ConversionJob> findByRequestCode(String requestCode);

    Optional<ConversionJob> findByIdempotencyKey(String idempotencyKey);

    Page<ConversionJob> findAllByUserId(Long userId, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM ConversionJob c WHERE c.id = :id")
    Optional<ConversionJob> findByIdWithLock(Long id);
}
