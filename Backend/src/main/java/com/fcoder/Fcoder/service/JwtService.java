package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.constant.JwtTokenType;
import com.fcoder.Fcoder.model.other.UserClaims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

import java.util.EnumMap;
import java.util.List;
import java.util.Optional;

public interface JwtService {
    String generateToken(Authentication authentication, JwtTokenType tokenType);
    String generateToken(UserClaims userClaims);
    String generateToken(String username, List<String> role, JwtTokenType tokenType);
    Optional<UserClaims> getUserClaimsFromJwt(String token, JwtTokenType tokenType);
    Cookie tokenCookieWarp (String token, JwtTokenType tokenType);
    Optional<UserClaims> getUserClaimsFromJwt(EnumMap<JwtTokenType, Cookie> cookieEnumMap);
    void removeAuthToken (HttpServletRequest request, HttpServletResponse response);
    void removeAuthToken (Cookie cookie, HttpServletResponse response);
    boolean isTokenValid(String token, JwtTokenType tokenType);
}
