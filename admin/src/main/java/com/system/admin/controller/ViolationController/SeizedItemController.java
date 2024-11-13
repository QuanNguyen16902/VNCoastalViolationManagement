package com.system.admin.controller.ViolationController;

import com.system.admin.LogUtils;
import com.system.admin.model.SeizedItem;
import com.system.admin.service.ViolationService.SeizedItemService;
import com.system.admin.service.ViolationService.SeizedItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("${API_URL}")
public class SeizedItemController {
    @Autowired
    private SeizedItemService seizedItemService;
    @Autowired
    private LogUtils logUtils;
    @GetMapping("/seized-items/search")
    public List<SeizedItem> searchPerson(@RequestParam("keyword") String keyword) {
        List<SeizedItem> seizedItems = seizedItemService.searchViolations(keyword);
        // Ghi nhật ký
        logUtils.logAction("SEARCH", "Tìm kiếm tang vật với keyword: " + keyword, null);
        return seizedItems;
    }
    @GetMapping("/seized-items")
    public List<SeizedItem> listPerson() {
        List<SeizedItem> seizedItems = seizedItemService.listAll();
        // Ghi nhật ký
        return seizedItems;
    }
    @GetMapping("/seized-items/{id}")
    public ResponseEntity<SeizedItem> getOneSeizedItem(@PathVariable Long id) {
        // Ghi nhật ký
        SeizedItem violationPerson = seizedItemService.getSeizedItem(id);
        return ResponseEntity.ok(violationPerson);
    }
    @PutMapping("/seized-items/{id}")
    public ResponseEntity<SeizedItem> updateSeizedItem(@PathVariable Long id, @RequestBody SeizedItem violationPerson) {
        // Ghi nhật ký
        SeizedItem updateSeizedItem = seizedItemService.updateSeizedItem(id, violationPerson);
        return ResponseEntity.ok(updateSeizedItem);
    }

}
