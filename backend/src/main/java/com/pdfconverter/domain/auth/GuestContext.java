package com.pdfconverter.domain.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Optional;

/**
 * Lấy thông tin guest hoặc user từ request context.
 */
@Component
public class GuestContext {

    public Optional<String> getGuestToken() {
        return Optional.ofNullable(getRequest())
                .map(r -> r.getHeader("X-Guest-Token"));
    }

    public String getClientIp() {
        HttpServletRequest request = getRequest();
        if (request == null) return "unknown";
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isEmpty()) return xff.split(",")[0].trim();
        return request.getRemoteAddr();
    }

    private HttpServletRequest getRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attrs != null ? attrs.getRequest() : null;
    }
}
