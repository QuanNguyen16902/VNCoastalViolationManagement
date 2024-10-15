package com.system.admin.controller;

import com.system.admin.model.PenaltyDecision;
import com.system.admin.service.DecisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("${API_URL}")
public class DecisionController {
    @Autowired
    public DecisionService decisionService;

    @GetMapping("/penalty-decision")
    public ResponseEntity<List<PenaltyDecision>> listAll(){
        List<PenaltyDecision> list = decisionService.getAll();
        return ResponseEntity.ok(list);
    }
    @PostMapping("/penalty-decision")
    public ResponseEntity<PenaltyDecision> createNewRecord(@RequestBody PenaltyDecision penaltyDecision){
        try{
            PenaltyDecision newRecord = decisionService.create(penaltyDecision);
            return ResponseEntity.status(HttpStatus.CREATED).body(newRecord);

        }catch (RuntimeException e){
            throw new RuntimeException(e.getMessage());
        }
    }


    @GetMapping("/penalty-decision/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") Long id) {
        try {
            PenaltyDecision penaltyDecision = decisionService.getById(id);
            // Ghi nhật ký
//            logUtils.logAction("GET", "Fetched người dùng theo ID: " + id, user.getUsername());
            return ResponseEntity.ok(penaltyDecision);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/penalty-decision/{id}")
    public ResponseEntity<PenaltyDecision> updateDecision(@PathVariable Long id, @RequestBody PenaltyDecision penaltyDecision) {
        PenaltyDecision updatedDecision = decisionService.updateDecision(id, penaltyDecision);
        return ResponseEntity.ok(updatedDecision);
    }


    @DeleteMapping("/penalty-decision/{id}")
    public ResponseEntity<?> deleteUserGroup(@PathVariable Long id) {
        decisionService.deleteById(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Xóa thành công");
    }

    @PutMapping("/penalty-decision/{id}/paid/{paid}")
    public ResponseEntity<String> updateDecisionPaidStatus(
            @PathVariable("id") Integer id,
            @PathVariable("paid") boolean paid) {

        // Cập nhật trạng thái đã thanh toán
        decisionService.updateDecisionPaidStatus(id, paid);
        // Xác định trạng thái trả về
        String status = paid ? "paid" : "unpaid";
        String message = "Người vi phạm với id " + id + " đã " + status;

        // Trả về phản hồi với mã trạng thái 200 OK
        return ResponseEntity.ok(message);
    }
}
