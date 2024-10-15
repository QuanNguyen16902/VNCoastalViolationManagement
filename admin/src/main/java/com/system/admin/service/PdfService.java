package com.system.admin.service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfService {

    public byte[] createPdf() throws DocumentException, IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // Tạo tài liệu PDF
        Document document = new Document();
        PdfWriter.getInstance(document, baos);
        document.open();

        // Tạo nội dung
        document.add(new Paragraph("CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM"));
        document.add(new Paragraph("Độc lập - Tự do - Hạnh phúc"));
        document.add(new Paragraph("QUYẾT ĐỊNH"));
        document.add(new Paragraph("Xử phạt vi phạm hành chính theo thủ tục đơn giản"));
        document.add(new Paragraph(" "));

        // Thêm nội dung điều khoản
        document.add(new Paragraph("Điều 1. Xử phạt vi phạm hành chính theo thủ tục đơn giản đối với:"));
        document.add(new Paragraph("Tên: ...................................."));
        document.add(new Paragraph("Quốc tịch: ...................................."));
        document.add(new Paragraph("CMND/CCCD: ...................................."));

        // Các nội dung khác
        document.add(new Paragraph("Hình thức xử phạt chính: ...................................."));
        document.add(new Paragraph("Biện pháp khắc phục hậu quả: ...................................."));
        document.add(new Paragraph(" "));

        document.add(new Paragraph("Điều 2. Quyết định này có hiệu lực kể từ ngày ký."));
        document.add(new Paragraph(" "));

        // Đóng tài liệu
        document.close();

        return baos.toByteArray();
    }
}
