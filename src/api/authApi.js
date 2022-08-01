import axiosClient from './axiosClient';

const authApi = {
  login: (params) => axiosClient.post('auth/login', params),
  verifyToken: () => axiosClient.post('auth/verify-token'),
};

export default authApi;
