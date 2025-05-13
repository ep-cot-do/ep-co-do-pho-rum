package com.fcoder.Fcoder.config;

import com.fcoder.Fcoder.security.ApplicationAuthenticationEntryPoint;
import com.fcoder.Fcoder.security.JwtAuthenticationFilter;
import com.fcoder.Fcoder.security.JwtCookieValidationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtCookieValidationFilter jwtCookieValidationFilter;
    private final CorsConfig corsConfig;
    private final ApplicationAuthenticationEntryPoint applicationAuthenticationEntryPoint;

    @Bean
    SecurityFilterChain authenticationFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
                .authorizeHttpRequests(auth -> {
                    // Public endpoints
                    auth.requestMatchers("/hello/**", "/api-docs/**", "/swagger-ui/**", "/auth/**").permitAll()
                            .requestMatchers(HttpMethod.GET).permitAll()
                            .requestMatchers("/accounts/**").permitAll()
                            .requestMatchers("/roles/**").permitAll()
                            .requestMatchers("/blogs/**").permitAll()
                            .requestMatchers("/achievements/**").permitAll()
                            .requestMatchers("/events/**").permitAll()
                            .requestMatchers("/event-registrations/**").permitAll()
                            .requestMatchers("/event-recaps/**").permitAll()
                            .requestMatchers("/libraries/**").permitAll()
                            .requestMatchers("/faqs/**").permitAll()
                            .requestMatchers("/comments/**").permitAll()
                            .requestMatchers("/games/**").permitAll()
                            .requestMatchers("/payments/**").permitAll()
                            .requestMatchers("/payment/**").permitAll()
                            .anyRequest().authenticated();
                })
                .exceptionHandling(exception -> {
                    exception.authenticationEntryPoint(applicationAuthenticationEntryPoint);
                })
                .sessionManagement(session -> {
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                })
                .addFilterBefore(this.jwtCookieValidationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(this.jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}