// AccessDenied.js
import React from "react";
import vectorImage from "../../../images/logo.png"; // Thêm hình ảnh vector vào dự án

const AccessDenied = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="text-center p-4"
        style={{
          borderRadius: "15px",
          backgroundColor: "#f8d7da", // Màu sáng cho nền
          border: "3px solid #dc3545", // Đường viền đỏ đậm nổi bật
          maxWidth: "600px", // Tăng chiều rộng của hộp
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Bóng đổ nhẹ
        }}
      >
        <img
          src={vectorImage}
          alt="Access Denied"
          style={{ width: "150px", marginBottom: "20px" }}
        />
        <i
          className="bi bi-shield-exclamation text-danger"
          style={{ fontSize: "60px", marginBottom: "20px" }} // Tăng kích thước icon
        ></i>
        <h4 className="mt-3" style={{ fontSize: "24px", color: "#721c24" }}>
          Truy cập bị hạn chế
        </h4>
        <p style={{ fontSize: "16px", color: "#721c24", fontWeight: "500" }}>
          Bạn không có quyền xem nội dung này. Vui lòng liên hệ quản trị viên để
          được hỗ trợ.
        </p>
      </div>
    </div>
  );
};
export default AccessDenied;
