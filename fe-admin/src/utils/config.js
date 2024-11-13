// config.js
const apiConfig = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
  apiLoginEndpoint: process.env.REACT_APP_API_LOGIN_ENDPOINT,
  apiRegisterEndpoint: process.env.REACT_APP_API_REGISTER_ENDPOINT,
  apiLogoutEndpoint: process.env.REACT_APP_API_LOGOUT_ENDPOINT,
  apiRefreshTokenEndpoint: process.env.REACT_APP_API_REFRESH_TOKEN_ENDPOINT,
  apiUserInfoEndpoint: process.env.REACT_APP_API_USER_INFO_ENDPOINT,
};

export default apiConfig;
