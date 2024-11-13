import axios from "axios";
import authHeader from "./auth-header";

import apiConfig from "../utils/config";
const API_URL = apiConfig.apiBaseUrl;

class UserService {
  getUsers() {
    return axios.get(API_URL + "users", { headers: authHeader() });
  }
  deleteUser(id) {
    return axios.delete(API_URL + `users/${id}`, { headers: authHeader() });
  }
  addUser(userData) {
    return axios
      .post(API_URL + "users", userData, { headers: authHeader() })
      .then((response) => {
        // Xử lý response
        return response.data;
      })
      .catch((error) => {
        // Xử lý lỗi
        console.error("Có lỗi xảy ra khi thêm người dùng!", error);
        throw error;
      });
  }
  async uploadUserPhoto(userId, formData) {
    return await axios.post(API_URL + `users/${userId}/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...authHeader(), // Spread the headers returned by authHeader()
      },
    });
  }

  editUser(id, userData) {
    return axios
      .put(API_URL + `users/${id}`, userData, { headers: authHeader() })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Có lỗi khi cập nhật người dùng!", error);
      });
  }
  editProfile(id, userData) {
    return axios
      .put(API_URL + `profile/${id}`, userData, { headers: authHeader() })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Có lỗi khi cập nhật người dùng!", error);
      });
  }
  getUser(id) {
    return axios.get(API_URL + `users/${id}`, { headers: authHeader() });
  }

  searchUser(searchKeyword) {
    return axios.get(API_URL + `users/search?keyword=${searchKeyword}`, {
      headers: authHeader(),
    });
  }

  assignRolesToUsers(roleAssignData) {
    return axios.put(API_URL + "users/assign-roles", roleAssignData, {
      headers: authHeader(),
    });
  }
}

export default new UserService();
