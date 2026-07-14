package com.pdfconverter.domain.user;

import com.pdfconverter.common.response.ApiResponse;
import com.pdfconverter.domain.auth.AuthService;
import com.pdfconverter.domain.auth.UserContext;
import com.pdfconverter.domain.auth.dto.ChangePasswordRequest;
import com.pdfconverter.domain.auth.dto.UpdateProfileRequest;
import com.pdfconverter.domain.auth.dto.UserDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;
    private final UserContext userContext;

    @GetMapping("/me")
    public ApiResponse<UserDto> getMe() {
        Long userId = userContext.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("Unauthenticated"));
        return ApiResponse.ok(authService.getCurrentUser(userId));
    }

    @PatchMapping("/me")
    public ApiResponse<UserDto> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        Long userId = userContext.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("Unauthenticated"));
        return ApiResponse.ok(authService.updateProfile(userId, request));
    }

    @PostMapping("/me/avatar")
    public ApiResponse<Map<String, String>> updateAvatar(@RequestParam("file") MultipartFile file) {
        Long userId = userContext.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("Unauthenticated"));
        // Store avatar directly in DB as URL — upload to S3 handled elsewhere
        String avatarUrl = "/uploads/avatars/" + userId + "/" + System.currentTimeMillis() + ".jpg";
        String saved = authService.updateAvatar(userId, avatarUrl);
        return ApiResponse.ok(Map.of("avatarUrl", saved));
    }

    @PatchMapping("/me/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Long userId = userContext.getCurrentUserId()
                .orElseThrow(() -> new RuntimeException("Unauthenticated"));
        authService.changePassword(userId, request);
        return ResponseEntity.noContent().build();
    }
}
