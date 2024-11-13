// // src/utils/axiosInstance.js
// import axios from "axios";
// import { logoutUser } from "../services/authService"; // Hàm logout người dùng
// import { getToken, removeToken } from "./auth";

// const axiosInstance = axios.create({
//   baseURL: "http://192.168.102.13:8080/api",
//   timeout: 10000,
// });

// // Thêm interceptor để đính kèm token vào header của mỗi request
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Thêm interceptor để xử lý lỗi phản hồi
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Token hết hạn hoặc không hợp lệ
//       removeToken();
//       logoutUser(); // Hàm xử lý đăng xuất, ví dụ: chuyển hướng đến trang đăng nhập
//       window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
