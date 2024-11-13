// PenaltyDecisionDisplay.js
import React, { useEffect, useState } from "react";
import decisionService from "../../../service/decision.service";

const PenaltyDecisionDisplay = ({ qrCodeUrl }) => {
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Extract the id from the QR code URL
    const urlParams = new URLSearchParams(new URL(qrCodeUrl).search);
    const id = urlParams.get("id");

    if (id) {
      const response = decisionService.getDecision(id);
      setDecision(response.data);
      setLoading(false);
    } else {
      setError("Mã QR không hợp lệ.");
      setLoading(false);
    }
  }, [qrCodeUrl]);

  if (loading) return <p>Đang tải thông tin QĐXP...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h2>Thông Tin Quyết Định Xử Phạt</h2>
      {decision ? (
        <div>
          <p>
            <strong>Mã Quyết Định:</strong> {decision.id}
          </p>
          <p>
            <strong>Tên Người Vi Phạm:</strong> {decision.tenNguoiViPham}
          </p>
          <p>
            <strong>Nghề Nghiệp:</strong> {decision.ngheNghiep}
          </p>
          <p>
            <strong>Quốc Tịch:</strong> {decision.quocTich}
          </p>
          <p>
            <strong>Năm Sinh:</strong> {decision.namSinh}
          </p>
          <p>
            <strong>Địa Chỉ:</strong> {decision.diaChi}
          </p>
          <p>
            <strong>Số CMND:</strong> {decision.CMND}
          </p>
          <p>
            <strong>Ngày Cấp:</strong> {decision.ngayCap}
          </p>
          <p>
            <strong>Nơi Cấp:</strong> {decision.noiCap}
          </p>
          <p>
            <strong>Hành Vi Vi Phạm:</strong> {decision.hanhVi}
          </p>
          <p>
            <strong>Xử Phạt Chính:</strong> {decision.xuPhatChinh}
          </p>
          <p>
            <strong>Xử Phạt Bổ Sung:</strong> {decision.xuPhatBoSung}
          </p>
          <p>
            <strong>Mức Phạt:</strong> {decision.mucPhat} VNĐ
          </p>
          <p>
            <strong>Biện Pháp Khắc Phục:</strong> {decision.bienPhapKhacPhuc}
          </p>
          <p>
            <strong>Điều Khoản Vi Phạm:</strong> {decision.viPhamDieuKhoan}
          </p>
          <p>
            <strong>Địa Chỉ Kho Bạc:</strong> {decision.diaChiKhoBac}
          </p>
          <p>
            <strong>Người Thi Hành:</strong> {decision.tenNguoiThiHanh}
          </p>
        </div>
      ) : (
        <p>Không tìm thấy thông tin quyết định xử phạt.</p>
      )}
    </div>
  );
};

export default PenaltyDecisionDisplay;
