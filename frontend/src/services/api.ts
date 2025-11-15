import axios from 'axios';
import type { AuthResponse, LoginCredentials, SignupCredentials, UserProfile } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/signup', credentials);
    return data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

// Profile API
export const profileAPI = {
  createOrUpdate: async (profileData: Partial<UserProfile>) => {
    const { data } = await api.post('/profile', profileData);
    return data;
  },

  get: async () => {
    const { data } = await api.get('/profile');
    return data;
  },
};

export default api;
