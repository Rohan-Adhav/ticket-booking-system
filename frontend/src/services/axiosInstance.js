import axios from "axios";

const baseUrl =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const publicRoutes = ["/auth/login", "/auth/register"];

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  config.headers = config.headers || {};


  const requestPath = config.url?.split("?")[0]; // remove query params

  const isPublicRoute = publicRoutes.some((route) =>
    requestPath?.startsWith(route)
  );

  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      const isAuthPage = ["/auth/login", "/auth/register"].some((route) =>
        error.config?.url?.includes(route)
      );

      // ONLY redirect if NOT on auth pages
      if (!isAuthPage) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error)
  }
)
export default axiosInstance;