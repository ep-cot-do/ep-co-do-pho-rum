package com.fcoder.Fcoder.service;

import java.math.BigDecimal;

public interface PaymentUrlBuilder {
    String buildPaymentUrl(Long accountId, String studentCode, String fullName, BigDecimal amount, String bankCode);
}