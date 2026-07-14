package com.pdfconverter.domain.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthTokenDto {
    private String accessToken;
    private String refreshToken;
    private long expiresIn;
}
