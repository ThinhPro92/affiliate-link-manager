import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:9225/api", // Xóa dòng cũ này
  baseURL: "/api", // Dùng đường dẫn tương đối để Vercel Proxy hoạt động
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
