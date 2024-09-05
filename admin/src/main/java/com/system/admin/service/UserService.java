package com.system.admin.service;

import com.system.admin.exception.EmailAlreadyExistsException;
import com.system.admin.exception.RoleNotFoundException;
import com.system.admin.exception.UserNotFoundException;
import com.system.admin.exception.UsernameAlreadyExistsException;
import com.system.admin.model.Role;
import com.system.admin.model.User;
import com.system.admin.repository.RoleRepository;
import com.system.admin.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Transactional
public class UserService {
    public RoleRepository roleRepository;
    public UserRepository userRepository;
    @Autowired
    public UserService(RoleRepository roleRepository, UserRepository userRepository){
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
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
    public User register(User user){
        return userRepository.save(user);
    }
    public User save(User user){
        if(userRepository.existsByEmail(user.getEmail())){
           throw new EmailAlreadyExistsException("Đã tồn tại người dùng với email là " + user.getEmail());
        }
        if(userRepository.existsByUsername(user.getUsername())){
            throw new UsernameAlreadyExistsException("Đã tồn tại người dùng với username là " + user.getUsername());
        }

        Set<Role> roles = new HashSet<>();
        for (String roleNames : user.getRolesName()) {
            Role role = roleRepository.findByName(roleNames)
                    .orElseThrow(() -> new RoleNotFoundException("Không tìm thấy: " + roleNames));
            roles.add(role);
        }
        user.setRoles(roles);
       return userRepository.save(user);
    }
    public User updateUser(Long id, User userDetails) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Không có người dùng với id là: " + id));

        // Update the user's details
        existingUser.setUsername(userDetails.getUsername());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setPassword(userDetails.getPassword());
        existingUser.setEnabled(userDetails.isEnabled());

//         Update roles
        Set<Role> roles = new HashSet<>();
        for (String roleName : userDetails.getRolesName()) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new RoleNotFoundException("Không thấy quyền: " + roleName));
            roles.add(role);
        }
        existingUser.setRoles(roles);

        // Save and return updated user
        return userRepository.save(existingUser);
    }

    public User getById(Long id){
        if(!userRepository.existsById(id)){
            throw new UserNotFoundException("Không tồn tại User với id là " + id);
        }
        return userRepository.findById(id).get();
    }
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    public void deleteById(Long id){
        if(!userRepository.existsById(id)){
            throw new UserNotFoundException("Không tồn tại User với id là " + id);
        }
        userRepository.deleteById(id);
    }
}
