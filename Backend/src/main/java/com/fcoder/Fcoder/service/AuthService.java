package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.dto.request.AuthRequest;
//import com.fcoder.Fcoder.model.dto.request.ForgotPasswordRequest;
import com.fcoder.Fcoder.model.dto.response.AuthResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.List;
import java.util.function.Consumer;

public interface AuthService {
    AuthResponse memberLocalAuthentication (AuthRequest authRequest);
    AuthResponse memberLocalAuthentication (AuthRequest authRequest, Consumer<List<Cookie>> callback);

//    String generateGoogleAuthenticationUrl();
//
//    AuthResponse googleOAuth2Callback(String code);

//    void forgotPasswordUrlCreate(String email);

//    void forgotPasswordConfirm (ForgotPasswordRequest request);

    void sendForgotConfirmation (String email);

    void resetForgotPassword (String email, String newPassword);

    void logout (HttpServletRequest request, HttpServletResponse response);
}