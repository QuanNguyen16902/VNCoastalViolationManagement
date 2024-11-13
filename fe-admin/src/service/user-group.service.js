import axios from "axios";
import authHeader from "./auth-header";

import apiConfig from "../utils/config";
const API_URL = apiConfig.apiBaseUrl;
class UserService {
  getUsersGroup() {
    return axios.get(API_URL + "users-group", { headers: authHeader() });
  }
  deleteGroup(id) {
    return axios.delete(API_URL + `users-group/${id}`, {
      headers: authHeader(),
    });
  }

  addListUserToGroup(groupId, userIds) {
    return axios.post(
      API_URL + `users-group/${groupId}/add-users`,
      {
        userIds,
      },
      {
        headers: authHeader(),
      }
    );
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
