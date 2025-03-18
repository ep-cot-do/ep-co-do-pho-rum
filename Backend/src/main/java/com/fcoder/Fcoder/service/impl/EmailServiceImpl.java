package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.entity.PaymentEntity;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.repository.PaymentRepository;
import com.fcoder.Fcoder.service.EmailService;
import com.fcoder.Fcoder.service.PaymentUrlBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final AccountRepository accountRepository;
    private final PaymentUrlBuilder paymentUrlBuilder;

    private final PaymentRepository paymentRepository;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${payment.default.amount:70000}")
    private BigDecimal defaultPaymentAmount;

    public EmailServiceImpl(
            JavaMailSender mailSender,
            TemplateEngine templateEngine,
            AccountRepository accountRepository,
            PaymentUrlBuilder paymentUrlBuilder, PaymentRepository paymentRepository) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.accountRepository = accountRepository;
        this.paymentUrlBuilder = paymentUrlBuilder;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public void sendPaymentReminderEmail(AccountEntity account) {
        try {
            PaymentEntity latestPayment = paymentRepository.findFirstByOrderByCreatedDateDesc();
            BigDecimal amountToCharge = latestPayment != null ? latestPayment.getAmount() : defaultPaymentAmount;

            String paymentUrl = paymentUrlBuilder.buildPaymentUrl(
                    account.getId(),
                    account.getStudentCode(),
                    account.getFullName(),
                    amountToCharge,
                    null);

            Context context = new Context();
            context.setVariable("account", account);
            context.setVariable("quarter", getCurrentQuarterName());
            context.setVariable("amount", amountToCharge);
            context.setVariable("dueDate", getQuarterEndDate());
            context.setVariable("paymentUrl", paymentUrl);

            String emailContent = templateEngine.process("payment-reminder", context);

            sendHtmlEmail(
                    account.getEmail(),
                    "Fund Payment Reminder - " + getCurrentQuarterName(),
                    emailContent
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void sendPaymentSuccessEmail(AccountEntity account, String transactionId, BigDecimal amount) {
        try {
            // Set up template context
            Context context = new Context();
            context.setVariable("account", account);
            context.setVariable("quarter", getCurrentQuarterName());
            context.setVariable("amount", amount);
            context.setVariable("transactionId", transactionId);
            context.setVariable("paymentDate", LocalDateTime.now());

            // Process template
            String emailContent = templateEngine.process("payment-success", context);

            // Send email
            sendHtmlEmail(
                    account.getEmail(),
                    "Payment Successful - " + getCurrentQuarterName(),
                    emailContent
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        helper.setFrom(senderEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        mailSender.send(mimeMessage);
    }

    private String getCurrentQuarterName() {
        int month = LocalDateTime.now().getMonthValue();
        int year = LocalDateTime.now().getYear();
        String yearSuffix = String.valueOf(year).substring(2);

        if (month <= 4) return "Spring " + year + " (SP" + yearSuffix + ")";
        if (month <= 8) return "Summer " + year + " (SU" + yearSuffix + ")";
        return "Fall " + year + " (FA" + yearSuffix + ")";
    }

    private String getQuarterEndDate() {
        int month = LocalDateTime.now().getMonthValue();
        int year = LocalDateTime.now().getYear();

        LocalDate endDate;
        if (month <= 4) {
            endDate = LocalDate.of(year, 4, 30);
        } else if (month <= 8) {
            endDate = LocalDate.of(year, 8, 31);
        } else {
            endDate = LocalDate.of(year, 12, 31);
        }

        return endDate.format(DateTimeFormatter.ofPattern("MMMM d, yyyy"));
    }

    @Scheduled(cron = "0 0 12 1 1,5,9 *")
    public void sendQuarterlyPaymentReminders() {
        List<AccountEntity> accounts = accountRepository.findAll();
        for (AccountEntity account : accounts) {
            sendPaymentReminderEmail(account);
        }
    }

    @Scheduled(cron = "0 0 9 15 * *")
    public void sendPaymentRemindersToUnpaidAccounts() {
        List<AccountEntity> unpaidAccounts = accountRepository.findByFundStatusFalse();
        for (AccountEntity account : unpaidAccounts) {
            sendPaymentReminderEmail(account);
        }
    }
}