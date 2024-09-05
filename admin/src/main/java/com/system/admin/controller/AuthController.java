package com.system.admin.controller;

import com.system.admin.exception.TokenRefreshException;
import com.system.admin.model.SystemLog;
import com.system.admin.model.token.PasswordResetToken;
import com.system.admin.model.token.RefreshToken;
import com.system.admin.model.Role;
import com.system.admin.model.User;
import com.system.admin.payload.request.*;
import com.system.admin.payload.response.JwtResponse;
import com.system.admin.payload.response.MessageResponse;
import com.system.admin.payload.response.TokenRefreshResponse;
import com.system.admin.repository.PasswordResetTokenRepository;
import com.system.admin.repository.RoleRepository;
import com.system.admin.repository.UserRepository;
import com.system.admin.security.auth_service.EmailService;
import com.system.admin.security.auth_service.RefreshTokenService;
import com.system.admin.security.auth_service.UserDetailsImpl;
import com.system.admin.security.jwt.JwtUtils;
import com.system.admin.service.SystemLogService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.*;
import java.util.stream.Collectors;
import java.io.UnsupportedEncodingException;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    RefreshTokenService refreshTokenService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private SystemLogService logService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Thực hiện xác thực với authenticationManager
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            if (!userDetails.isEnabled()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tài khoản của bạn chưa được kích hoạt.");
            }

            // Tạo JWT token
            String jwt = jwtUtils.generateJwtToken(userDetails);
            List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            RefreshToken refreshToken;
            try {
                refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
            } catch (DataIntegrityViolationException e) {
                refreshTokenService.deleteByUserId(userDetails.getId());
                refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
            }
            // Ghi nhật ký khi người dùng đăng nhập
            SystemLog log = new SystemLog();
            log.setUserId(((UserDetailsImpl) authentication.getPrincipal()).getId());
            log.setAction("Người dùng đã đăng nhập");
            log.setDetails("User " + ((UserDetailsImpl) authentication.getPrincipal()).getUsername() + " đã đăng nhập.");
            logService.save(log);
            // Trả về thông tin JWT và refresh token
            return ResponseEntity.ok(new JwtResponse(jwt, refreshToken.getToken(), userDetails.getId(),
                    userDetails.getUsername(), userDetails.getEmail(), roles));
        } catch (BadCredentialsException e) {
            // Lỗi khi thông tin đăng nhập không chính xác
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tên đăng nhập hoặc mật khẩu không đúng");
        } catch (DisabledException e) {
            // Lỗi khi tài khoản bị vô hiệu hóa
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tài khoản của bạn chưa được kích hoạt.");
        } catch (DataIntegrityViolationException e) {
            // Lỗi khi tạo refresh token
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi tạo refresh token");
        } catch (Exception e) {
            // Lỗi không mong muốn khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi không mong muốn xảy ra");
        }
    }





    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: Tên người dùng đã tồn tại"));
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: Email đã tồn tại"));
        }

        User user = new User(registerRequest.getUsername(), registerRequest.getEmail(), encoder.encode(registerRequest.getPassword()), true);

        Set<String> strRoles = registerRequest.getRoles();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null || strRoles.isEmpty()) {
            Role defaultRole = roleRepository.findByName("User")
                    .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy vai trò người dùng."));
            roles.add(defaultRole);
        } else {
            strRoles.forEach(role -> {
                Role foundRole;
                switch (role) {
                    case "admin":
                        foundRole = roleRepository.findByName("Admin")
                                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy vai trò admin."));
                        break;
                    default:
                        foundRole = roleRepository.findByName("User")
                                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy vai trò người dùng."));
                }
                roles.add(foundRole);
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Đăng ký thành công"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Người dùng không hợp lệ."));
//    }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Người dùng không hợp lệ."));
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = userDetails.getId();
        refreshTokenService.deleteByUserId(userId);
        // Ghi nhật ký khi người dùng đăng nhập
        SystemLog log = new SystemLog();
        log.setUserId(((UserDetailsImpl) authentication.getPrincipal()).getId());
        log.setAction("Người dùng đã đăng xuất");
        log.setDetails("User " + ((UserDetailsImpl) authentication.getPrincipal()).getUsername() + " đã đăng xuất.");
        logService.save(log);
        return ResponseEntity.ok().body(new MessageResponse("Đăng xuất thành công!"));
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request){
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtUtils.generateTokenFromUsername(user.getUsername());
                    return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
                }).orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                        "Refresh token không có trong CSDL"));
    }

    @GetMapping("/currentUser")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null) {
            // Người dùng đã đăng nhập
            return ResponseEntity.ok().body(userDetails);
        } else {
            // Người dùng chưa đăng nhập
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Người dùng chưa đăng nhập");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail().trim();

        // Tìm người dùng dựa trên email
        Optional<User> userOptional = userRepository.findByEmail(email);

        // Nếu email không tồn tại trong hệ thống
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body("Email không tồn tại");
        }

        // Tạo mã token reset mật khẩu
        String token = UUID.randomUUID().toString();
        String verificationCode = emailService.generateVerificationCode();
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setToken(token);
        passwordResetToken.setEmail(email);
        passwordResetToken.setVerificationCode(verificationCode);
        passwordResetToken.setExpiryDate(new Date(System.currentTimeMillis() + 3600 * 1000)); // Token hết hạn sau 1 giờ

        // Lưu token vào cơ sở dữ liệu
        tokenRepository.save(passwordResetToken);

        // Tạo liên kết đặt lại mật khẩu
        String resetUrl = "http://localhost:3000/reset-password?token=" + token;

        // Gửi email với liên kết reset mật khẩu
        String content = "<p>Xin chào,</p>" +
                "<p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn.</p>" +
                "<p>Vui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu:</p>" +
                "<p>Mã xác nhận của bạn là: <strong>" + verificationCode + "</strong></p>" +
                "<p><a href=\"" + resetUrl + "\">Đặt lại mật khẩu</a></p>" +
                "<br>" +
                "<p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>";
        try {
            emailService.sendEmail(email, "[Admin] Reset Password", content);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok("Email đặt lại mật khẩu đã được gửi!");
    }


    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        // Tìm kiếm token theo mã token trong yêu cầu
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(request.getToken());

        if (!tokenOptional.isPresent()) {
            return ResponseEntity.badRequest().body("Token không hợp lệ.");
        }

        PasswordResetToken token = tokenOptional.get();

        // Kiểm tra xem token có hết hạn không
        if (token.getExpiryDate().before(Calendar.getInstance().getTime())) {
            return ResponseEntity.badRequest().body("Token đã hết hạn.");
        }

        // Tìm kiếm người dùng theo email liên kết với token
        Optional<User> userOptional = userRepository.findByEmail(token.getEmail());
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body("Email không tồn tại.");
        }

        // Kiểm tra mã xác nhận
        if (!request.getVerificationCode().equals(token.getVerificationCode())) {
            return ResponseEntity.badRequest().body("Mã xác nhận không đúng.");
        }

        User user = userOptional.get();

        // Mã hóa mật khẩu mới và lưu vào cơ sở dữ liệu
        String encodedPassword = encoder.encode(request.getNewPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);

        // Xóa token sau khi sử dụng
        tokenRepository.delete(token);

        return ResponseEntity.ok("Mật khẩu đã được đặt lại thành công.");
    }



