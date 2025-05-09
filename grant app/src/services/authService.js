import axios from 'axios';

// Always use the environment variable if available, otherwise use the default
const BASE_URL = process.env.REACT_APP_API_URL || 'https://grant-pi.vercel.app/api';

// Create axios instance with consistent configuration
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // Increased timeout to 15 seconds
});

// Debugging interceptor
api.interceptors.request.use(config => {
  console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, 
    config.data ? JSON.stringify(config.data).substring(0, 100) + '...' : 'No data');
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[API Request] Added token to request');
  }
  return config;
}, error => {
  console.error('[API Request Error]', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => {
    console.log(`[API Response] ${response.status} from ${response.config.url}`, 
      response.data ? 'Data received' : 'No data');
    return response;
  },
  error => {
    console.error('[API Response Error]', error.response ? {
      status: error.response.status,
      data: error.response.data,
      url: error.config.url
    } : error.message);
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject({ 
        message: 'Network error. Please check your connection.' 
      });
    }
    
    // Handle 401 Unauthorized errors more gracefully
    if (error.response.status === 401) {
      console.log('Authentication error detected');
      
      // Only clear tokens when not on login/admin-login pages
      const isLoginPage = window.location.pathname.includes('/login');
      if (!isLoginPage) {
        console.log('Clearing credentials due to 401 error');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

// Direct API calls with explicit error handling
export const authService = {
  login: async (email, password) => {
    console.log('[authService] Attempting login for:', email);
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data && response.data.token) {
        console.log('[authService] Login successful, storing token');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify({
          _id: response.data._id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role
        }));
        return response.data;
      } else {
        console.error('[authService] Login response missing token');
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('[authService] Login error:', error);
      throw error;
    }
  },
  
  adminLogin: async (email, password) => {
    console.log('[authService] Attempting admin login for:', email);
    try {
      // Standardize on axios for consistency
      const response = await api.post('/auth/admin/login', { email, password });
      
      if (response.data && response.data.token) {
        console.log('[authService] Admin login successful, storing token');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify({
          _id: response.data._id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role
        }));
        return response.data;
      } else {
        console.error('[authService] Admin login response missing token');
        throw new Error('Invalid admin login response');
      }
    } catch (error) {
      console.error('[authService] Admin login error:', error);
      
      // If we get a specific error message from the server, use it
      const errorMessage = error.response?.data?.message || 'Admin login failed';
      throw new Error(errorMessage);
    }
  },
  
  logout: () => {
    console.log('[authService] Performing logout');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  },
  
  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem('userData'));
    } catch (e) {
      console.error('[authService] Error parsing user data:', e);
      return null;
    }
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  isAdmin: () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      return userData.role === 'ADMIN';
    } catch (e) {
      console.error('[authService] Error checking admin role:', e);
      return false;
    }
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default api;