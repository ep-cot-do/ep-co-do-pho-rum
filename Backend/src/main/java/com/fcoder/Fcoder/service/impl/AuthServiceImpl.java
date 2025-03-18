package com.fcoder.Fcoder.service.impl;

import com.fcoder.Fcoder.config.GoogleApisConfig;
import com.fcoder.Fcoder.model.constant.JwtTokenType;
import com.fcoder.Fcoder.model.dto.request.AuthRequest;
//import com.fcoder.Fcoder.model.dto.request.ForgotPasswordRequest;
import com.fcoder.Fcoder.model.dto.response.AuthResponse;
import com.fcoder.Fcoder.model.entity.AccountEntity;
import com.fcoder.Fcoder.model.exception.ActionFailedException;
import com.fcoder.Fcoder.model.exception.ValidationException;
import com.fcoder.Fcoder.repository.AccountRepository;
import com.fcoder.Fcoder.service.AuthService;
import com.fcoder.Fcoder.service.JwtService;
import com.fcoder.Fcoder.util.AuthUtils;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.gson.Gson;
import org.springframework.mail.javamail.JavaMailSender;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final GoogleApisConfig googleApisConfig;
    private final AccountRepository accountRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final TemplateEngine templateEngine;
    private final PasswordEncoder passwordEncoder;

    @Value("${spring.mail.username}")
    private String mailUsername;
    @Value("${base-urls.front-end}")
    private String frontendUrl;
    private final JavaMailSender mailSender;


    @Override
    public AuthResponse memberLocalAuthentication(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String accessToken = jwtService.generateToken(authentication, JwtTokenType.ACCESS_TOKEN);
        String refreshToken = jwtService.generateToken(authentication, JwtTokenType.REFRESH_TOKEN);

        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        String username = authentication.getName();
        AccountEntity account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ActionFailedException("User not found"));

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role(role)
                .userId(account.getId())
                .build();
    }

    @Override
    public AuthResponse memberLocalAuthentication(AuthRequest authRequest, Consumer<List<Cookie>> callback) {
        var authResponse = memberLocalAuthentication(authRequest);
        List<Cookie> cookies = new ArrayList<>();
        cookies.add(jwtService.tokenCookieWarp(authResponse.getAccessToken(), JwtTokenType.ACCESS_TOKEN));
        cookies.add(jwtService.tokenCookieWarp(authResponse.getRefreshToken(), JwtTokenType.REFRESH_TOKEN));
        callback.accept(cookies);
        return authResponse;
    }

    private AuthResponse wrapAccountToAuthResponse(AccountEntity account) {
        var roles = AuthUtils.convertUserToRole(account);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String accessToken = jwtService.generateToken(account.getUsername(), roles, JwtTokenType.ACCESS_TOKEN);
        String refreshToken = jwtService.generateToken(account.getUsername(), roles, JwtTokenType.REFRESH_TOKEN);

        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role(role)
                .userId(account.getId())
                .build();
    }

    @Override
    public void sendForgotConfirmation(String email) {
        var accountEntity = accountRepository.findByEmail(email)
                .orElseThrow(() -> new ValidationException("Email not found"));

        String resetUrl = String.format("%s/reset-password?email=%s", frontendUrl, email);

        sendEmail(email, "Confirm password reset", forgotEmail(accountEntity.getUsername(), resetUrl));
    }


    private void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(mailUsername);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String forgotEmail(String username, String resetUrl) {
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("resetUrl", resetUrl);

        return templateEngine.process("forgot-password", context);
    }


    @Override
    public void resetForgotPassword(String email, String newPassword) {
        var accountEntity = accountRepository.findByEmail(email)
                .orElseThrow(() -> new ValidationException("Email not found"));

        accountEntity.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(accountEntity);
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String username = authentication.getName();

            redisTemplate.delete("TOKEN:" + username);

            Cookie accessTokenCookie = new Cookie("ACCESS_TOKEN", null);
            accessTokenCookie.setMaxAge(0);
            accessTokenCookie.setPath("/");

            Cookie refreshTokenCookie = new Cookie("REFRESH_TOKEN", null);
            refreshTokenCookie.setMaxAge(0);
            refreshTokenCookie.setPath("/");

            response.addCookie(accessTokenCookie);
            response.addCookie(refreshTokenCookie);
            SecurityContextHolder.clearContext();
        }
    }

    private String generateGoogleUsername(String email) {
        return String.format("google:%s", email);
    }
}
