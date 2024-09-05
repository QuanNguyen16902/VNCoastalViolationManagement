package com.system.admin.service;

import com.system.admin.model.RoleGroup;
import com.system.admin.repository.RoleGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleGroupService {
    @Autowired
    RoleGroupRepository repository;
    public List<RoleGroup> getAll(){
        return repository.findAll();
    }
}
