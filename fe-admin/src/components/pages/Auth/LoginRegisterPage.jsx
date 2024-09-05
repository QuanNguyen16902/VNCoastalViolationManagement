import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import logo from "../../../images/logo1.png";
import AuthService from "../../../service/auth.service"; // Import AuthService
import "./loading.css";
import "./loginPage.css";

// Validation schema for login and registration forms
const loginValidationSchema = Yup.object({
  username: Yup.string().required("Chưa điền username"),
  password: Yup.string().required("Chưa điền mật khẩu"),
});

const registerValidationSchema = Yup.object({
  username: Yup.string().required("Chưa điền username"),
  email: Yup.string().email("Email không đúng định dạng").required("Chưa điền email"),
  password: Yup.string().required("Chưa điền mật khẩu"),
});

function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [fadeEffect, setFadeEffect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(null);
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
            await AuthService.register(values.username, values.email, values.password);
            setIsLoading(false);
            toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
            handleToggleForm(); // Switch to login form after registration
        } else {
            const result = await AuthService.login(values.username, values.password);
            
            if (result.success) {
                setTimeout(() => {
                    setIsLoading(false); // Turn off loading
                    toast.success("Đăng nhập thành công");
                    navigate("/"); // Redirect to the home page
                }, 1500);
            } else {
                toast.error(result.message); // Display the error message from the result
                setIsLoading(false);
            }
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra!";
        toast.error(errorMessage);
        setIsLoading(false); // Ensure loading is turned off in case of an exception
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
            <Button onClick={() => isRegister && handleToggleForm()} disabled={fadeEffect}>
              Đăng nhập
            </Button>
            <Button onClick={() => !isRegister && handleToggleForm()} disabled={fadeEffect}>
              Đăng ký
            </Button>
          </div>

          <div className={`header-text mb-4 ${fadeEffect ? "fade-out" : "fade-in"}`}>
            <h1>{isRegister ? "Đăng ký" : "Đăng nhập"}</h1>
          </div>

          <Formik
            initialValues={
              isRegister
                ? { username: "", email: "", password: "" }
                : { username: "", password: "", rememberMe: false }
            }
            validationSchema={isRegister ? registerValidationSchema : loginValidationSchema}
            onSubmit={handleSubmit}
          >
            <Form id="login-user-form" className={`form-content ${fadeEffect ? "fade-out" : "fade-in"}`}>
              <Field
                as={TextField}
                name="username"
                label="Username"
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
               {isRegister && (
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
              )}
              <Field
                as={TextField}
                name="password"
                label="Mật khẩu"
                fullWidth
                margin="normal"
                variant="outlined"
                required
                type="password"
              />
              {!isRegister && (
                <div className="remember-forgot-container d-flex justify-content-between align-items-center">
                  <Field
                    as={FormControlLabel}
                    control={<Checkbox />}
                    name="rememberMe"
                    label="Nhớ mật khẩu"
                    className="d-flex align-items-center"
                  />
                  <Link to="/forgot-password" className="forgot-password-link">
                    Quên mật khẩu?
                  </Link>
                </div>
              )}

              <Button className="bg-primary text-white border border-primary w-100 mt-3" type="submit" form="login-user-form" autoFocus>
                {isRegister ? "Đăng ký" : "Đăng nhập"}
              </Button>
            </Form>
          </Formik>

          <p className="text-center mt-3">
            {isRegister ? "Đã có tài khoản?" : "Bạn chưa có tài khoản?"}{" "}
            <a href="#!" onClick={handleToggleForm}>
              {isRegister ? "Đăng nhập" : "Đăng ký"}
            </a>
          </p>
          {!isRegister && (
            <div className="text-center mt-3">
              <p>Đăng nhập bằng: </p>
              <div className="d-flex justify-content-between mx-auto" style={{ width: "40%" }}>
                <Button style={{ color: "#1266f1" }}>
                  <i className="bi bi-facebook" size="sm" />
                </Button>

                <Button style={{ color: "#EB3535" }}>
                  <i className="bi bi-google" size="sm" />
                </Button>
              </div>
            </div>
          )}
          {isLoading && (
        <div className='loading-overlay'>
          <div className='spinner'></div>
          <p>Đang xử lý...</p>
        </div>
      )}
          <div className="text-center">
            <p>Admin Panel - Copyright &copy; QuanNguyen</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
