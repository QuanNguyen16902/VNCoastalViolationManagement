import { Button, TextField } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import logo from "../../../../images/logo1.png";
import authService from '../../../../service/auth.service';

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().email("Email không đúng định dạng").required("Chưa điền email"),
});

function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(values);
      toast.success("Một email đã được gửi để đặt lại mật khẩu của bạn!");
    } catch (error) {
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
              <Button className="bg-primary text-white border border-primary w-100 mt-3" type="submit">
                Gửi mã xác thực
              </Button>
            </Form>
          </Formik>

          {isLoading && (
            <div className='loading-overlay'>
              <div className='spinner'></div>
              <p>Đang xử lý...</p>
            </div>
          )}

          <div className="text-center mt-3">
            <p><a href="/login">Quay lại đăng nhập</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
