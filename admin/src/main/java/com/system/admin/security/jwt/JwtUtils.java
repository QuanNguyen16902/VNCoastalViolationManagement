package com.system.admin.security.jwt;


import com.system.admin.security.auth_service.UserDetailsImpl;
import com.system.admin.service.SettingService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
    @Autowired
    private SettingService settingService;

//    @Value("${admin.api.jwtSecret}")
//    private String jwtSecret;
//
//    @Value("${admin.api.jwtExpirationMs}")
//    private int jwtExpirationMs;

    public String generateJwtToken(UserDetailsImpl userPrincipal) {
        return generateTokenFromUsername(userPrincipal);
    }
    public String getUsernameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().get("username", String.class);
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(settingService.getJwtSecret()));
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key())
                    .setAllowedClockSkewSeconds(60) // Cho phép chênh lệch 60 giây
                    .build()
                    .parseClaimsJws(authToken);

            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }

    public String generateTokenFromUsername(UserDetailsImpl userPrincipal) {
//        Date expirationDate = new Date(System.currentTimeMillis() + settingService.getJwtExpirationMs());
//        logger.info("JWT expiration date: {}", expirationDate);
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + settingService.getJwtExpirationMs() * 3600000L);
        System.out.println(expiryDate);
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", userPrincipal.getId()); // Assuming getId() method exists
        claims.put("username", userPrincipal.getUsername());
        claims.put("email", userPrincipal.getEmail());
        claims.put("roles", userPrincipal.getRoles());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }
}
