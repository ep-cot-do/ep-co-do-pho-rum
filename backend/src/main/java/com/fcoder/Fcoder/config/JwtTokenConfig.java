package com.fcoder.Fcoder.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class JwtTokenConfig {
    @Value("${access-token.secret-key}")
    private String jwtSecret;

    @Value("${access-token.max-age}")
    private long jwtExpiration;

    @Value("${refresh-token.secret-key}")
    private String jwtRefreshSecret;

    @Value("${refresh-token.max-age}")
    private long jwtRefreshExpiration;
}
