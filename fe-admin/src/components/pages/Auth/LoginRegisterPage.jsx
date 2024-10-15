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
          }, 1500);
        } else {
          toast.error(result.message);
          setIsLoading(false);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra!";
      toast.error(errorMessage);
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
          {/* {!isRegister && (
            <div className="text-center mt-0">
              <p>Đăng nhập bằng: </p>
              <div
                className="d-flex justify-content-between mx-auto"
                style={{ width: "40%" }}
              >
                <Button style={{ color: "#1266f1" }}>
                  <i className="bi bi-facebook" size="sm" />
                </Button>

                <Button style={{ color: "#EB3535" }}>
                  <i className="bi bi-google" size="sm" />
                </Button>
              </div>
            </div>
          )} */}
          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Đang xử lý...</p>
            </div>
          )}
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
      </div>
    </div>
  );
}

export default LoginPage;
