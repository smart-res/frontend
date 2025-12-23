import api from './axios';

export const loginApi = (data: {
  username: string;
  password: string;
}) =>
  api.post('/auth/login', data);

export const refreshApi = () =>
  api.post('/auth/refresh');

export const logoutApi = () =>
  api.post('/auth/logout');
