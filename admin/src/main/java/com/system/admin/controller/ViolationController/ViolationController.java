package com.system.admin.controller.ViolationController;

import com.system.admin.model.PenaltyDecision;
import com.system.admin.model.SeizedItem;
import com.system.admin.model.ViolationRecord.ViolationPerson;
import com.system.admin.model.ViolationRecord.ViolationRecord;
import com.system.admin.service.ViolationService.ViolationService;
import jakarta.servlet.http.HttpServletResponse;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.*;
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
    @GetMapping("/auth/violations/view-report")
    public void viewReport(@RequestParam Long id, @RequestParam String format, HttpServletResponse response) {
        try {
            // Tạo báo cáo Jasper
            JasperReport jasperReport = JasperCompileManager.compileReport(ResourceUtils.getFile("classpath:bienBanViPham.jrxml").getAbsolutePath());
            // Truyền tham số nếu cần thiết, có thể sử dụng ID ở đây
            ViolationRecord item = violationService.getById(id);
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("id", id);
            List<ViolationRecord> singleItemList = Collections.singletonList(item);
            // Tạo nguồn dữ liệu cho báo cáo từ danh sách đối tượng
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(singleItemList);

            parameters.put("tenNguoiViPham", item.getNguoiViPham().getNguoiViPham());
            parameters.put("ngheNghiep", item.getNguoiViPham().getNgheNghiep());
            parameters.put("namSinh", item.getNguoiViPham().getNamSinh());
            parameters.put("diaChi", item.getNguoiViPham().getDiaChi());
            parameters.put("CMND", item.getNguoiViPham().getCanCuoc());
            parameters.put("ngayCap", item.getNguoiViPham().getNgayCap());
            parameters.put("noiCap", item.getNguoiViPham().getNoiCap());
            parameters.put("hanhVi", item.getHanhVi());
            parameters.put("quocTich", item.getNguoiViPham().getQuocTich());
//        parameters.put("tenCoQuan", item.getTenCoQuan());
//        parameters.put("soVanBan", item.getSoVanBan());
//        parameters.put("thoiGianLap", item.getThoiGianLap());
//        parameters.put("nguoiLap", item.getNguoiLap());
//        parameters.put("nguoiChungKien", item.getNguoiChungKien());
            parameters.put("nguoiThietHai", item.getNguoiThietHai());

            parameters.put("thoiGianViPham", item.getTauViPham().getThoiGianViPham());
            parameters.put("diaDiem", item.getTauViPham().getDiaDiem());
            parameters.put("tongDungTich", item.getTauViPham().getTongDungTich());
            parameters.put("soHieuTau", item.getTauViPham().getSoHieuTau());
            parameters.put("congSuat", item.getTauViPham().getCongSuat());
            parameters.put("haiTrinhCapPhep", item.getTauViPham().getHaiTrinhCapPhep());
            parameters.put("toaDoX", item.getTauViPham().getToaDoX());
            parameters.put("toaDoY", item.getTauViPham().getToaDoY());
            parameters.put("haiTrinhThucTe", item.getTauViPham().getHaiTrinhThucTe());

            parameters.put("viPhamDieuKhoan", item.getViPhamDieuKhoan());
            parameters.put("yKienNguoiViPham", item.getYKienNguoiDaiDien());
            parameters.put("yKienNguoiChungKien", item.getYKienNguoiChungKien());
            parameters.put("yKienNguoiThietHai", item.getYKienNguoiThietHai());
            parameters.put("bienPhapNganChan", item.getBienPhapNganChan());
            parameters.put("tamGiu", item.getTamGiu());
            parameters.put("yeuCau", item.getYeuCau());
            parameters.put("soBan", item.getSoBan());
            parameters.put("thoiGianGiaiQuyet", item.getThoiGianGiaiQuyet());

            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

            // Thiết lập header để mở file PDF trực tiếp
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "inline;  filename=\"report." + format + "\"");

            // Xuất PDF ra response output stream
            JasperExportManager.exportReportToPdfStream(jasperPrint, response.getOutputStream());
            response.getOutputStream().flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}

