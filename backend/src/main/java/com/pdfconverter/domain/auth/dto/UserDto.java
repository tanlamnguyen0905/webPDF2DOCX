package com.pdfconverter.domain.auth.dto;

import com.pdfconverter.domain.user.User;
import com.pdfconverter.domain.user.UserRole;
import com.pdfconverter.domain.user.UserStatus;
import com.pdfconverter.domain.user.UserSubscriptionTier;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private String avatarUrl;
    private UserRole role;
    private Integer coinBalance;
    private UserSubscriptionTier subscriptionTier;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;

    public static UserDto from(User user) {
        return new UserDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getRole(),
                user.getCoinBalance(),
                user.getSubscriptionTier(),
                user.getLastLoginAt(),
                user.getCreatedAt()
        );
    }
}
