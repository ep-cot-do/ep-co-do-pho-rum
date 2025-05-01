package com.fcoder.Fcoder.cron;

import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.repository.AccountRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class InactiveUserEmailCron {
    private static final Logger LOGGER = Logger.getLogger(InactiveUserEmailCron.class.getName());
    private static final int INACTIVE_MONTHS_THRESHOLD = 4;

    private final AccountRepository accountRepository;
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${application.mail.from:fcoder.contact@gmail.com}")
    private String fromEmail;

    @Value("${application.name:FCoder Community}")
    private String applicationName;

    @Value("${application.url:https://fcoder.com}")
    private String applicationUrl;

    public InactiveUserEmailCron(AccountRepository accountRepository,
                                 JavaMailSender mailSender,
                                 TemplateEngine templateEngine) {
        this.accountRepository = accountRepository;
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Scheduled(cron = "0 0 9 * * ?")
    public void checkInactiveUsers() {
        LOGGER.info("Starting inactive users check at " + LocalDateTime.now());

        LocalDateTime thresholdDate = LocalDateTime.now().minusMonths(INACTIVE_MONTHS_THRESHOLD);

        List<AccountEntity> inactiveUsers = accountRepository.findInactiveUsers(thresholdDate);

        LOGGER.info("Found " + inactiveUsers.size() + " inactive users (no login for " + INACTIVE_MONTHS_THRESHOLD + " months)");

        for (AccountEntity user : inactiveUsers) {
            try {
                sendInactivityWarningEmail(user);
                LOGGER.info("Inactivity warning email sent to: " + user.getEmail());
            } catch (Exception e) {
                LOGGER.log(Level.SEVERE, "Failed to send inactivity warning email to " + user.getEmail(), e);
            }
        }
    }

    public void sendInactivityWarningEmail(AccountEntity user) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(user.getEmail());
        helper.setSubject("We miss you at " + applicationName);

        Context context = new Context(Locale.getDefault());
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", user.getFullName() != null ? user.getFullName() : user.getUsername());
        variables.put("username", user.getUsername());
        variables.put("profileImg", user.getProfileImg());
        variables.put("applicationName", applicationName);
        variables.put("inactiveMonths", INACTIVE_MONTHS_THRESHOLD);
        variables.put("loginUrl", applicationUrl + "/login");

        long inactiveDays = ChronoUnit.DAYS.between(user.getLastLogin(), LocalDateTime.now());
        variables.put("inactiveDays", inactiveDays);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        String lastLoginDate = user.getLastLogin().format(formatter);
        variables.put("lastLoginDate", lastLoginDate);

        context.setVariables(variables);

        String emailContent = templateEngine.process("inactivity-warning-email", context);
        helper.setText(emailContent, true);

        mailSender.send(mimeMessage);
    }
}