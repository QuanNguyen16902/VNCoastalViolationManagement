import axios from "axios";
import authHeader from "./auth-header";

import apiConfig from "../utils/config";
const API_URL = apiConfig.apiBaseUrl;

class ViolationService {
  // violator
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
  // Ship
  searchViolationShip(keyword) {
    return axios.get(
      API_URL + `violation-ship/search?keyword=${keyword || ""}`,
      {
        headers: authHeader(),
      }
    );
  }

  listViolationShip() {
    return axios.get(API_URL + "violation-ship", {
      headers: authHeader(),
    });
  }
  getViolationShip(id) {
    return axios.get(API_URL + `violation-ship/${id}`, {
      headers: authHeader(),
    });
  }
  editViolationShip(id, violationData) {
    return axios.put(API_URL + `violation-ship/${id}`, violationData, {
      headers: authHeader(),
    });
  }
  /// Seized Item
  searchSeizedItem(keyword) {
    return axios.get(API_URL + `seized-items/search?keyword=${keyword || ""}`, {
      headers: authHeader(),
    });
  }

  listSeizedItem() {
    return axios.get(API_URL + "seized-items", {
      headers: authHeader(),
    });
  }
  getSeizedItem(id) {
    return axios.get(API_URL + `seized-items/${id}`, {
      headers: authHeader(),
    });
  }
  editSeizedItem(id, seizedItemData) {
    return axios.put(API_URL + `seized-items/${id}`, seizedItemData, {
      headers: authHeader(),
    });
  }
}

export default new ViolationService();
