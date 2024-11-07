package com.system.admin.controller;

import com.system.admin.LogUtils;
import com.system.admin.model.User;
import com.system.admin.model.ViolationRecord.ViolationPerson;
import com.system.admin.service.ViolationPersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("${API_URL}")
public class ViolationPersonController {
    @Autowired
    private ViolationPersonService violationPersonService;
    @Autowired
    private LogUtils logUtils;
    @GetMapping("/violation-person/search")
    public List<ViolationPerson> searchPerson(@RequestParam("keyword") String keyword) {
        List<ViolationPerson> users = violationPersonService.searchViolations(keyword);
        // Ghi nhật ký
        logUtils.logAction("SEARCH", "Tìm kiếm người vi phạm với keyword: " + keyword, null);
        return users;
    }
    @GetMapping("/violation-person")
    public List<ViolationPerson> listPerson() {
        List<ViolationPerson> violationPeople = violationPersonService.listAll();
        // Ghi nhật ký
        return violationPeople;
    }
    @GetMapping("/violation-person/{id}")
    public ResponseEntity<ViolationPerson> getOnePerson(@PathVariable Long id) {
        // Ghi nhật ký
        ViolationPerson violationPerson = violationPersonService.getViolationPerson(id);
        return ResponseEntity.ok(violationPerson);
    }
    @PutMapping("/violation-person/{id}")
    public ResponseEntity<ViolationPerson> updatePerson(@PathVariable Long id, @RequestBody ViolationPerson violationPerson) {
        // Ghi nhật ký
        ViolationPerson updateViolation = violationPersonService.updateViolationPerson(id, violationPerson);
        return ResponseEntity.ok(updateViolation);
    }

}
