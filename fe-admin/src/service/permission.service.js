import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/admin/";

class RoleService {
  getListPermissions() {
    return axios.get(API_URL + "permissions", {
      headers: authHeader(),
    });
  }
  searchPermission(keyword) {
    return axios.get(API_URL + `permissions/search?keyword=${keyword}`, {
      headers: authHeader(),
    });
  }
  deletePermission(id) {
    return axios.delete(API_URL + `permissions/${id}`, {
      headers: authHeader(),
    });
  }
  addPermission(permissionData) {
    return axios
      .post(API_URL + "permissions", permissionData, { headers: authHeader() })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("Có lỗi khi thêm phân quyền", error);
      });
  }
  editPermission(id, permissionData) {
    return axios.put(API_URL + `permissions/${id}`, permissionData, {
      headers: authHeader(),
    });
    // .then((response) => {
    //   return response.data;
    // })
    // .catch((error) => {
    //   console.log("Có lỗi khi chỉnh sửa phân quyền", error);
    // });
  }

  getPermission(id) {
    return axios.get(API_URL + `permissions/${id}`, { headers: authHeader() });
  }
}

export default new RoleService();
