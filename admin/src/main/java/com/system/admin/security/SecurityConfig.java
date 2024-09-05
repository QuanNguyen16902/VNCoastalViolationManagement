//package com.system.admin.security;
//
//import com.system.admin.exception.UserNotFoundException;
//import com.system.admin.model.User;
//import com.system.admin.repository.UserRepository;
//import com.system.admin.security.auth_service.UserDetailsServiceImpl;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.core.userdetails.UserDetailsService;
//
//@Configuration
//@RequiredArgsConstructor
//public class SecurityConfig {
//
//    private final UserRepository userRepository;
//
//    @Bean
//    public UserDetailsService userDetailsService(){
//        return email -> {
//            User existingUser = userRepository.findByEmail(email)
//                    .orElseThrow(() ->
//                            new UserNotFoundException("Không thể tìm thấy user với email là " + email)
//                                );
//            return existingUser;
//        }
//    }
//}
