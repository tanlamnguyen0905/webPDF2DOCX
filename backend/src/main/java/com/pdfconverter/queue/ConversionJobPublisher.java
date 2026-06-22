package com.pdfconverter.queue;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sqs.SqsClient;

/**
 * Gửi message conversion job vào SQS cho Python Worker.
 * Định dạng message: done/backend/api_spec.md §14.2.
 * TODO: build message body + gửi sendMessage với message attributes (priority...).
 */
@Service
public class ConversionJobPublisher {

    private final SqsClient sqsClient;

    public ConversionJobPublisher(SqsClient sqsClient) {
        this.sqsClient = sqsClient;
    }

    // TODO: void publish(ConversionJob job)
}
