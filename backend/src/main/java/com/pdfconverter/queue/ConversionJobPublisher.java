package com.pdfconverter.queue;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

import java.util.HashMap;
import java.util.Map;

/**
 * Gui message conversion job vao SQS cho Python Worker.
 * Dinh dang message: done/backend/api_spec.md section 14.2.
 */
@Service
public class ConversionJobPublisher {

    private final SqsClient sqsClient;
    private final String queueUrl;

    public ConversionJobPublisher(SqsClient sqsClient,
                                  @Value("${app.aws.sqs-queue-name}") String queueName,
                                  @Value("${app.aws.endpoint-url}") String endpointUrl) {
        this.sqsClient = sqsClient;
        this.queueUrl = endpointUrl + "/000000000000/" + queueName;
    }

    public void publish(Long conversionJobId, String s3Bucket, String s3Key,
                        String processingType, String conversionMode) {
        Map<String, Object> message = new HashMap<>();
        message.put("conversionJobId", conversionJobId);
        message.put("s3Bucket", s3Bucket);
        message.put("s3Key", s3Key);
        message.put("processingType", processingType);
        message.put("conversionMode", conversionMode);

        String body;
        try {
            body = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize SQS message", e);
        }

        SendMessageRequest request = SendMessageRequest.builder()
                .queueUrl(queueUrl)
                .messageBody(body)
                .build();
        sqsClient.sendMessage(request);
    }
}
