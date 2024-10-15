import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/admin/";

class ReportService {
  getReport(data) {
    return axios.post(API_URL + "reports", data, { headers: authHeader() });
  }
}

export default new ReportService();
