package com.pdfconverter.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Simple token-bucket rate limiter per IP.
 * Applies to public endpoints: /api/v1/auth/**, /api/v1/uploads/pdf/preview, /api/v1/conversions/free-usage/today
 */
@Component
@Order(1)
public class RateLimitFilter implements Filter {

    private static final int MAX_REQUESTS_PER_MINUTE = 10;
    private static final long WINDOW_MS = TimeUnit.MINUTES.toMillis(1);

    // IP -> list of request timestamps (within the current window)
    private final Map<String, java.util.Deque<Long>> requests = new ConcurrentHashMap<>();

    private static final java.util.Set<String> RATE_LIMITED_PATHS = java.util.Set.of(
            "/api/v1/auth/",
            "/api/v1/uploads/pdf/preview",
            "/api/v1/conversions/free-usage/today"
    );

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpReq = (HttpServletRequest) request;
        HttpServletResponse httpResp = (HttpServletResponse) response;

        String path = httpReq.getRequestURI();
        boolean rateLimited = RATE_LIMITED_PATHS.stream().anyMatch(path::startsWith);

        if (!rateLimited) {
            chain.doFilter(request, response);
            return;
        }

        String ip = getClientIp(httpReq);
        long now = Instant.now().toEpochMilli();

        requests.compute(ip, (k, deque) -> {
            if (deque == null) {
                deque = new java.util.ArrayDeque<>();
            }
            // Remove timestamps outside the window
            while (!deque.isEmpty() && now - deque.peekFirst() > WINDOW_MS) {
                deque.pollFirst();
            }
            return deque;
        });

        java.util.Deque<Long> deque = requests.get(ip);
        if (deque.size() >= MAX_REQUESTS_PER_MINUTE) {
            long retryAfterMs = WINDOW_MS - (now - deque.peekFirst());
            httpResp.setStatus(429);
            httpResp.setHeader("Retry-After", String.valueOf(TimeUnit.MILLISECONDS.toSeconds(retryAfterMs) + 1));
            httpResp.setContentType("application/json");
            httpResp.getWriter().write("{\"error\":\"RATE_LIMIT_EXCEEDED\",\"message\":\"Too many requests, please try again later\"}");
            return;
        }

        deque.addLast(now);
        chain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isEmpty()) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}