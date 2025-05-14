package com.fcoder.Fcoder.security;

import com.fcoder.Fcoder.model.constant.JwtTokenType;
import com.fcoder.Fcoder.service.JwtService;
import com.fcoder.Fcoder.service.impl.CustomUserDetailServiceImpl;
import com.fcoder.Fcoder.util.CookieUtils;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.EnumMap;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final CustomUserDetailServiceImpl userDetailService;
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(@Nonnull HttpServletRequest request, @Nonnull HttpServletResponse response, @Nonnull FilterChain filterChain) throws ServletException, IOException {
        // Set SameSite=None for cross-site requests
        response.setHeader("Set-Cookie", "SameSite=None; Secure");

        EnumMap<JwtTokenType, Cookie> cookieMap = CookieUtils.getCookieMap(request);
        var userClaims = jwtService.getUserClaimsFromJwt(cookieMap);
        if (userClaims.isPresent()) {
            var claims = userClaims.get();
            var userDetails = userDetailService.loadUserByUsername(claims.getUsername());
            if (claims.getTokenType() == JwtTokenType.REFRESH_TOKEN) {
                var newAccessToken = jwtService.generateToken(claims.getUsername(), claims.getRoles(), JwtTokenType.ACCESS_TOKEN);
                var newAccessCookie = jwtService.tokenCookieWarp(newAccessToken, JwtTokenType.ACCESS_TOKEN);
                response.addCookie(newAccessCookie);
            }
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
        filterChain.doFilter(request, response);
    }
}