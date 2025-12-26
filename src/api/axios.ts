import axios from "axios";
import { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL,
   withCredentials: true,
});

function getAccessToken() {
  return localStorage.getItem("accessToken");
}
function setAccessToken(token: string) {
  localStorage.setItem("accessToken", token);
}
function clearAccessToken() {
  localStorage.removeItem("accessToken");
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function flushQueue(err: unknown, token?: string) {
  queue.forEach((p) => (token ? p.resolve(token) : p.reject(err)));
  queue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean });

    if (status !== 401 || original?._retry) {
      return Promise.reject(error);
    }

    const url = original.url ?? "";
    if (url.includes("/api/admin/auth/refresh") || url.includes("/api/admin/auth/login")) {
      clearAccessToken();
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      try {
        const newToken = await new Promise<string>((resolve, reject) => {
          queue.push({ resolve, reject });
        });
        original.headers = original.headers ?? {};
        (original.headers as any).Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    isRefreshing = true;
    try {
      const res = await api.post("/api/admin/auth/refresh");
      const newToken = (res.data as any).accessToken as string;

      if (!newToken) throw new Error("Refresh did not return accessToken");

      setAccessToken(newToken);
      flushQueue(null, newToken);

      original.headers = original.headers ?? {};
      (original.headers as any).Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (e) {
      flushQueue(e);
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
