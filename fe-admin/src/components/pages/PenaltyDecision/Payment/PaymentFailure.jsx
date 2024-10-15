// src/components/PaymentFailure.js

import React from "react";
import { useLocation } from "react-router-dom";

const PaymentFailure = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const message = queryParams.get("message");

  return (
    <div style={styles.container}>
      <h2>Thanh Toán Thất Bại</h2>
      {message && <p>{message}</p>}
      <a href="/" style={styles.button}>
        Quay lại trang chủ
      </a>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  button: {
    display: "inline-block",
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "4px",
  },
};

export default PaymentFailure;
