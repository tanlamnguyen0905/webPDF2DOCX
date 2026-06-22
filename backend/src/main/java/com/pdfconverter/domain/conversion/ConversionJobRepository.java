package com.pdfconverter.domain.conversion;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversionJobRepository extends JpaRepository<ConversionJob, Long> {

    Optional<ConversionJob> findByRequestCode(String requestCode);
}
