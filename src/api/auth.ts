import api from './axios';

export const loginApi = (data: {
  username: string;
  password: string;
}) =>
  api.post('/api/admin/auth/login', data);

export const refreshApi = () =>
  api.post('/api/admin/auth/refresh');

export const logoutApi = () =>
  api.post('/api/admin/auth/logout');
