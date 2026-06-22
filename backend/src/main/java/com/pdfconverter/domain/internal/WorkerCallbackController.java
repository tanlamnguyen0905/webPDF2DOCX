package com.pdfconverter.domain.internal;

import com.pdfconverter.common.response.ApiResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint nội bộ cho Python Worker callback (started/progress/completed/failed).
 * Chỉ worker gọi được bằng header X-Worker-Token. Xem done/backend/api_spec.md §13.
 * TODO: validate X-Worker-Token; cập nhật trạng thái job, trừ/hoàn coin.
 */
@RestController
@RequestMapping("/api/v1/internal/worker/conversions")
public class WorkerCallbackController {

    @PostMapping("/{id}/started")
    public ApiResponse<Void> started(@PathVariable Long id) {
        return ApiResponse.ok(null);
    }

    @PostMapping("/{id}/completed")
    public ApiResponse<Void> completed(@PathVariable Long id) {
        return ApiResponse.ok(null);
    }

    @PostMapping("/{id}/failed")
    public ApiResponse<Void> failed(@PathVariable Long id) {
        return ApiResponse.ok(null);
    }
}
