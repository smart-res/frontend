import api, { setAccessToken, clearAccessToken } from "../axios";

export const loginApi = async (data: { username: string; password: string }) => {
  const res = await api.post("/api/admin/auth/login", data);
  const token = (res.data as any)?.accessToken as string;
  if (token) setAccessToken(token);
  return res;
};

export const refreshApi = async () => {
  const res = await api.post("/api/admin/auth/refresh");
  const token = (res.data as any)?.accessToken as string;
  if (token) setAccessToken(token);
  return res;
};

export const logoutApi = async () => {
  const res = await api.post("/api/admin/auth/logout");
  clearAccessToken();
  return res;
};
