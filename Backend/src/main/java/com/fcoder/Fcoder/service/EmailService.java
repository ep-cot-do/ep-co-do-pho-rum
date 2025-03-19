package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.entity.AccountEntity;

import java.math.BigDecimal;

public interface EmailService {
    void sendPaymentReminderEmail(AccountEntity account);
    void sendPaymentSuccessEmail(AccountEntity account, String transactionId, BigDecimal amount);
}