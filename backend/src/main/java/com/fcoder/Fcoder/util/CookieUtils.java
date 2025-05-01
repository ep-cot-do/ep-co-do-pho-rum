package com.fcoder.Fcoder.util;

import com.fcoder.Fcoder.model.constant.JwtTokenType;
import jakarta.annotation.Nonnull;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Arrays;
import java.util.EnumMap;

public class CookieUtils {
    public static Cookie[] getCookies(@Nonnull HttpServletRequest request) {
        var cookies = request.getCookies();
        if (cookies == null) {
            return new Cookie[0];
        }
        return cookies;
    }
    public static EnumMap<JwtTokenType, Cookie> getCookieMap(@Nonnull HttpServletRequest request) {
        EnumMap<JwtTokenType, Cookie> cookieMap = new EnumMap<>(JwtTokenType.class);
        Arrays.stream(CookieUtils.getCookies(request))
                .filter(cookie -> {
                    try {
                        JwtTokenType.valueOf(cookie.getName().toUpperCase());
                        return true;
                    } catch (IllegalArgumentException e) {
                        return false;
                    }
                })
                .forEach(cookie -> cookieMap.put(JwtTokenType.valueOf(cookie.getName().toUpperCase()), cookie));
        return cookieMap;
    }
}
