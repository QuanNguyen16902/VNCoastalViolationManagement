// VnPayForm.js
import axios from "axios";
import React, { useState } from "react";

function VnPayForm({ decisionId: initialDecisionId }) {
  const [decisionId, setDecisionId] = useState(initialDecisionId || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState(""); // URL của QR code

  // Hàm xử lý hiển thị mã QR
  const handleShowQR = async () => {
    setLoading(true);
    setError("");
    setQrCodeUrl("");

    if (!decisionId) {
      setError("Vui lòng nhập mã quyết định.");
      setLoading(false);
      return;
    }

    try {
      setQrCodeUrl(
        "https://res.cloudinary.com/dy2agire0/image/upload/v1731540384/qrpay2_st0smg.jpg"
      ); // Hiển thị mã QR code
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tạo QR code. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý thanh toán VNPay
  const handleVNPayPayment = async () => {
    setLoading(true);
    setError("");

    if (!decisionId) {
      setError("Vui lòng nhập mã quyết định.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:4005/vnpay", {
        decisionId: Number(decisionId),
        paymentMethod: "VNPay",
      });

      const paymentUrl = response.data;

      if (paymentUrl) {
        window.location.href = paymentUrl; // Chuyển hướng đến trang thanh toán VNPay
      } else {
        setError("Không nhận được URL thanh toán từ máy chủ.");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formGroup}>
        <label htmlFor="decisionId">Mã Quyết Định (Decision ID):</label>
        <input
          type="number"
          id="decisionId"
          value={decisionId}
          onChange={(e) => setDecisionId(e.target.value)}
          required
          style={styles.input}
          placeholder="Nhập mã quyết định"
          disabled={!!initialDecisionId}
        />
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Hai nút: Hiển Thị QR Code và Thanh Toán VNPay */}
      <div style={styles.buttonGroup}>
        <button onClick={handleShowQR} style={styles.button} disabled={loading}>
          {loading ? "Đang tải QR..." : "Hiển Thị QR Code"}
        </button>
        <button
          onClick={handleVNPayPayment}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Thanh Toán VNPay"}
        </button>
      </div>

      {/* Hiển thị ảnh QR code nếu qrCodeUrl có giá trị */}
      {qrCodeUrl && (
        <div style={styles.qrContainer}>
          <h4>Mã QR để nộp phạt:</h4>
          <img
            src={qrCodeUrl}
            alt="QR Code for Payment"
            style={styles.qrCode}
          />
        </div>
      )}
    </div>
  );
}

// Các kiểu CSS đơn giản
const styles = {
  container: {
    maxWidth: "100%",
    padding: "20px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "15px",
  },
  qrContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  qrCode: {
    width: "200px",
    height: "200px",
  },
};

export default VnPayForm;
