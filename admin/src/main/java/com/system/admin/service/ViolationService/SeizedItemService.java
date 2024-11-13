package com.system.admin.service.ViolationService;

import com.system.admin.exception.UserNotFoundException;
import com.system.admin.model.SeizedItem;
import com.system.admin.model.ViolationRecord.ViolationShip;
import com.system.admin.repository.violation.SeizedItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
    public SeizedItem getSeizedItem(Long id){
        return seizedItemRepo.findById(id).orElseThrow(()->new UserNotFoundException("Không tìm thấy tang vật id là " + id));
    }
    public SeizedItem updateSeizedItem(Long id, SeizedItem seizedItem) {
        // Fetch the existing person
        SeizedItem existSeizedItem = getSeizedItem(id);
        // Check nếu số căn cước đã tồn tại

        // Update details if unique constraint is satisfied
        existSeizedItem.setItemName(seizedItem.getItemName());
        existSeizedItem.setQuantity(seizedItem.getQuantity());
        existSeizedItem.setSeizureDate(seizedItem.getSeizureDate());
        existSeizedItem.setQuantity(seizedItem.getQuantity());
        existSeizedItem.setDescription(seizedItem.getDescription());
        existSeizedItem.setStatus(seizedItem.getStatus());
        existSeizedItem.setViolationRecord(seizedItem.getViolationRecord());

        // Save the updated record
        seizedItemRepo.save(existSeizedItem);
        return existSeizedItem;
    }
}
