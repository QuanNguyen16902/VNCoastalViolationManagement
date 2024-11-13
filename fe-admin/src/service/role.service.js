import axios from "axios";
import authHeader from "./auth-header";

import apiConfig from "../utils/config";
const API_URL = apiConfig.apiBaseUrl;

class RoleService {
  getRoles() {
    return axios.get(API_URL + "roles", {
      headers: authHeader(),
    });
  }
  searchRoles(keyword) {
    return axios.get(API_URL + `roles/search?keyword=${keyword}`, {
      headers: authHeader(),
    });
  }
  deleteRole(id) {
    return axios.delete(API_URL + `roles/${id}`, { headers: authHeader() });
  }
  addRole(roleData) {
    return axios.post(API_URL + "roles", roleData, { headers: authHeader() });
  }
  editRole(id, roleData) {
    return axios
      .put(API_URL + `roles/${id}`, roleData, { headers: authHeader() })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("Có lỗi khi chỉnh sửa quyền", error);
      });
  }

  getRole(id) {
    return axios.get(API_URL + `roles/${id}`, { headers: authHeader() });
  }
}

export default new RoleService();
