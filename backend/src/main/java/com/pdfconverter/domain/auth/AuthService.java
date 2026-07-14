package com.pdfconverter.domain.auth;

import com.pdfconverter.common.exception.BusinessException;
import com.pdfconverter.common.exception.ErrorCode;
import com.pdfconverter.domain.auth.dto.*;
import com.pdfconverter.domain.coin.CoinTransaction;
import com.pdfconverter.domain.coin.CoinTransactionReason;
import com.pdfconverter.domain.coin.CoinTransactionRepository;
import com.pdfconverter.domain.coin.CoinTransactionType;
import com.pdfconverter.domain.user.*;
import com.pdfconverter.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final CoinTransactionRepository coinTransactionRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserDto register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS, "Email đã tồn tại");
        }

        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName() != null ? request.getFullName().trim() : null);
        user.setCoinBalance(10);
        user = userRepository.save(user);

        CoinTransaction tx = new CoinTransaction();
        tx.setUserId(user.getId());
        tx.setType(CoinTransactionType.ADD);
        tx.setAmount(10);
        tx.setBalanceBefore(0);
        tx.setBalanceAfter(10);
        tx.setReason(CoinTransactionReason.SIGNUP_BONUS.name());
        tx.setTransactionCode("SIGNUP-" + user.getId() + "-" + System.currentTimeMillis());
        coinTransactionRepository.save(tx);

        return UserDto.from(user);
    }

    @Transactional
    public AuthTokenDto login(LoginRequest request, String ipAddress) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS, "Sai email hoặc mật khẩu"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED, "Tài khoản đã bị khóa");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS, "Sai email hoặc mật khẩu");
        }

        user.setLastLoginAt(LocalDateTime.now());
        user.setLastLoginIp(ipAddress);
        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);
        storeRefreshToken(user, refreshToken, ipAddress);

        return new AuthTokenDto(accessToken, refreshToken, jwtTokenProvider.getAccessExpirationSeconds());
    }

    @Transactional
    public AuthTokenDto refresh(RefreshRequest request, String ipAddress) {
        String tokenHash = hashToken(request.getRefreshToken());
        RefreshToken stored = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new BusinessException(ErrorCode.REFRESH_TOKEN_INVALID, "Refresh token không hợp lệ"));

        if (stored.getRevokedAt() != null) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_INVALID, "Refresh token không hợp lệ");
        }

        if (stored.getExpiresAt().isBefore(LocalDateTime.now())) {
            stored.setRevokedAt(LocalDateTime.now());
            refreshTokenRepository.save(stored);
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_EXPIRED, "Refresh token đã hết hạn");
        }

        stored.setRevokedAt(LocalDateTime.now());
        refreshTokenRepository.save(stored);

        User user = stored.getUser();
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);
        storeRefreshToken(user, refreshToken, ipAddress);

        return new AuthTokenDto(accessToken, refreshToken, jwtTokenProvider.getAccessExpirationSeconds());
    }

    @Transactional
    public void logout(RefreshRequest request) {
        String tokenHash = hashToken(request.getRefreshToken());
        refreshTokenRepository.findByTokenHash(tokenHash)
                .ifPresent(token -> {
                    token.setRevokedAt(LocalDateTime.now());
                    refreshTokenRepository.save(token);
                });
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail().trim().toLowerCase()).ifPresent(user -> {
            String rawToken = UUID.randomUUID().toString().replace("-", "") + new SecureRandom().nextLong();
            String tokenHash = hashToken(rawToken);

            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setUser(user);
            resetToken.setTokenHash(tokenHash);
            resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(15));
            passwordResetTokenRepository.save(resetToken);

            // TODO: send email with rawToken via notification service
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String tokenHash = hashToken(request.getToken());
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESET_TOKEN_INVALID, "Token không hợp lệ"));

        if (resetToken.getUsedAt() != null || resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException(ErrorCode.RESET_TOKEN_EXPIRED, "Token đã hết hạn");
        }

        resetToken.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(resetToken);

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public UserDto getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Người dùng không tồn tại"));
        return UserDto.from(user);
    }

    @Transactional
    public UserDto updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Người dùng không tồn tại"));
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName().trim());
        }
        userRepository.save(user);
        return UserDto.from(user);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Người dùng không tồn tại"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.INVALID_PASSWORD, "Mật khẩu hiện tại không đúng");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public String updateAvatar(Long userId, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Người dùng không tồn tại"));
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);
        return avatarUrl;
    }

    private void storeRefreshToken(User user, String token, String ipAddress) {
        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setTokenHash(hashToken(token));
        rt.setExpiresAt(LocalDateTime.now().plusDays(7));
        rt.setIpAddress(ipAddress);
        refreshTokenRepository.save(rt);
    }

    private String hashToken(String token) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(token.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to hash token", e);
        }
    }
}
