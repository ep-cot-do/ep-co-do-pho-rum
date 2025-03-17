package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.service.VnPayService;
import com.fcoder.Fcoder.util.VnPayUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class VnPayServiceImpl implements VnPayService {

    @Value("${payment.vnpay.tmnCode}")
    private String vnpTmnCode;

    @Value("${payment.vnpay.secretKey}")
    private String vnpHashSecret;

    @Value("${payment.vnpay.returnUrl}")
    private String vnpReturnUrl;

    @Value("${payment.vnpay.apiUrl}")
    private String vnpApiUrl;

    @Value("${payment.vnpay.version}")
    private String vnpVersion;

    @Value("${payment.vnpay.command}")
    private String vnpCommand;

    @Value("${payment.vnpay.currencyCode}")
    private String vnpCurrencyCode;

    @Value("${payment.vnpay.locale}")
    private String vnpLocale;

    private final AccountRepository accountRepository;

    public VnPayServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public String createPaymentUrl(Long accountId, BigDecimal amount, String bankCode) {
        String quarter = getCurrentQuarter();
        AccountEntity student = accountRepository.findById(accountId)
                .orElseThrow(() -> new ValidationException("Student not found"));
        String orderInfo = "Quy" + quarter + "_" + student.getStudentCode()+"_"+student.getFullName();

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnpVersion);
        vnpParams.put("vnp_Command", vnpCommand);
        vnpParams.put("vnp_TmnCode", vnpTmnCode);
        vnpParams.put("vnp_Amount", String.valueOf(amount.multiply(BigDecimal.valueOf(100)).intValue()));
        vnpParams.put("vnp_CurrCode", vnpCurrencyCode);
        vnpParams.put("vnp_TxnRef", String.valueOf(accountId));
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", "billpayment");
        vnpParams.put("vnp_Locale", vnpLocale);
        vnpParams.put("vnp_ReturnUrl", vnpReturnUrl);
        vnpParams.put("vnp_CreateDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));

        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParams.put("vnp_BankCode", bankCode);
        }

        return vnpApiUrl + "?" + VnPayUtils.createQueryUrl(vnpParams, vnpHashSecret);
    }

    @Override
    public boolean validateResponse(Map<String, String> vnpResponse) {
        boolean isValid = VnPayUtils.validateResponse(vnpResponse, vnpHashSecret);
        if (isValid) {
            Long accountId = Long.valueOf(vnpResponse.get("vnp_TxnRef"));
            accountRepository.findById(accountId).ifPresent(account -> {
                account.setFundStatus(true);
                accountRepository.save(account);
            });
        }
        return isValid;
    }

    private String getCurrentQuarter() {
        int month = LocalDateTime.now().getMonthValue();
        String yearSuffix = String.valueOf(Year.now().getValue()).substring(2);
        if (month <= 4) return "SP" + yearSuffix;
        if (month <= 8) return "SU" + yearSuffix;
        return "FA" + yearSuffix;
    }
}
