import { getToken } from "../utils/auth";
export default function authHeader() {
  const token = getToken();

  if (token) {
    return { Authorization: "Bearer " + token };
  } else {
    return {};
  }
}
