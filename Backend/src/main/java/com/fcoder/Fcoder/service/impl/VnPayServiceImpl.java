package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.service.EmailService;
import com.fcoder.Fcoder.service.PaymentUrlBuilder;
import com.fcoder.Fcoder.service.VnPayService;
import com.fcoder.Fcoder.util.VnPayUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class VnPayServiceImpl implements VnPayService {

    @Value("${payment.vnpay.secretKey}")
    private String vnpHashSecret;

    private final AccountRepository accountRepository;
    private final EmailService emailService;
    private final PaymentUrlBuilder paymentUrlBuilder;

    public VnPayServiceImpl(AccountRepository accountRepository, EmailService emailService, PaymentUrlBuilder paymentUrlBuilder) {
        this.accountRepository = accountRepository;
        this.emailService = emailService;
        this.paymentUrlBuilder = paymentUrlBuilder;
    }

    @Override
    public String createPaymentUrl(Long accountId, BigDecimal amount, String bankCode) {
        AccountEntity student = accountRepository.findById(accountId)
                .orElseThrow(() -> new ValidationException("Student not found"));

        return paymentUrlBuilder.buildPaymentUrl(
                accountId,
                student.getStudentCode(),
                student.getFullName(),
                amount,
                bankCode
        );
    }

    @Override
    public boolean validateResponse(Map<String, String> vnpResponse) {
        boolean isValid = VnPayUtils.validateResponse(vnpResponse, vnpHashSecret);
        if (isValid) {
            Long accountId = Long.valueOf(vnpResponse.get("vnp_TxnRef"));
            String transactionId = vnpResponse.get("vnp_TransactionNo");
            BigDecimal amount = new BigDecimal(vnpResponse.get("vnp_Amount"))
                    .divide(BigDecimal.valueOf(100));

            accountRepository.findById(accountId).ifPresent(account -> {
                account.setFundStatus(true);
                accountRepository.save(account);

                emailService.sendPaymentSuccessEmail(account, transactionId, amount);
            });
        }
        return isValid;
    }
}