package com.system.admin.controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.system.admin.model.PenaltyDecision;
import com.system.admin.model.SettingUpdateRequest;
import com.system.admin.model.ViolationRecord.ViolationPerson;
import com.system.admin.service.DecisionService;
import com.system.admin.service.SettingService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
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
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("${API_URL}")
public class DecisionController {
    @Autowired
    public DecisionService decisionService;

    @Autowired
    public SettingService settingService;

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

    @GetMapping("/penalty-decision/{id}/send-mail")
    public ResponseEntity<String> sendMail(@PathVariable Long id) throws MessagingException, UnsupportedEncodingException {
        PenaltyDecision penaltyDecision = decisionService.getById(id);
        sendDesicionConfirmationEmail(penaltyDecision);
        return ResponseEntity.ok("Gửi mail thành công");
    }
    public static JavaMailSenderImpl prepareMailSender(SettingUpdateRequest settings) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost(settings.getMailHost());
        mailSender.setPort(settings.getMailPort());
        mailSender.setUsername(settings.getMailUsername());
        mailSender.setPassword(settings.getMailPassword());

        Properties mailProperties = new Properties();

        mailProperties.setProperty("mail.smtp.auth", settings.getSmtpAuth());
        mailProperties.setProperty("mail.smtp.starttls.enable", settings.getSmtpStartTls());

        mailSender.setJavaMailProperties(mailProperties);

        return mailSender;
    }
    private void sendDesicionConfirmationEmail(PenaltyDecision penaltyDecision) throws UnsupportedEncodingException, MessagingException {
        SettingUpdateRequest emailSettings = settingService.getCurrentConfig();
        JavaMailSenderImpl mailSender = prepareMailSender(emailSettings);
        mailSender.setDefaultEncoding("utf-8");

        String toAddress = penaltyDecision.getBienBanViPham().getNguoiViPham().getEmail();
        String subject = emailSettings.getMailViolationConfirmSubject();
        String content = emailSettings.getMailViolationConfirmContent();

        subject = subject.replace("[[soQuyetDinh]]", String.valueOf(penaltyDecision.getSoQuyetDinh()));

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(emailSettings.getMailUsername(), emailSettings.getMailUsername());
        helper.setTo(toAddress);
        helper.setSubject(subject);

        SimpleDateFormat dateFormatter = new SimpleDateFormat("HH:mm:ss E, dd/MM/yyyy");
        String penaltyDecisionTime = dateFormatter.format(penaltyDecision.getHieuLucThiHanh());
        String pattern = "###,###,###.##";
        DecimalFormat decimalFormat = new DecimalFormat(pattern);

        // Áp dụng định dạng và nhận giá trị đã được format
        String formattedMucPhat = decimalFormat.format(penaltyDecision.getMucPhat());;

        content = content.replace("[[nguoiViPham]]", penaltyDecision.getBienBanViPham().getNguoiViPham().getNguoiViPham());
        content = content.replace("[[soQuyetDinh]]", penaltyDecision.getSoQuyetDinh());
        content = content.replace("[[soVanBan]]", penaltyDecision.getBienBanViPham().getSoVanBan());
        content = content.replace("[[tenCoQuan]]", penaltyDecision.getTenCoQuan());
        content = content.replace("[[hanhViViPham]]", penaltyDecision.getBienBanViPham().getHanhVi());
        content = content.replace("[[viPhamDieuKhoan]]", penaltyDecision.getBienBanViPham().getViPhamDieuKhoan());
        content = content.replace("[[thoiGianLap]]", dateFormatter.format(penaltyDecision.getThoiGianLap()));
        content = content.replace("[[diaDiem]]", penaltyDecision.getBienBanViPham().getTauViPham().getDiaDiem());
        content = content.replace("[[mucPhat]]",formattedMucPhat);
        content = content.replace("[[hieuLucThiHanh]]",penaltyDecisionTime);
        content = content.replace("[[tenNguoiThiHanh]]", penaltyDecision.getNguoiThiHanh().getProfile().getFullName());
        content = content.replace("[[decisionId]]", String.valueOf(penaltyDecision.getId()));

        helper.setText(content, true);
        mailSender.send(message);
    }

    private BufferedImage generateQRCodeImage(String text) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 200, 200);

            BufferedImage image = new BufferedImage(200, 200, BufferedImage.TYPE_INT_RGB);
            for (int x = 0; x < 200; x++) {
                for (int y = 0; y < 200; y++) {
                    image.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
                }
            }
            return image;
        } catch (WriterException e) {
            throw new RuntimeException("Could not generate QR Code", e);
        }
    }
    @GetMapping("/auth/view-report")
    public void viewReport(@RequestParam Long id, @RequestParam String format, HttpServletResponse response) {
        try {
            // Tạo báo cáo Jasper
            JasperReport jasperReport = JasperCompileManager.compileReport(ResourceUtils.getFile("classpath:quyetDinhXuPhat.jrxml").getAbsolutePath());
//            String pdfLink = "http://192.168.102.13:8080/api/admin/auth/view-report?id=" + id + "&format=" + format;
            String pdfLink = "http://192.168.102.13:8082/api/tutorials";

            // Chuyển QR Code thành Image và lưu vào tham số
            BufferedImage qrCodeImage = generateQRCodeImage(pdfLink); // Create this method

            // Convert BufferedImage to Image for JasperReports
            Image qrCodeJasperImage = qrCodeImage;

//            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
//            ImageIO.write(qrImage, "png", outputStream);


            // Truyền tham số nếu cần thiết, có thể sử dụng ID ở đây
            PenaltyDecision item = decisionService.getById(id);
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("id", id);
            List<PenaltyDecision> singleItemList = Collections.singletonList(item);
            // Tạo nguồn dữ liệu cho báo cáo từ danh sách đối tượng
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(singleItemList);

            parameters.put("qrcode", qrCodeJasperImage);
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
            response.setHeader("Content-Disposition", "inline;  filename=\"report." + format + "\"");

            // Xuất PDF ra response output stream
            JasperExportManager.exportReportToPdfStream(jasperPrint, response.getOutputStream());
            response.getOutputStream().flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }



}
