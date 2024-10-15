package com.system.admin.controller;

import com.system.admin.model.User;
import com.system.admin.model.UserGroup;
import com.system.admin.model.ViolationRecord.ViolationRecord;
import com.system.admin.payload.request.UserGroupRequest;
import com.system.admin.service.ViolationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("${API_URL}")
public class ViolationController {
    @Autowired
    public ViolationService violationService;

    @GetMapping("/violation-records")
    public ResponseEntity<List<ViolationRecord>> listAll(){
        List<ViolationRecord> list = violationService.getAll();
        return ResponseEntity.ok(list);
    }
    @PostMapping("/violation-records")
    public ResponseEntity<ViolationRecord> createNewRecord(@RequestBody ViolationRecord violationRecord){
        try{
            ViolationRecord newRecord = violationService.create(violationRecord);
            return ResponseEntity.status(HttpStatus.CREATED).body(newRecord);

        }catch (RuntimeException e){
            throw new RuntimeException(e.getMessage());
        }
    }


    @GetMapping("/violation-records/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") Long id) {
        try {
            ViolationRecord violationRecord = violationService.getById(id);
            // Ghi nhật ký
//            logUtils.logAction("GET", "Fetched người dùng theo ID: " + id, user.getUsername());
            return ResponseEntity.ok(violationRecord);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/violation-records/{id}")
    public ResponseEntity<ViolationRecord> updateUserGroup(@PathVariable Long id, @RequestBody ViolationRecord violationRecord) {
        ViolationRecord updatedViolation = violationService.updateViolation(id, violationRecord);
        return ResponseEntity.ok(updatedViolation);
    }


    @DeleteMapping("/violation-records/{id}")
    public ResponseEntity<?> deleteUserGroup(@PathVariable Long id) {
        violationService.deleteById(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Xóa thành công");
    }

    @PutMapping("/violation-records/{id}/resolved/{resolved}")
    public ResponseEntity<?> updateViolationResolvedStatus(
            @PathVariable("id") long id,
            @PathVariable("resolved") boolean resolved) {

        // Cập nhật trạng thái đã thanh toán
        violationService.updateViolationResolvedStatus(id, resolved);
        // Xác định trạng thái trả về
        String status = resolved ? "resolved" : "unresolved";
        String message = "Biên bản với id " + id + " đã " + status;

        // Trả về phản hồi với mã trạng thái 200 OK
        return ResponseEntity.ok(status);
    }
}
