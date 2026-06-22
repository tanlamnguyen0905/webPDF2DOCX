package com.pdfconverter.config;

import java.net.URI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.sqs.SqsClient;

/**
 * Khởi tạo S3 + SQS client trỏ vào LocalStack ở local (endpoint override).
 * Production bỏ endpoint override để dùng AWS thật.
 */
@Configuration
public class AwsConfig {

    @Value("${app.aws.region}")
    private String region;

    @Value("${app.aws.access-key}")
    private String accessKey;

    @Value("${app.aws.secret-key}")
    private String secretKey;

    @Value("${app.aws.endpoint-url}")
    private String endpointUrl;

    private StaticCredentialsProvider credentials() {
        return StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey));
    }

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(credentials())
                .endpointOverride(URI.create(endpointUrl))
                .forcePathStyle(true) // cần cho LocalStack
                .build();
    }

    @Bean
    public SqsClient sqsClient() {
        return SqsClient.builder()
                .region(Region.of(region))
                .credentialsProvider(credentials())
                .endpointOverride(URI.create(endpointUrl))
                .build();
    }
}
