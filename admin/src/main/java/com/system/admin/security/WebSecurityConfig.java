package com.system.admin.security;

import com.system.admin.security.auth_service.UserDetailsServiceImpl;
import com.system.admin.security.jwt.AuthEntryPointJwt;
import com.system.admin.security.jwt.AuthTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.authentication.configuration.EnableGlobalAuthentication;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


   @Bean
   public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http.csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth ->
                        auth.requestMatchers("/api/admin/auth/**").permitAll()
                                .requestMatchers("/vnpay/**").permitAll()
                                .requestMatchers("/vnpay/return").permitAll()
                                .requestMatchers("/api/admin/users/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/admin/users/{id}").hasAuthority("VIEW_USER")
                                .requestMatchers(HttpMethod.PUT, "/api/admin/users/{id}").hasAuthority("EDIT_USER")
                                .requestMatchers(HttpMethod.DELETE, "/api/admin/users/{id}").hasAuthority("DELETE_USER")
                                .requestMatchers(HttpMethod.POST, "/api/admin/users/{id}").hasAuthority("CREATE_USER")

                                .requestMatchers(HttpMethod.GET, "/api/admin/roles").hasAuthority("VIEW_ROLE")
                                .requestMatchers(HttpMethod.PUT, "/api/admin/roles/{id}").hasAuthority("EDIT_ROLE")
                                .requestMatchers(HttpMethod.GET, "/api/admin/roles/{id}").hasAuthority("EDIT_ROLE")
                                .requestMatchers(HttpMethod.POST, "/api/admin/roles").hasAuthority("CREATE_ROLE")
                                .requestMatchers(HttpMethod.DELETE, "/api/admin/roles/{id}").hasAuthority("DELETE_ROLE")

                                .requestMatchers(HttpMethod.GET, "/api/admin/users-group").hasAuthority("VIEW_GROUP")
                                .requestMatchers(HttpMethod.PUT, "/api/admin/users-group/{id}").hasAuthority("EDIT_GROUP")
                                .requestMatchers(HttpMethod.GET, "/api/admin/users-group/{id}").hasAuthority("EDIT_GROUP")
                                .requestMatchers(HttpMethod.POST, "/api/admin/users-group").hasAuthority("CREATE_GROUP")
                                .requestMatchers(HttpMethod.DELETE, "/api/admin/users-group/{id}").hasAuthority("DELETE_GROUP")

                                .anyRequest().authenticated()
                );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
   }
}
