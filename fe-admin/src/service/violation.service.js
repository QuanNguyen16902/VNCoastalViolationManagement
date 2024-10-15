import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/admin/";

class ViolationService {
  getViolationList() {
    return axios.get(API_URL + "violation-records", { headers: authHeader() });
  }
  deleteViolation(id) {
    return axios.delete(API_URL + `violation-records/${id}`, {
      headers: authHeader(),
    });
  }

  addViolation(violationData) {
    return axios.post(API_URL + "violation-records", violationData, {
      headers: authHeader(),
    });
  }
  editViolation(id, violationData) {
    return axios.put(API_URL + `violation-records/${id}`, violationData, {
      headers: authHeader(),
    });
  }
  getViolation(id) {
    return axios.get(API_URL + `violation-records/${id}`, {
      headers: authHeader(),
    });
  }
  changeResolved(id, resolved) {
    return axios.put(
      API_URL + `violation-records/${id}/resolved/${resolved}`,
      {},
      {
        headers: authHeader(),
      }
    );
  }
}

export default new ViolationService();
