package com.system.admin.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.system.admin.exception.EmailAlreadyExistsException;
import com.system.admin.exception.RoleNotFoundException;
import com.system.admin.exception.UserNotFoundException;
import com.system.admin.exception.UsernameAlreadyExistsException;
import com.system.admin.model.PenaltyDecision;
import com.system.admin.model.Role;
import com.system.admin.model.User;
import com.system.admin.repository.RoleRepository;
import com.system.admin.repository.UserRepository;
import com.system.admin.repository.violation.PenaltyDecisionRepo;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort.Order;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@Transactional
public class UserService {
    public RoleRepository roleRepository;
    public UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private PenaltyDecisionRepo penaltyDecisionRepo;
    @Autowired
    public UserService(RoleRepository roleRepository, UserRepository userRepository){
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    public List<User> getUsersWithoutRoles() {
        return userRepository.getUsersWithoutRoles();
    }

    public boolean existsByUsername(String username){
        return userRepository.existsByUsername(username);
    }
    public boolean existsByEmail(String email){
        return userRepository.existsByEmail(email);
    }
    public List<User> getAll(){
        return userRepository.findAll();
    }

    public List<User> searchUsers(String keyword) {
        return userRepository.searchUsers(keyword);
    }
    @Transactional
    public void assignRolesToUsers(Set<Long> userIds, Set<Long> roleIds) {
        Set<Role> roles = new HashSet<>(roleRepository.findAllById(roleIds));
        List<User> users = userRepository.findAllById(userIds);

        for (User user : users) {
            user.setRoles(roles);
            userRepository.save(user);
        }
    }
    public User save(User user) throws IOException {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyExistsException("Đã tồn tại người dùng với email là " + user.getEmail());
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UsernameAlreadyExistsException("Đã tồn tại người dùng với username là " + user.getUsername());
        }
        if (user.getProfile() != null) {
            user.getProfile().setUser(user);
        }
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }
    public User updateUserPhoto(Long userId, String photoUrl) {
        // Retrieve the user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        // Set the new photo URL
        user.getProfile().setPhoto(photoUrl);

        // Save the updated user without rechecking email and username constraints
        return userRepository.save(user);
    }


    public User updateUser(Long id, User userDetails) throws IOException {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Không có người dùng với id là: " + id));

        // Update basic user details
        existingUser.setUsername(userDetails.getUsername());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setEnabled(userDetails.isEnabled());
        existingUser.setRoles(userDetails.getRoles());

        // Update password if a new password is provided
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(userDetails.getPassword());
            existingUser.setPassword(hashedPassword);
        }

        if (userDetails.getProfile() != null) {
            if (existingUser.getProfile() == null) {
                existingUser.setProfile(userDetails.getProfile());
            } else {
                existingUser.getProfile().setFullName(userDetails.getProfile().getFullName());
                existingUser.getProfile().setDepartment(userDetails.getProfile().getDepartment());
                existingUser.getProfile().setPosition(userDetails.getProfile().getPosition());
                existingUser.getProfile().setRank(userDetails.getProfile().getRank());
            }
            existingUser.getProfile().setUser(existingUser);  // Ensure profile is linked to the user
        }

        return userRepository.save(existingUser);
    }

    private String uploadPhoto(MultipartFile photo) throws IOException {
        // Sử dụng Cloudinary để tải ảnh lên và trả về URL của ảnh
        Map uploadResult = cloudinary.uploader().upload(photo.getBytes(),
                ObjectUtils.asMap("resource_type", "auto"));
        return (String) uploadResult.get("url");
    }

    public User getById(Long id){
        if(!userRepository.existsById(id)){
            throw new UserNotFoundException("Không tồn tại User với id là " + id);
        }
        return userRepository.findById(id).get();
    }

    public void deleteById(Long id){

        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("Không tồn tại User với id là " + id));

        for (PenaltyDecision decision : user.getPenaltyDecisions()) {
            decision.setNguoiThiHanh(null); // Đặt nguoiThiHanh thành null
        }

        // Lưu các thay đổi trên quyết định phạt
        penaltyDecisionRepo.saveAll(user.getPenaltyDecisions());
        userRepository.deleteById(id);
    }
}
