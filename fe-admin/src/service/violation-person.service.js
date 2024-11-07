import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/admin/";

class ViolationService {
  searchViolationPerson(keyword) {
    return axios.get(
      API_URL + `violation-person/search?keyword=${keyword || ""}`,
      {
        headers: authHeader(),
      }
    );
  }

  listViolationPerson() {
    return axios.get(API_URL + "violation-person", {
      headers: authHeader(),
    });
  }

  editViolationPerson(id, violationData) {
    return axios.put(API_URL + `violation-person/${id}`, violationData, {
      headers: authHeader(),
    });
  }
  getViolationPerson(id) {
    return axios.get(API_URL + `violation-person/${id}`, {
      headers: authHeader(),
    });
  }
}

export default new ViolationService();
