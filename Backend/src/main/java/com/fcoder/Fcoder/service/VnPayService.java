package com.fcoder.Fcoder.service;

import java.math.BigDecimal;
import java.util.Map;

public interface VnPayService {
    String createPaymentUrl(Long accountId, BigDecimal amount, String bankCode);
    boolean validateResponse(Map<String, String> vnpResponse);
}