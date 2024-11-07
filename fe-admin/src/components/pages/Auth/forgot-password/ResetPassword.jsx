import { Button, TextField } from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import logo from "../../../../images/logo1.png";
import authService from "../../../../service/auth.service";

const resetPasswordValidationSchema = Yup.object({
  verificationCode: Yup.string().required("Chưa điền mã xác thực"),
  password: Yup.string().required("Chưa điền mật khẩu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
});

function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("resetToken", token);
      setResetToken(token);
    }
  }, [location]);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await authService.resetPassword({
        token: resetToken,
        newPassword: values.password,
        verificationCode: values.verificationCode,
      });

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error); // Log lỗi để dễ debug hơn
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
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
          <h1>Đặt lại mật khẩu</h1>
          <Formik
            initialValues={{
              verificationCode: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={resetPasswordValidationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="form-content">
              <Field
                as={TextField}
                name="verificationCode"
                label="Mã xác thực"
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <Field
                as={TextField}
                name="password"
                label="Mật khẩu mới"
                fullWidth
                margin="normal"
                variant="outlined"
                required
                type="password"
              />
              <Field
                as={TextField}
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                fullWidth
                margin="normal"
                variant="outlined"
                required
                type="password"
              />
              <Button
                className="bg-primary text-white border border-primary w-100 mt-3"
                type="submit"
              >
                Đặt lại mật khẩu
              </Button>
            </Form>
          </Formik>

          <div className="text-center mt-3">
            <p>
              <a href="/login">Quay lại đăng nhập</a>
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

export default ResetPasswordPage;
