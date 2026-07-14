package com.pdfconverter.domain.auth;

import com.pdfconverter.common.response.ApiResponse;
import com.pdfconverter.domain.auth.dto.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final GuestContext guestContext;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDto>> register(@Valid @RequestBody RegisterRequest request) {
        UserDto userDto = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(userDto, "Đăng ký thành công"));
    }

    @PostMapping("/login")
    public ApiResponse<AuthTokenDto> login(@Valid @RequestBody LoginRequest request,
                                           HttpServletRequest httpRequest) {
        String ip = guestContext.getClientIp();
        AuthTokenDto token = authService.login(request, ip);
        return ApiResponse.ok(token, "Đăng nhập thành công");
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthTokenDto> refresh(@Valid @RequestBody RefreshRequest request,
                                             HttpServletRequest httpRequest) {
        String ip = guestContext.getClientIp();
        AuthTokenDto token = authService.refresh(request, ip);
        return ApiResponse.ok(token, "Token đã được làm mới");
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest request) {
        authService.logout(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ApiResponse.ok("Nếu email tồn tại, hệ thống sẽ gửi hướng dẫn đặt lại mật khẩu");
    }

    @PostMapping("/reset-password")
    public ApiResponse<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ApiResponse.ok("Mật khẩu đã được đặt lại thành công");
    }
}
