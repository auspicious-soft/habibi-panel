import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL as string;
// const API_BASE_URL = "http://localhost:8001/api/";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor (Axios v1+)
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("admin_token");
  
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Response interceptor
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized");
    }
    return Promise.reject(error);
  }
);
