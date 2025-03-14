package com.fcoder.Fcoder.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Getter
@Setter
@ConfigurationProperties(prefix = "oauth2.google")
public class GoogleApisConfig {
    private String clientId;
    private String clientSecret;
    private String redirectUrl;
    private List<String> scopes;
    private String userProfileEndpoint;
}
