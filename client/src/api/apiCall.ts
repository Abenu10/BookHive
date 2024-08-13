import axios, {AxiosResponse} from 'axios';
import {store} from '../redux/store';
import {authFailure, logoutSuccess, authSuccess} from '../redux/auth/authSlice';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: VITE_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('access_token');
  config.headers.Authorization = token ? `${token}` : '';
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const accessToken = localStorage.getItem('access_token');
        const userType = localStorage.getItem('user_type');

        if (!accessToken || !userType) {
          throw new Error('No refresh token or user type available');
        }

        const response = await axios.get(`${VITE_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `${accessToken}`,
          },
          params: {
            userType,
          },
        });

        const {access_token, refresh_token, user, roles} = response.data;

        store.dispatch(
          authSuccess({
            access_token,
            refresh_token,
            user,
            roles,
            userType,
          })
        );

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(authFailure('Session expired. Please login again.'));
        store.dispatch(logoutSuccess());
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_type');
        // Redirect to login page or handle the error
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
