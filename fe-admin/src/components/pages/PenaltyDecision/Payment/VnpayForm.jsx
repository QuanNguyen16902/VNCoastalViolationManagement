// VnPayForm.js
import axios from "axios";
import React, { useState } from "react";

function VnPayForm({ decisionId: initialDecisionId }) {
  const [decisionId, setDecisionId] = useState(initialDecisionId || "");
  const [paymentMethod, setPaymentMethod] = useState("VNPay"); // Giá trị mặc định
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Kiểm tra đầu vào
    if (!decisionId || !paymentMethod) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      setLoading(false);
      return;
    }

    try {
      // Gửi yêu cầu POST tới backend
      const response = await axios.post("http://localhost:8080/vnpay", {
        decisionId: Number(decisionId),
        paymentMethod: paymentMethod,
      });

      const paymentUrl = response.data;

      if (paymentUrl) {
        // Chuyển hướng người dùng tới URL thanh toán
        window.location.href = paymentUrl;
      } else {
        setError("Không nhận được URL thanh toán từ máy chủ.");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tạo thanh toán. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
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
            disabled={!!initialDecisionId} // Nếu decisionId được truyền vào, không cho sửa
          />
        </div>
        <div style={styles.formGroup}>
          <label>Hình Thức Thanh Toán:</label>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="QR"
                checked={paymentMethod === "QR"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={styles.radioInput}
              />
              Quét QR Ngân Hàng
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="VNPay"
                checked={paymentMethod === "VNPay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={styles.radioInput}
              />
              Thanh Toán VNPay
            </label>
          </div>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Đang xử lý..." : "Thanh Toán"}
        </button>
      </form>
    </div>
  );
}

// Các kiểu CSS đơn giản
const styles = {
  container: {
    maxWidth: "100%", // Để phù hợp với Modal
    padding: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
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
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    marginTop: "5px",
  },
  radioLabel: {
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
  },
  radioInput: {
    marginRight: "10px",
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
};

export default VnPayForm;
