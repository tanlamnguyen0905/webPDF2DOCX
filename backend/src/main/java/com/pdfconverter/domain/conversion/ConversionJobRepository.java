package com.pdfconverter.domain.conversion;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversionJobRepository extends JpaRepository<ConversionJob, Long> {

    Optional<ConversionJob> findByRequestCode(String requestCode);

    Page<ConversionJob> findAllByUserId(Long userId, Pageable pageable);
}
