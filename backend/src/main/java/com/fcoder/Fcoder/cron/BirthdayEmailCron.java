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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class BirthdayEmailCron {
    private static final Logger LOGGER = Logger.getLogger(BirthdayEmailCron.class.getName());

    private final AccountRepository accountRepository;
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${application.mail.from:fcoder.contact@gmail.com}")
    private String fromEmail;

    @Value("${application.name:FCoder Community}")
    private String applicationName;

    public BirthdayEmailCron(AccountRepository accountRepository,
                             JavaMailSender mailSender,
                             TemplateEngine templateEngine) {
        this.accountRepository = accountRepository;
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void cronUpdater() {
        LOGGER.info("Starting birthday email check at " + LocalDateTime.now());

        LocalDate today = LocalDate.now();
        int todayMonth = today.getMonthValue();
        int todayDay = today.getDayOfMonth();

        List<AccountEntity> birthdayUsers = accountRepository.findAll().stream()
                .filter(account -> {
                    LocalDate birthday = account.getBirthday();
                    return birthday != null &&
                            birthday.getMonthValue() == todayMonth &&
                            birthday.getDayOfMonth() == todayDay;
                })
                .toList();

        LOGGER.info("Found " + birthdayUsers.size() + " users with birthdays today");

        for (AccountEntity user : birthdayUsers) {
            try {
                sendBirthdayEmail(user);
                LOGGER.info("Birthday email sent to: " + user.getEmail());
            } catch (Exception e) {
                LOGGER.log(Level.SEVERE, "Failed to send birthday email to " + user.getEmail(), e);
            }
        }
    }

    public void sendBirthdayEmail(AccountEntity user) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(user.getEmail());
        helper.setSubject("Happy Birthday from " + applicationName + "!");

        Context context = new Context(Locale.getDefault());
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", user.getFullName());
        variables.put("profileImg", user.getProfileImg());
        variables.put("currentYear", LocalDate.now().getYear());
        variables.put("birthYear", user.getBirthday().getYear());
        variables.put("age", LocalDate.now().getYear() - user.getBirthday().getYear());
        variables.put("applicationName", applicationName);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        String memberSince = user.getCreatedDate().format(formatter);
        variables.put("memberSince", memberSince);

        context.setVariables(variables);

        String emailContent = templateEngine.process("birthday-email", context);
        helper.setText(emailContent, true);

        mailSender.send(mimeMessage);
    }
}