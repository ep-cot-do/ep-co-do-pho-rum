package com.fcoder.Fcoder.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class VnPayConfig {
    @Value("${payment.vnpay.apiUrl}")
    private String vnpApiUrl;
    @Value("${payment.vnpay.tmnCode}")
    private String vnpTmnCode;
    @Value("${payment.vnpay.secretKey}")
    private String vnpHashSecret;
}