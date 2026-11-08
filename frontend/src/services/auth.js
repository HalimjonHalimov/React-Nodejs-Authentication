import api from "../api/api";

export const fetchingUserLogin = async (body) => {
  const response = await api.post("auth/login", body);
  return response.data;
};

export const fetchingUserMe = async () => {
  const response = await api.get("auth/me");
  return response.data;
};
export const fetchingAccessToken = async () => {
  const response = await api.post("auth/refresh");
  return response.data.accessToken;
};
