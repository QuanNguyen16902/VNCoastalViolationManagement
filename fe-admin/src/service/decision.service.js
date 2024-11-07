import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/admin/";

class DecisionService {
  getDecisionList() {
    return axios.get(API_URL + "penalty-decision", { headers: authHeader() });
  }
  deleteDecision(id) {
    return axios.delete(API_URL + `penalty-decision/${id}`, {
      headers: authHeader(),
    });
  }

  addDecision(decisionData) {
    return axios.post(API_URL + "penalty-decision", decisionData, {
      headers: authHeader(),
    });
  }
  editDecision(id, decisionData) {
    return axios.put(API_URL + `penalty-decision/${id}`, decisionData, {
      headers: authHeader(),
    });
  }
  getDecision(id) {
    return axios.get(API_URL + `penalty-decision/${id}`, {
      headers: authHeader(),
    });
  }
  searchDecision(queryParams) {
    return axios.get(API_URL + "penalty-decision/search", {
      params: queryParams,
      headers: authHeader(),
    });
  }
  exportDecision(id) {
    return axios.get(API_URL + `export/decisions/pdf/${id}`, {
      headers: authHeader(),
      responseType: "blob",
    });
  }
}

export default new DecisionService();
