import { Button, TextField } from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import logo from "../../../../images/logo1.png";
import authService from "../../../../service/auth.service";
import "../loginPage.css";
const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("Email không đúng định dạng")
    .required("Chưa điền email"),
});

function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in effect
    setIsVisible(true);
  }, []);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(values);
      console.log(response);
      toast.success(response.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data || "Có lỗi xảy ra 123!");
      } else {
        toast.error(error.response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`login-container d-flex align-items-center justify-content-center ${
        isVisible ? "fade-in" : ""
      }`}
    >
      <div className="login-content d-flex shadow-lg">
        <div className="login-image-container">
          <img src={logo} alt="logo" className="login-logo" />
        </div>

        <div className="login-form-container p-4">
          <h1>Quên mật khẩu</h1>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={forgotPasswordValidationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="form-content">
              <Field
                as={TextField}
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                variant="outlined"
                required
                type="email"
              />
              <Button
                className="bg-primary text-white border border-primary w-100 mt-3"
                type="submit"
              >
                Gửi mã xác thực
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

export default ForgotPasswordPage;
