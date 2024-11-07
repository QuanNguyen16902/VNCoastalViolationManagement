import {
  EmailOutlined,
  LockOutlined,
  PersonOutline,
} from "@mui/icons-material";
import {
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import "./loading.css";
const loginValidationSchema = Yup.object({
  usernameLogin: Yup.string().required("Tên đăng nhập không được bỏ trống"),
  passwordLogin: Yup.string().required("Mật khẩu không được bỏ trống"),
});

const registerValidationSchema = Yup.object({
  usernameRegister: Yup.string().required("Tên đăng nhập không được bỏ trống"),
  emailRegister: Yup.string()
    .email("Email không đúng định dạng")
    .required("Email không được bỏ trống"),
  passwordRegister: Yup.string().required("Mật khẩu không được bỏ trống"),
});
export default function AuthForm({ isRegister, fadeEffect, handleSubmit }) {
  return (
    <Formik
      initialValues={
        isRegister
          ? {
              usernameRegister: "",
              emailRegister: "",
              passwordRegister: "",
            }
          : { usernameLogin: "", passwordLogin: "", rememberMe: false }
      }
      validationSchema={
        isRegister ? registerValidationSchema : loginValidationSchema
      }
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form
          id="login-user-form"
          className={`form-content ${fadeEffect ? "fade-out" : "fade-in"}`}
        >
          {!isRegister && (
            <>
              <Field
                as={TextField}
                name="usernameLogin"
                fullWidth
                margin="normal"
                variant="outlined"
                placeholder="Tên đăng nhập"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline />
                    </InputAdornment>
                  ),
                }}
                error={touched.usernameLogin && !!errors.usernameLogin}
                helperText={touched.usernameLogin && errors.usernameLogin}
              />
              <Field
                as={TextField}
                name="passwordLogin"
                fullWidth
                margin="normal"
                variant="outlined"
                type="password"
                placeholder="Mật khẩu"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  ),
                }}
                error={touched.passwordLogin && !!errors.passwordLogin}
                helperText={touched.passwordLogin && errors.passwordLogin}
              />
            </>
          )}

          {isRegister && (
            <>
              <Field
                as={TextField}
                name="usernameRegister"
                fullWidth
                margin="normal"
                variant="outlined"
                placeholder="Tên đăng nhập"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline />
                    </InputAdornment>
                  ),
                }}
                error={touched.usernameRegister && !!errors.usernameRegister}
                helperText={touched.usernameRegister && errors.usernameRegister}
              />
              <Field
                as={TextField}
                name="emailRegister"
                fullWidth
                margin="normal"
                variant="outlined"
                placeholder="Email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined />
                    </InputAdornment>
                  ),
                }}
                error={touched.emailRegister && !!errors.emailRegister}
                helperText={touched.emailRegister && errors.emailRegister}
              />
              <Field
                as={TextField}
                name="passwordRegister"
                fullWidth
                margin="normal"
                variant="outlined"
                type="password"
                placeholder="Mật khẩu"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  ),
                }}
                error={touched.passwordRegister && !!errors.passwordRegister}
                helperText={touched.passwordRegister && errors.passwordRegister}
              />
            </>
          )}

          {!isRegister && (
            <div className="remember-forgot-container d-flex justify-content-between align-items-center">
              <Field
                as={FormControlLabel}
                control={<Checkbox />}
                name="rememberMe"
                label="Nhớ mật khẩu"
                className="d-flex align-items-center"
              />
              <Link
                to="/forgot-password"
                className={`forgot-password-link ${
                  fadeEffect ? "fade-out" : ""
                }`}
              >
                Quên mật khẩu?
              </Link>
            </div>
          )}
          <Button
            className="bg-primary text-white border border-primary w-100 mt-3"
            type="submit"
            form="login-user-form"
            autoFocus
          >
            {isRegister ? "Đăng ký" : "Đăng nhập"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
