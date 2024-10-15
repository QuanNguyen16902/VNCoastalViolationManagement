// src/utils/auth.js
import { jwtDecode } from "jwt-decode";

// Lưu token vào localStorage
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Lấy token từ localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Xóa token khỏi localStorage
export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userRoles");
};

// Lấy thông tin người dùng từ token
export const getUserFromToken = () => {
  const token = getToken();
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token");
      return null;
    }
  }
  return null;
};

// Kiểm tra token đã hết hạn chưa
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};
