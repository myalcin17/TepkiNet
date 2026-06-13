package com.mehmet.tepkinet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;
import java.util.List;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {
    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {
                })
                .csrf(csrf -> csrf.disable())

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"message\": \"Giriş yapmalısınız\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(403);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"message\": \"Bu işlem için yetkiniz yok\"}");
                        }))

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.DELETE, "/companies/**")
                        .hasRole("ADMIN")
                        .requestMatchers(
                                "/auth/register",
                                "/auth/login",
                                "/auth/forgot-password",
                                "/auth/reset-password",
                                "/auth/complaints/latest",
                                "/company-applications")
                        .permitAll()

                        .requestMatchers(HttpMethod.GET,
                                "/companies",
                                "/companies/**",
                                "/complaints",
                                "/complaints/latest",
                                "/complaints/pagination",
                                "/complaints/sorted",
                                "/complaints/search",
                                "/complaints/status/*",
                                "/comments/complaint/*",
                                "/support-messages",
                                "/users")
                        .permitAll()
                        .requestMatchers(new RegexRequestMatcher("^/complaints/\\d+$", "GET")).permitAll()

                        .requestMatchers(
                                "/auth/me",
                                "/auth/logout")
                        .authenticated()

                        .requestMatchers(
                                "/complaints/**",
                                "/comments/**",
                                "/responses/**",
                                "/support-messages/**",
                                "/users/**")
                        .authenticated()

                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        .anyRequest().authenticated())

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
