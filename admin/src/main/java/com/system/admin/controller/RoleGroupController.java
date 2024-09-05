package com.system.admin.controller;

import com.system.admin.model.RoleGroup;
import com.system.admin.service.RoleGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/admin")
public class RoleGroupController {
    @Autowired
    public RoleGroupService service;

    @GetMapping("/roles-group")
    public ResponseEntity<?> getAll(){
        List<RoleGroup> groupList = service.getAll();
        return ResponseEntity.ok(groupList);
    }
}
