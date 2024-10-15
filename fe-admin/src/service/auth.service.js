import axios from "axios";
import { Navigate } from "react-router-dom";
import { setToken } from "../utils/auth";
import authHeader from "./auth-header";
const API_URL = "http://localhost:8080/api/admin/auth/";
class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "login", { username, password })
      .then((response) => {
        if (response.data.accessToken) {
          setToken(response.data.accessToken);
          localStorage.setItem("userRoles", response.data.roles);
          sessionStorage.setItem("sessionExpired", "false");
          return { success: true, data: response.data };
        }
        console.log(response);
        return { success: false, message: "Đăng nhập thất bại" };
      })
      .catch((error) => {
        const status = error.response?.status;
        let message;
        let navigateTo = null;

        switch (status) {
          case 400:
            message = "Yêu cầu không hợp lệ! Vui lòng kiểm tra lại thông tin.";
            break;
          case 401:
            message = "Tên đăng nhập hoặc mật khẩu không đúng!";
            break;
          case 403:
            message = "Tài khoản của bạn chưa được kích hoạt!";
            break;
          case 404:
            message = "Tài nguyên không tìm thấy!";
            break;
          case 500:
            message = "Lỗi máy chủ! Vui lòng thử lại sau.";
            navigateTo = "/500";
            break;
          default:
            message = error.response?.data?.message || "Có lỗi xảy ra!";
        }

        console.log("Error message from server:", message); // Debugging log
        if (navigateTo) {
          return <Navigate to={navigateTo} />;
        }
        return { success: false, message: message, status: status };
      });
  }

  logout() {
    const token = localStorage.getItem("token");
    // Kiểm tra xem token có tồn tại không
    if (!token) {
      console.error("Không có token.");
      return;
    }
    // Gửi yêu cầu đăng xuất đến server
    return axios
      .post(
        API_URL + "logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        }
      )
      .then((response) => {
        console.log("Đăng xuất thành công");
        localStorage.clear();
        return response;
      })
      .catch((error) => {
        console.error("Đăng xuất thất bại: ", error);
      })
      .finally(() => {
        localStorage.clear();
      });
  }

  register(username, email, password) {
    return axios.post(API_URL + "register", { username, email, password });
  }

  // getCurrentUser() {
  //   const userStr = localStorage.getItem("user", );
  //   if (userStr) return JSON.parse(userStr);

  // }
  getCurrentUser() {
    return axios
      .get(API_URL + "currentUser", { headers: authHeader() })
      .then((response) => {
        if (response.data) {
          // Lưu thông tin người dùng vào localStorage
          localStorage.setItem("currentUser", JSON.stringify(response.data));
        }
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
        // Trả về thông tin người dùng từ localStorage nếu có lỗi khi gọi API
        const userStr = localStorage.getItem("currentUser");
        if (userStr) {
          return JSON.parse(userStr);
        }
        return null; // Trả về null nếu không có thông tin người dùng
      });
  }

  forgotPassword(email) {
    return axios.post(API_URL + "forgot-password", email);
    // .then((response) => {
    //   return {
    //     success: true,
    //     message: "Yêu cầu đặt lại mật khẩu đã được gửi!",
    //   };
    // })
    // .catch((error) => {
    //   const errorMessage = error.response?.data?.message || "Có lỗi xảy ra!";
    //   return { success: false, message: errorMessage };
    // });
  }

  // Reset password method
  resetPassword({ token, newPassword, verificationCode }) {
    return axios
      .post(API_URL + "reset-password", {
        token,
        newPassword,
        verificationCode,
      })
      .then((response) => {
        console.log("Phản hồi từ server:", response);
        console.log("Token:", token);
        console.log("Mật khẩu mới:", newPassword);
        console.log("Mã xác nhận:", verificationCode);
        return {
          success: true,
          message:
            response.data.message || "Mật khẩu đã được đặt lại thành công!",
        };
      })
      .catch((error) => {
        console.error(error.response?.data || error); // Log lỗi để dễ debug hơn
        const errorMessage = error.response?.data || "Có lỗi xảy ra!";
        return { success: false, message: errorMessage };
      });
  }
}

export default new AuthService();
