package com.pdfconverter.domain.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank @Email @Size(max = 255)
    private String email;

    @NotBlank @Size(min = 6, max = 128)
    private String password;

    @Size(max = 150)
    private String fullName;
}
