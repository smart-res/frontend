import axios from "axios";

const api = axios.create({
   baseURL: `${import.meta.env.VITE_API_URL}/api/admin`,
   withCredentials: true,
});

api.interceptors.request.use((config) => {
   const token = localStorage.getItem("accessToken");
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
});

api.interceptors.response.use(
   (res) => res,
   async (error) => {
      if (error.response?.status === 401) {
         try {
            const res = await api.post("/auth/refresh");
            localStorage.setItem("accessToken", res.data.accessToken);
            error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return api(error.config);
         } catch {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
         }
      }
      return Promise.reject(error);
   }
);

export default api;
