import axios from "axios";
import authHeader from "./auth-header";

import apiConfig from "../utils/config";
const API_URL = apiConfig.apiBaseUrl;
class ReportService {
  getReport(data) {
    return axios.post(API_URL + "reports", data, { headers: authHeader() });
  }
}

export default new ReportService();
