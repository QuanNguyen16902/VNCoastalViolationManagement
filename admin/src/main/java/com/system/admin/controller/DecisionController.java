package com.system.admin.controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.system.admin.model.PenaltyDecision;
import com.system.admin.model.ViolationRecord.ViolationPerson;
import com.system.admin.service.DecisionService;
import jakarta.servlet.http.HttpServletResponse;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.*;

@CrossOrigin(origins = "*")
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
    @GetMapping("/penalty-decision/search")
    public Page<PenaltyDecision> searchViolations(
            @RequestParam(required = false) String maBienBan,
            @RequestParam(required = false) String soQuyetDinh,
            @RequestParam(required = false) String tenCoQuan,
            @RequestParam(required = false) String nguoiViPham,
            @RequestParam(required = false) String nguoiThiHanh,
            @RequestParam(required = false) Double mucPhat,
            @RequestParam(required = false) Boolean paid,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return decisionService.searchDecisions(
                maBienBan,
                soQuyetDinh,
                tenCoQuan,
                nguoiViPham,
                nguoiThiHanh,
                mucPhat,
                paid,
                startDate,
                endDate,
                PageRequest.of(page, size));
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

//    @GetMapping("/auth/generate-qr/{format}/{id}")
//    public ResponseEntity<byte[]> generateQRCode(@PathVariable String format, @PathVariable Long id) {
//        try {
//            // Tạo đường dẫn đến file PDF với tham số
//            String pdfLink = "http://192.168.30.28:8080/api/admin/auth/view-report?id=" + id + "&format=" + format; // Đường dẫn đến API xuất PDF
////            String pdfLink = "https://mail.google.com/mail/u/0/#inbox";
//            // Tạo mã QR code
//            QRCodeWriter qrCodeWriter = new QRCodeWriter();
//            BitMatrix bitMatrix = qrCodeWriter.encode(pdfLink, BarcodeFormat.QR_CODE, 200, 200);
//
//            BufferedImage image = new BufferedImage(200, 200, BufferedImage.TYPE_INT_RGB);
//            for (int x = 0; x < 200; x++) {
//                for (int y = 0; y < 200; y++) {
//                    image.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF); // Đen và Trắng
//                }
//            }
//            // Chuyển đổi hình ảnh sang byte array
//            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
//            ImageIO.write(image, "png", outputStream);
//            byte[] qrCodeBytes = outputStream.toByteArray();
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.add("Content-Type", "image/png");
//
//            return new ResponseEntity<>(qrCodeBytes, headers, HttpStatus.OK);
//        } catch (WriterException | IOException e) {
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    @GetMapping("/auth/view-report")
    public void viewReport(@RequestParam Long id, @RequestParam String format, HttpServletResponse response) {
        try {
            // Tạo báo cáo Jasper
            JasperReport jasperReport = JasperCompileManager.compileReport(ResourceUtils.getFile("classpath:quyetDinhXuPhat.jrxml").getAbsolutePath());
            String pdfLink = "http://192.168.102.13:8080/api/admin/auth/view-report?id=" + id + "&format=" + format;

            // Tạo mã QR
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(pdfLink, BarcodeFormat.QR_CODE, 200, 200);

            BufferedImage qrImage = new BufferedImage(200, 200, BufferedImage.TYPE_INT_RGB);
            for (int x = 0; x < 200; x++) {
                for (int y = 0; y < 200; y++) {
                    qrImage.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF); // Màu đen và trắng
                }
            }

            // Chuyển QR Code thành Image và lưu vào tham số
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(qrImage, "png", outputStream);

            // Truyền tham số nếu cần thiết, có thể sử dụng ID ở đây
            PenaltyDecision item = decisionService.getById(id);
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("id", id);
            List<PenaltyDecision> singleItemList = Collections.singletonList(item);
            // Tạo nguồn dữ liệu cho báo cáo từ danh sách đối tượng
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(singleItemList);

            parameters.put("qrcode", new ByteArrayInputStream(outputStream.toByteArray()));
            ViolationPerson nguoiViPham = item.getBienBanViPham().getNguoiViPham();
            parameters.put("thoiGianLap", item.getBienBanViPham().getThoiGianLap());
            parameters.put("tenNguoiViPham", nguoiViPham.getNguoiViPham());
            parameters.put("ngheNghiep", item.getBienBanViPham().getNguoiViPham().getNgheNghiep());
            parameters.put("quocTich", nguoiViPham.getQuocTich());
            parameters.put("namSinh", nguoiViPham.getNamSinh());
            parameters.put("diaChi", nguoiViPham.getDiaChi());
            parameters.put("CMND", nguoiViPham.getCanCuoc());
            parameters.put("ngayCap", nguoiViPham.getNgayCap());
            parameters.put("noiCap", nguoiViPham.getNoiCap());
            parameters.put("hanhVi", item.getBienBanViPham().getHanhVi());

            parameters.put("xuPhatChinh", item.getXuPhatChinh());
            parameters.put("xuPhatBoSung", item.getXuPhatBoSung());
            parameters.put("mucPhat", item.getMucPhat());
            parameters.put("bienPhapKhacPhuc", item.getBienPhapKhacPhuc());
            parameters.put("viPhamDieuKhoan", item.getBienBanViPham().getViPhamDieuKhoan());
            parameters.put("hieuLucThiHanh", item.getHieuLucThiHanh());
            parameters.put("diaChiKhoBac", item.getDiaChiKhoBac());
            parameters.put("tenNguoiThiHanh", item.getNguoiThiHanh().getProfile().getFullName());

            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

            // Thiết lập header để mở file PDF trực tiếp
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "inline; filename=\"report." + format + "\"");

            // Xuất PDF ra response output stream
            JasperExportManager.exportReportToPdfStream(jasperPrint, response.getOutputStream());
            response.getOutputStream().flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }



}
