package com.system.admin.controller.ViolationController;

import com.system.admin.model.SeizedItem;
import com.system.admin.model.ViolationRecord.ViolationPerson;
import com.system.admin.model.ViolationRecord.ViolationRecord;
import com.system.admin.service.ViolationService.ViolationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "*")
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
    @GetMapping("/violation-records/pageable")
    public Page<ViolationRecord> getItems(
            @RequestParam(defaultValue = "0") int page,    // Trang bắt đầu từ 0
            @RequestParam(defaultValue = "5") int size    // Mặc định 5 bản ghi mỗi trang
    ) {
        return violationService.getItems(page, size);
    }
    @GetMapping("/violation-records/search")
    public Page<ViolationRecord> searchViolations(
            @RequestParam(required = false) String maBienBan,
            @RequestParam(required = false) String soVanBan,
            @RequestParam(required = false) String tenCoQuan,
            @RequestParam(required = false) String nguoiViPham,
            @RequestParam(required = false) String nguoiLap,
            @RequestParam(required = false) String nguoiThietHai,
            @RequestParam(required = false) String nguoiChungKien,
            @RequestParam(required = false) Boolean resolved,
            @RequestParam(required = false) String linhVuc,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return violationService.searchViolations(
                maBienBan, soVanBan, tenCoQuan, nguoiViPham, nguoiLap,
                nguoiThietHai, nguoiChungKien, resolved, linhVuc,
                startDate, endDate, PageRequest.of(page, size));
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
        String status = resolved ? "đã giải quyết" : "chưa giải quyết";
        String message = "Biên bản với id " + id + " " + status;

        // Trả về phản hồi với mã trạng thái 200 OK
        return ResponseEntity.ok(message);
    }
    @GetMapping("/violation-records/{id}/violation-person")
    public ResponseEntity<ViolationPerson> getPersonByViolationId(@PathVariable Long id) {
        ViolationPerson nguoiViPham = violationService.getPersonByViolationId(id);
        return ResponseEntity.ok(nguoiViPham);
    }

    @GetMapping("/violation-records/{id}/seized-items")
    public ResponseEntity<List<SeizedItem>> getSeizedItemsByViolationId(@PathVariable Long id){
        List<SeizedItem> seizedItems = violationService.getSeizedItemByViolationId(id);
        return ResponseEntity.ok(seizedItems);
    }

//    @GetMapping("/violations/generate-templates")
//    public ResponseEntity<byte[]> generateReport() throws Exception {
//        try {
//            // Chuẩn bị dữ liệu mẫu (replace with actual data fetching logic)
//            ViolationRecord reportData = new ViolationRecord(); // Fetch or populate data as needed
//
//            // Call the service to generate the report
//            byte[] report = violationService.generateTemplate(reportData);
//
//            // Create HTTP headers to return the PDF file
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_PDF);
//            headers.setContentDispositionFormData("attachment", "violation_report.pdf");
//
//            // Return the PDF file in the response
//            return ResponseEntity.ok()
//                    .headers(headers)
//                    .body(report);
//        } catch (Exception e) {
//            // Log the error and return an internal server error response
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(null);
//        }
//    }

}

