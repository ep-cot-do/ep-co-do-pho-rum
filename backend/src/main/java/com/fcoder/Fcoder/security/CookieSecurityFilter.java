package com.fcoder.Fcoder.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(1) // Ensure it runs early in the filter chain
public class CookieSecurityFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;

        // Set SameSite=None for cross-domain cookie support
        httpServletResponse.setHeader("Set-Cookie", "SameSite=None; Secure");

        chain.doFilter(request, response);
    }
}