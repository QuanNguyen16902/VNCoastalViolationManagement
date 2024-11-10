package com.system.admin.controller.ViolationController;

import com.system.admin.LogUtils;
import com.system.admin.model.ViolationRecord.ViolationShip;
import com.system.admin.model.ViolationRecord.ViolationShip;
import com.system.admin.service.ViolationService.ViolationShipService;
import com.system.admin.service.ViolationService.ViolationShipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("${API_URL}")
public class ViolationShipController {
    @Autowired
    private ViolationShipService violationShipService;
    @Autowired
    private LogUtils logUtils;
    @GetMapping("/violation-ship/search")
    public List<ViolationShip> searchPerson(@RequestParam("keyword") String keyword) {
        List<ViolationShip> users = violationShipService.searchViolations(keyword);
        // Ghi nhật ký
        logUtils.logAction("SEARCH", "Tìm kiếm tàu vi phạm với keyword: " + keyword, null);
        return users;
    }
    @GetMapping("/violation-ship")
    public List<ViolationShip> listPerson() {
        List<ViolationShip> violationPeople = violationShipService.listAll();
        // Ghi nhật ký
        return violationPeople;
    }
    @GetMapping("/violation-ship/{id}")
    public ResponseEntity<ViolationShip> getOnePerson(@PathVariable Long id) {
        // Ghi nhật ký
        ViolationShip violationPerson = violationShipService.getViolationShip(id);
        return ResponseEntity.ok(violationPerson);
    }
    @PutMapping("/violation-ship/{id}")
    public ResponseEntity<ViolationShip> updatePerson(@PathVariable Long id, @RequestBody ViolationShip violationPerson) {
        // Ghi nhật ký
        ViolationShip updateViolation = violationShipService.updateViolationShip(id, violationPerson);
        return ResponseEntity.ok(updateViolation);
    }

}
