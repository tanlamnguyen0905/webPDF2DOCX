package com.pdfconverter.common.response;

import java.util.List;
import org.springframework.data.domain.Page;

/** Response phân trang chuẩn. Xem done/backend/api_spec.md §2.4. */
public record PageResponse<T>(
        List<T> items, int page, int size, long totalItems, int totalPages, boolean hasNext) {

    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext());
    }
}
