package com.system.admin.service.ViolationService;

import com.system.admin.model.SeizedItem;
import com.system.admin.repository.violation.SeizedItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeizedItemService {
    @Autowired
    private SeizedItemRepo seizedItemRepo;
    public List<SeizedItem> searchViolations(String keyword) {
        return seizedItemRepo.searchSeizedItems(keyword);
    }
    public List<SeizedItem> listAll(){
        return seizedItemRepo.findAll();
    }
}
