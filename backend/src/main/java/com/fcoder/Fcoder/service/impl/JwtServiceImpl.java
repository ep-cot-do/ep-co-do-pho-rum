package com.fcoder.Fcoder.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fcoder.Fcoder.config.JwtTokenConfig;
import com.fcoder.Fcoder.model.constant.JwtTokenType;
import com.fcoder.Fcoder.model.other.UserClaims;
import com.fcoder.Fcoder.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.sql.Date;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {
    private final JwtTokenConfig jwtTokenConfig;
    public String generateToken(Authentication authentication, JwtTokenType tokenType) {
        UserDetails user = (UserDetails) authentication.getPrincipal();
        var roles = user.getAuthorities().toArray(new GrantedAuthority[0]);
        return generateToken(user.getUsername(), Arrays.stream(roles).map(GrantedAuthority::getAuthority).toList(),tokenType);
    }

    public Claims generateClaims (UserClaims claimInfo) {
        Claims claims = Jwts.claims();
        claims.put("user", claimInfo);
        return claims;
    }
    public String generateToken(String username, List<String> role, JwtTokenType tokenType) {
        Date currentDate = new Date(System.currentTimeMillis());
        Date expiryDate = null;
        if(tokenType == JwtTokenType.ACCESS_TOKEN) {
            expiryDate = new Date(currentDate.getTime() + jwtTokenConfig.getJwtExpiration());
        }else if (tokenType == JwtTokenType.REFRESH_TOKEN) {
            expiryDate = new Date(currentDate.getTime() + jwtTokenConfig.getJwtRefreshExpiration());
        }
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(currentDate)
                .setClaims(generateClaims(UserClaims.builder()
                        .username(username)
                        .roles(role)
                        .tokenType(tokenType)
                        .build()))
                .setExpiration(expiryDate)
                .signWith(getSigningKey(tokenType))
                .compact();
    }

    public String generateToken(UserClaims userClaims) {
        return generateToken(userClaims.getUsername(),userClaims.getRoles(),userClaims.getTokenType());
    }
    private SecretKey getSigningKey(JwtTokenType tokenType) {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(tokenType == JwtTokenType.ACCESS_TOKEN ? jwtTokenConfig.getJwtSecret() : jwtTokenConfig.getJwtRefreshSecret()));
    }
    public Optional<UserClaims> getUserClaimsFromJwt(String token, JwtTokenType tokenType) {
        try {
            var claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey(tokenType))
                    .build()
                    .parseClaimsJws(token).getBody();
            ObjectMapper objectMapper = new ObjectMapper();
            String userJson = objectMapper.writeValueAsString(claims.get("user"));
            return Optional.of(objectMapper.readValue(userJson, UserClaims.class));
        } catch (Exception ex) {
            return Optional.empty();
        }
    }

    public Optional<UserClaims> getUserClaimsFromJwt(EnumMap<JwtTokenType, Cookie> cookieEnumMap) {
        return cookieEnumMap.entrySet().stream()
                .map(entry -> getUserClaimsFromJwt(entry.getValue().getValue(), entry.getKey()))
                .filter(Optional::isPresent)
                .findFirst()
                .orElse(Optional.empty());
    }

    public Cookie tokenCookieWarp (String token, JwtTokenType tokenType) {
        var cookie = new Cookie(tokenType.toString(), token);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge((int) (tokenType == JwtTokenType.ACCESS_TOKEN ? jwtTokenConfig.getJwtExpiration() : jwtTokenConfig.getJwtRefreshExpiration()));
        return cookie;
    }
    public void removeAuthToken (HttpServletRequest request,HttpServletResponse response) {
        var authCookie = Arrays.stream(request.getCookies()).filter(cookie -> cookie.getName().equals(JwtTokenType.ACCESS_TOKEN.toString()) || cookie.getName().equals(JwtTokenType.REFRESH_TOKEN.name()) ).toList();
        authCookie.forEach(cookie -> {
            cookie.setMaxAge(0);
            cookie.setPath("/");
            cookie.setValue("");
            response.addCookie(cookie);
        });
    }

    @Override
    public void removeAuthToken(Cookie cookie, HttpServletResponse response) {
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setValue("");
        response.addCookie(cookie);
    }

    @Override
    public boolean isTokenValid(String token, JwtTokenType tokenType) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey(tokenType))
                    .build()
                    .parseClaimsJws(token);
        } catch (Exception ex) {
            return true;
        }
        return false;
    }
}
