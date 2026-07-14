package com.pdfconverter.domain.auth;

import com.pdfconverter.domain.user.User;
import com.pdfconverter.domain.user.UserRepository;
import com.pdfconverter.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Optional;

/**
 * Lấy thông tin user từ JWT trong Authorization header.
 */
@Component
public class UserContext {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public UserContext(JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    public Optional<User> getCurrentUser() {
        HttpServletRequest request = getRequest();
        if (request == null) return Optional.empty();
        String auth = request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) return Optional.empty();
        String token = auth.substring(7);
        if (!jwtTokenProvider.validateToken(token)) return Optional.empty();
        Long userId = jwtTokenProvider.getUserIdFromToken(token);
        return userRepository.findById(userId);
    }

    public Optional<Long> getCurrentUserId() {
        return getCurrentUser().map(User::getId);
    }

    private HttpServletRequest getRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attrs != null ? attrs.getRequest() : null;
    }
}
