// services/authService.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://grant-api.onrender.com';

// Create axios instance with proper configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor to include token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses and errors consistently
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
);

export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      return await apiClient.post('/api/auth/register', userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // User login
  login: async (email, password) => {
    try {
      return await apiClient.post('/api/auth/login', { email, password });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Admin login
  adminLogin: async (email, password) => {
    try {
      return await apiClient.post('/api/auth/admin/login', { email, password });
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },

  // Validate token
  validateToken: async (token) => {
    try {
      return await apiClient.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Token validation error:', error);
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      return await apiClient.post('/api/auth/forgot-password', { email });
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (token, password, confirmPassword) => {
    try {
      return await apiClient.post('/api/auth/reset-password', {
        token,
        password,
        confirmPassword
      });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // Logout - client side only
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  }
};

export default authService;