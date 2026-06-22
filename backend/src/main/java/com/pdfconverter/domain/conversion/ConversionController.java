package com.pdfconverter.domain.conversion;

import com.pdfconverter.common.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller mẫu cho convert. Xem đặc tả endpoint: done/backend/api_spec.md §6.
 * TODO: bổ sung POST /conversions, GET /conversions, /status, /download...
 */
@RestController
@RequestMapping("/api/v1/conversions")
public class ConversionController {

    @GetMapping("/{id}")
    public ApiResponse<String> getById(@PathVariable Long id) {
        // TODO: trả về ConversionJobDto thực tế.
        return ApiResponse.ok("conversion #" + id + " (placeholder)");
    }
}
