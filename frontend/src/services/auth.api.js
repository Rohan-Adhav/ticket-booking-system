import axiosInstance from "./axiosInstance.js";

export const login = async (credentials) => {
  const res = await axiosInstance.post("/auth/login", credentials);
  return res.data.data; // normalized
};

export const register = async (credentials) => {
  const res = await axiosInstance.post("/auth/register", credentials);
  return res.data.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
  return res.data;
};

export const refreshAccessToken = async () => {
  const res = await axiosInstance.post("/auth/refreshAccessToken");

  localStorage.setItem("token", res.data.data.accessToken);

  return res.data.data;
};