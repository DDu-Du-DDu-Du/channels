const API_BASE_URL = "/api/auth";

const AUTH = {
  LOGIN: `${API_BASE_URL}/login`,
  LOGOUT: `${API_BASE_URL}/logout`,
  REFRESH: `${API_BASE_URL}/token`,
};

export default AUTH;
