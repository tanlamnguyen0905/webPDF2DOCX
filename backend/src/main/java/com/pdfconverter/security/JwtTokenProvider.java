package com.pdfconverter.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Tạo & xác thực JWT access/refresh token.
 * TODO: dùng io.jsonwebtoken (jjwt) để sign/parse; thêm JwtAuthFilter để gắn Authentication.
 */
@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.access-expiration-seconds}")
    private long accessExpirationSeconds;

    // TODO: String generateAccessToken(user), boolean validate(token), Long getUserId(token)
}
