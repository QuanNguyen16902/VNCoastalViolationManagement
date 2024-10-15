import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/admin/";

class UserService {
  getUsersGroup() {
    return axios.get(API_URL + "users-group", { headers: authHeader() });
  }
  deleteGroup(id) {
    return axios.delete(API_URL + `users-group/${id}`, {
      headers: authHeader(),
    });
  }
  addUserToGroup(groupId, userId) {
    return axios.post(API_URL + `users-group/${groupId}/add-user/${userId}`, {
      headers: authHeader(),
    });
  }
  addRoleToGroup(groupId, roleId) {
    return axios.post(API_URL + `users-group/${groupId}/add-role/${roleId}`, {
      headers: authHeader(),
    });
  }
  addGroup(groupData) {
    return axios.post(API_URL + "users-group", groupData, {
      headers: authHeader(),
    });
  }
  editGroup(id, groupData) {
    return axios.put(API_URL + `users-group/${id}`, groupData, {
      headers: authHeader(),
    });
  }
  getGroup(id) {
    return axios.get(API_URL + `users-group/${id}`, { headers: authHeader() });
  }

  searchGroup(searchKeyword) {
    return axios.get(API_URL + `users-group/search?keyword=${searchKeyword}`, {
      headers: authHeader(),
    });
  }

  getRolesGroup() {
    return axios.get(API_URL + "roles-group", { headers: authHeader() });
  }
}

export default new UserService();
