package com.system.admin.service.jasper;


import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.system.admin.model.PenaltyDecision;
import com.system.admin.model.ViolationRecord.ViolationPerson;
import com.system.admin.model.ViolationRecord.ViolationRecord;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.HtmlExporter;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.util.JRSaver;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleHtmlExporterOutput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

@Service
public class JasperReportService {

    public byte[] getViolationReport(ViolationRecord item, String format) {

        JasperReport jasperReport;

        try {
            jasperReport = JasperCompileManager.compileReport(ResourceUtils.getFile("classpath:bienBanViPham.jrxml").getAbsolutePath());
        } catch (FileNotFoundException | JRException e) {
            try {
                File file = ResourceUtils.getFile("classpath:bienBanViPham.jrxml");
                jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());
                JRSaver.saveObject(jasperReport, "item-report.jasper");
            } catch (FileNotFoundException | JRException ex) {
                throw new RuntimeException(e);
            }
        }
        List<ViolationRecord> singleItemList = Collections.singletonList(item);
        // Tạo nguồn dữ liệu cho báo cáo từ danh sách đối tượng
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(singleItemList);


        Map<String, Object> parameters = new HashMap<>();
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

        JasperPrint jasperPrint = null;
        byte[] reportContent;

        try {
            jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
            switch (format) {
                case "pdf" -> reportContent = JasperExportManager.exportReportToPdf(jasperPrint);
                case "xml" -> reportContent = JasperExportManager.exportReportToXml(jasperPrint).getBytes();
                case "html" -> {
                    ByteArrayOutputStream htmlStream = new ByteArrayOutputStream();
                    HtmlExporter htmlExporter = new HtmlExporter();
                    htmlExporter.setExporterInput(new SimpleExporterInput(jasperPrint));
                    htmlExporter.setExporterOutput(new SimpleHtmlExporterOutput(htmlStream));
                    htmlExporter.exportReport();
                    reportContent = htmlStream.toByteArray();
                }
//
                case "docx" -> {
                    ByteArrayOutputStream docxStream = new ByteArrayOutputStream();
                    JRDocxExporter docxExporter = new JRDocxExporter();
                    docxExporter.setExporterInput(new SimpleExporterInput(jasperPrint));
                    docxExporter.setExporterOutput(new SimpleOutputStreamExporterOutput(docxStream));
                    docxExporter.exportReport();
                    reportContent = docxStream.toByteArray();
                }
//
//                case "csv" -> {
//                    ByteArrayOutputStream csvStream = new ByteArrayOutputStream();
//                    JRCsvExporter csvExporter = new JRCsvExporter();
//                    csvExporter.setExporterInput(new SimpleExporterInput(jasperPrint));
//                    csvExporter.setExporterOutput(new SimpleWriterExporterOutput(csvStream));
//                    csvExporter.exportReport();
//                    reportContent = csvStream.toByteArray();
//                }
                default -> throw new RuntimeException("Unknown report format");
            }
        } catch (JRException e) {
            throw new RuntimeException(e);
        }
        return reportContent;
    }

    public byte[] getDecisionReport(PenaltyDecision item, String format) {

        JasperReport jasperReport;

        try {
            jasperReport = JasperCompileManager.compileReport(ResourceUtils.getFile("classpath:quyetDinhXuPhat.jrxml").getAbsolutePath());
        } catch (FileNotFoundException | JRException e) {
            try {
                File file = ResourceUtils.getFile("classpath:quyetDinhXuPhat.jrxml");
                jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());
                JRSaver.saveObject(jasperReport, "quyetDinhXuPhat.jasper");
            } catch (FileNotFoundException | JRException ex) {
                throw new RuntimeException(e);
            }
        }
//        String pdfLink = "http://localhost:8080/api/admin/auth/view-report?id=" + item.getId() + "&format=" + format;
//        String pdfLink = "http://localhost:8080/api/admin/penalty-decision/" + item.getId();
        String pdfLink = "http://192.168.110.215:3000/report";
        BufferedImage qrCodeImage = generateQRCodeImage(pdfLink); // Create this method

        // Convert BufferedImage to Image for JasperReports
        Image qrCodeJasperImage = qrCodeImage;


        List<PenaltyDecision> singleItemList = Collections.singletonList(item);
        // Tạo nguồn dữ liệu cho báo cáo từ danh sách đối tượng
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(singleItemList);

        ViolationPerson nguoiViPham = item.getBienBanViPham().getNguoiViPham();
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("thoiGianLap", item.getThoiGianLap());
        parameters.put("tenNguoiViPham", nguoiViPham.getNguoiViPham());
        parameters.put("quocTich", nguoiViPham.getQuocTich());
        parameters.put("namSinh", nguoiViPham.getNamSinh());
        parameters.put("diaChi", nguoiViPham.getDiaChi());
        parameters.put("CMND", nguoiViPham.getCanCuoc());
        parameters.put("ngayCap", nguoiViPham.getNgayCap());
        parameters.put("noiCap", nguoiViPham.getNoiCap());
        parameters.put("ngheNghiep", nguoiViPham.getNgheNghiep());

        parameters.put("hanhVi", item.getBienBanViPham().getHanhVi());
        parameters.put("thoiGianLapBienBan", item.getBienBanViPham().getThoiGianLap());
        parameters.put("nguoiLap", item.getBienBanViPham().getNguoiLap());
        parameters.put("soBienBanViPham", item.getBienBanViPham().getSoVanBan());
        parameters.put("viPhamDieuKhoan", item.getBienBanViPham().getViPhamDieuKhoan());


        parameters.put("thanhPho", item.getThanhPho());
        parameters.put("xuPhatChinh", item.getXuPhatChinh());
        parameters.put("xuPhatBoSung", item.getXuPhatBoSung());
        parameters.put("mucPhat", item.getMucPhat());
        parameters.put("bienPhapKhacPhuc", item.getBienPhapKhacPhuc());
        parameters.put("hieuLucThiHanh", item.getHieuLucThiHanh());
        parameters.put("diaChiKhoBac", item.getDiaChiKhoBac());
        parameters.put("tenNguoiThiHanh", item.getNguoiThiHanh().getProfile().getFullName());
        parameters.put("capBac", item.getNguoiThiHanh().getProfile().getRank());
        parameters.put("chucVu", item.getNguoiThiHanh().getProfile().getPosition());
        parameters.put("donVi", item.getNguoiThiHanh().getProfile().getDepartment());
        parameters.put("nghiDinh", item.getNghiDinh());

        parameters.put("qrcode", qrCodeJasperImage);


        JasperPrint jasperPrint = null;
        byte[] reportContent;

        try {
            jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
            switch (format) {
                case "pdf" -> reportContent = JasperExportManager.exportReportToPdf(jasperPrint);
                case "xml" -> reportContent = JasperExportManager.exportReportToXml(jasperPrint).getBytes();
                case "html" -> {
                    ByteArrayOutputStream htmlStream = new ByteArrayOutputStream();
                    HtmlExporter htmlExporter = new HtmlExporter();  // Sử dụng JRHtmlExporter thay vì JRHtmlExporterContext
                    htmlExporter.setExporterInput(new SimpleExporterInput(jasperPrint));
                    htmlExporter.setExporterOutput(new SimpleHtmlExporterOutput(htmlStream));
                    htmlExporter.exportReport();
                    reportContent = htmlStream.toByteArray();
                }
                default -> throw new RuntimeException("Unknown report format");
            }
        } catch (JRException e) {
            throw new RuntimeException(e);
        }
        return reportContent;
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
}