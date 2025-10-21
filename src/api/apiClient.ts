// apiClient.ts
import axios from 'axios';
import {store}  from '../redux/app/store'; // Adjust path if needed
import type { RootState } from '../redux/app/rootReducer';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token via interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = (store.getState() as RootState).auth.user?.token;
    if (token) {
      config.headers.Authorization = `Token ${token}`; // or Bearer if your backend uses that
    }

    return config;
  },
  (error) => {
    Promise.reject(error)}
);

export default apiClient;