//    private void sendOrderConfirmationEmail(HttpServletRequest request, Order order) throws UnsupportedEncodingException, MessagingException {
//        EmailSettingBag emailSettings = settingService.getEmailSettings();
//        JavaMailSenderImpl mailSender = Utility.prepareMailSender(emailSettings);
//        mailSender.setDefaultEncoding("utf-8");
//
//        String toAddress = order.getCustomer().getEmail();
//        String subject = emailSettings.getOrderConfirmationSubject();
//        String content = emailSettings.getOrderConfirmationContent();
//
//        subject = subject.replace("[[orderId]]", String.valueOf(order.getId()));
//
//        MimeMessage message = mailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(message);
//
//        helper.setFrom(emailSettings.getFromAddress(), emailSettings.getSenderName());
//        helper.setTo(toAddress);
//        helper.setSubject(subject);
//
//        SimpleDateFormat dateFormatter = new SimpleDateFormat("HH:mm:ss E, dd MM yyyy");
//        String orderTime = dateFormatter.format(order.getOrderTime());
//
//        CurrencySettingBag currencySettings = settingService.getCurrencySettings();
//        String totalAmount = Utility.formatCurrency(order.getTotal(), currencySettings);
//
//        content = content.replace("[[name]]", order.getCustomer().getFullName());
//        content = content.replace("[[orderId]]", String.valueOf(order.getId()));
//        content = content.replace("[[orderTime]]", orderTime);
//        content = content.replace("[[shippingAddress]]", order.getShippingAddress());
//        content = content.replace("[[total]]", totalAmount);
//        content = content.replace("[[paymentMethod]]", order.getPaymentMethod().toString());
//
//        helper.setText(content, true);
//        mailSender.send(message);
//    }



}
