package com.system.admin.service;

import com.system.admin.exception.RoleNotFoundException;
import com.system.admin.model.Role;
import com.system.admin.model.Role;
import com.system.admin.repository.RoleRepository;
import com.system.admin.repository.RoleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {

    @Autowired
    public RoleRepository roleRepository;

    public List<Role> getAll(){
        return roleRepository.findAll();
    }
    public void save(Role role){
        roleRepository.save(role);
    }

    public Optional<Role> findByName(String name){
        return roleRepository.findByName(name);
    }

    public Role getRoleById(Long id){
        if(!roleRepository.existsById(id)){
            throw new RoleNotFoundException("Không tồn tại Role với id " + id);
        }
        return roleRepository.findById(id).orElse(null);
    }
    public List<Role> searchRoles(String keyword) {
        return roleRepository.searchRoles(keyword);
    }
    @Transactional
    public void deleteRole(Long id){
        if(!roleRepository.existsById(id)){
            throw new RoleNotFoundException("Không tồn tại Role với id " + id);
        }
        roleRepository.deleteById(id);
    }

}
