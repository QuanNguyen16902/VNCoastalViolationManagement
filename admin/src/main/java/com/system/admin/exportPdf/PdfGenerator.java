package com.system.admin.exportPdf;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import java.io.FileOutputStream;
import java.io.IOException;

public class PdfGenerator {

    public static void main(String[] args) {
        try {
            createPdf("decision.pdf");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void createPdf(String pdfFilePath) throws DocumentException, IOException {
        // Khởi tạo tài liệu PDF
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, new FileOutputStream(pdfFilePath));

        // Mở tài liệu
        document.open();

        // Font cho văn bản
        Font fontTitle = new Font(Font.HELVETICA, 16, Font.BOLD);
        Font fontNormal = new Font(Font.HELVETICA, 12, Font.NORMAL);

        // Thêm tiêu đề
        Paragraph title = new Paragraph("QUYẾT ĐỊNH\nXử phạt vi phạm hành chính theo thủ tục đơn giản", fontTitle);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph("\n"));

        // Thêm nội dung chính
        document.add(new Paragraph("Căn cứ Pháp lệnh Xử lý vi phạm hành chính ngày 02 tháng 7 năm 2002 và Pháp lệnh sửa đổi, bổ sung một số điều Pháp lệnh Xử lý vi phạm hành chính ngày 02 tháng 4 năm 2008;", fontNormal));
        document.add(new Paragraph("Căn cứ(3);", fontNormal));
        document.add(new Paragraph("Xét hành vi vi phạm hành chính do: (4) thực hiện;", fontNormal));

        document.add(new Paragraph("\n"));

        // Thêm bảng thông tin
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);
        table.setSpacingAfter(10f);

        // Thêm các cột
        addTableCell(table, "Ông (Bà)/tổ chức:", fontNormal);
        addTableCell(table, "……………………………", fontNormal);
        addTableCell(table, "Quốc tịch:", fontNormal);
        addTableCell(table, "……………………………", fontNormal);
        addTableCell(table, "Nghề nghiệp/lĩnh vực hoạt động:", fontNormal);
        addTableCell(table, "……………………………", fontNormal);
        addTableCell(table, "Địa chỉ:", fontNormal);
        addTableCell(table, "……………………………", fontNormal);
        addTableCell(table, "Giấy CMND hoặc hộ chiếu:", fontNormal);
        addTableCell(table, "……………………………", fontNormal);
        addTableCell(table, "Cấp ngày:", fontNormal);
        addTableCell(table, "……………………………", fontNormal);

        // Thêm bảng vào tài liệu
        document.add(table);

        // Các đoạn tiếp theo
        document.add(new Paragraph("Hình thức xử phạt chính: ………………… Mức phạt: ……………………", fontNormal));
        document.add(new Paragraph("Biện pháp khắc phục hậu quả:", fontNormal));
        document.add(new Paragraph("Lý do: Đã có hành vi vi phạm hành chính … quy định tại …", fontNormal));

        document.add(new Paragraph("\n"));

        // Thêm phần người ra quyết định
        document.add(new Paragraph("NGƯỜI RA QUYẾT ĐỊNH", fontNormal));
        document.add(new Paragraph("(Ký tên, ghi rõ cấp bậc, họ tên)", fontNormal));

        // Đóng tài liệu
        document.close();
    }

    // Hàm để thêm ô vào bảng
    private static void addTableCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(PdfPCell.NO_BORDER);
        table.addCell(cell);
    }
}
