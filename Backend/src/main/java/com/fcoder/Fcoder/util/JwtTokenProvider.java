package com.fcoder.Fcoder.util;

import com.fcoder.Fcoder.config.JwtTokenConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    private final JwtTokenConfig jwtTokenConfig;

    // Create a secure key from the secret
    private Key getSigningKey(String secret) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate Access Token
    public String generateAccessToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("roles", userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                        .collect(Collectors.toList()))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtTokenConfig.getJwtExpiration()))
                .signWith(getSigningKey(jwtTokenConfig.getJwtSecret()), SignatureAlgorithm.HS512)
                .compact();
    }

    // Generate Refresh Token
    public String generateRefreshToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtTokenConfig.getJwtRefreshExpiration()))
                .signWith(getSigningKey(jwtTokenConfig.getJwtRefreshSecret()), SignatureAlgorithm.HS512)
                .compact();
    }

    // Get username from token
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey(jwtTokenConfig.getJwtSecret()))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey(jwtTokenConfig.getJwtSecret()))
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    private boolean isTokenExpired(String token) {
        return getClaimFromToken(token, Claims::getExpiration).before(new Date());
    }

    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey(jwtTokenConfig.getJwtSecret()))
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claimsResolver.apply(claims);
    }

    public List<String> getRolesFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey(jwtTokenConfig.getJwtSecret()))
                .build()
                .parseClaimsJws(token)
                .getBody();

        @SuppressWarnings("unchecked")
        List<String> roles = claims.get("roles", List.class);
        return roles;
    }
}