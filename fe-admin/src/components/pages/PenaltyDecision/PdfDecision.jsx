import axios from "axios";
import React from "react";
import authHeader from "../../../service/auth-header";

function ExportPdfButton() {
  // Hàm để xuất PDF khi người dùng click
  const downloadPdf = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/pdf/generate",
        {
          responseType: "blob", // Đảm bảo rằng phản hồi là blob để xử lý PDF
          headers: authHeader(), // Chuyển headers vào đúng object
        }
      );

      // Tạo URL từ phản hồi blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "decision.pdf"); // Đặt tên cho file PDF
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Có lỗi khi tải file PDF:", error);
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={downloadPdf}>
        Xuất PDF
      </button>
    </div>
  );
}

export default ExportPdfButton;
