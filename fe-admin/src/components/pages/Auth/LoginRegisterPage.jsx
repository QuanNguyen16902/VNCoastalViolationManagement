import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../images/logo1.png";
import AuthService from "../../../service/auth.service"; // Import AuthService
import AuthForm from "./AuthForm";
import "./loading.css";
import "./loginPage.css";

function LoginPage() {
  const controller = new AbortController();
  const signal = controller.signal;

  const [isRegister, setIsRegister] = useState(false);
  const [fadeEffect, setFadeEffect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Để điều hướng sau khi login

  useEffect(() => {
    if (location.pathname === "/register") {
      setIsRegister(true);
    } else {
      setIsRegister(false);
    }
  }, [location]);

  const handleToggleForm = () => {
    setFadeEffect(true);
    setTimeout(() => {
      setIsRegister(!isRegister);
      setFadeEffect(false);
    }, 300);
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      if (isRegister) {
        await AuthService.register(
          values.usernameRegister,
          values.emailRegister,
          values.passwordRegister
        );
        setIsLoading(false);
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        handleToggleForm();
      } else {
        const result = await AuthService.login(
          values.usernameLogin,
          values.passwordLogin
        );

        if (result.success) {
          setTimeout(() => {
            setIsLoading(false); // Turn off loading
            toast.success("Đăng nhập thành công");
            navigate("/");
          }, 1000);
        } else {
          toast.error(result.message);
          setIsLoading(false);
        }
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        toast.error(
          "Thời gian kết nối đã vượt quá giới hạn, vui lòng thử lại."
        );
      } else {
        const errorMessage = error.response?.data || "Có lỗi xảy ra từ server!";
        toast.error(error.response.data.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-content d-flex shadow-lg">
        <div className="login-image-container">
          <img src={logo} alt="logo" className="login-logo" />
        </div>

        <div className="login-form-container p-4">
          <div className="d-flex justify-content-between">
            <Button
              onClick={() => isRegister && handleToggleForm()}
              disabled={fadeEffect}
            >
              Đăng nhập
            </Button>
            <Button
              onClick={() => !isRegister && handleToggleForm()}
              disabled={fadeEffect}
            >
              Đăng ký
            </Button>
          </div>

          <div
            className={`header-text mb-4 ${
              fadeEffect ? "fade-out" : "fade-in"
            }`}
          >
            <h4>{isRegister ? "Đăng ký" : "Đăng nhập"}</h4>
          </div>

          <AuthForm
            isRegister={isRegister}
            fadeEffect={fadeEffect}
            handleSubmit={handleSubmit}
            setFadeEffect={setFadeEffect}
          />

          <p className="text-center mt-3">
            {isRegister ? "Đã có tài khoản?" : "Bạn chưa có tài khoản?"}{" "}
            <a href="#!" onClick={handleToggleForm}>
              {isRegister ? "Đăng nhập" : "Đăng ký"}
            </a>
          </p>

          <div className="support-info">
            <h5 className="fw-bold">Thông tin hỗ trợ:</h5>
            <p className="fw-medium">
              Điện thoại: 0961240858 (Admin) <br /> Email:
              quannguyen16902hn@gmail.com
            </p>
            <p className="fw-medium">
              Admin Panel - Copyright &copy; QuanNguyen
            </p>
          </div>
        </div>
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Đang xử lý...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
