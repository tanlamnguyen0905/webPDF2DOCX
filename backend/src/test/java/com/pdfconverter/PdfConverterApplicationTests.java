package com.pdfconverter;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Cần MySQL/LocalStack đang chạy. Bật khi đã có hạ tầng local.")
class PdfConverterApplicationTests {

    @Test
    void contextLoads() {
    }
}
