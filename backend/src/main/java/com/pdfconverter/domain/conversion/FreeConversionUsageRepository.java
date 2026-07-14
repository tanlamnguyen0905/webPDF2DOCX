package com.pdfconverter.domain.conversion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface FreeConversionUsageRepository extends JpaRepository<FreeConversionUsage, Long> {

    Optional<FreeConversionUsage> findByIdentityTypeAndIdentityValueAndUsageDate(
            FreeConversionUsage.IdentityType identityType,
            String identityValue,
            LocalDate usageDate);

    @Modifying
    @Query("UPDATE FreeConversionUsage f SET f.usedCount = f.usedCount + 1 " +
           "WHERE f.identityType = :type AND f.identityValue = :value AND f.usageDate = :date " +
           "AND f.usedCount < f.dailyLimit")
    int incrementIfUnderLimit(@Param("type") FreeConversionUsage.IdentityType type,
                              @Param("value") String value,
                              @Param("date") LocalDate date);
}
