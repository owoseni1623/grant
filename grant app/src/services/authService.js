import axios from 'axios';

// Update the base URL to match your actual API endpoint
const BASE_URL = process.env.REACT_APP_API_URL || 'https://grant-pi.vercel.app/api';

// Create axios instance with base URL and proper configs
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Handle cookies properly
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
});

// Add auth token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Handle expired tokens and other response issues
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({ 
        message: 'Network error. Please check your connection.' 
      });
    }
    
    // Handle 401 Unauthorized errors (expired or invalid token)
    if (error.response.status === 401) {
      console.log('Authentication error, clearing credentials');
      // Clear tokens on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle 405 Method Not Allowed errors
    if (error.response.status === 405) {
      console.error('Method not allowed error. Check API endpoint configuration.');
      return Promise.reject({
        message: 'API configuration error. Please contact support.'
      });
    }
    
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

export const authService = {
  // Regular user login
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.token) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify({
          _id: response.data._id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Admin login - uses the specific admin login endpoint
  // With fallback mechanism for problematic endpoints
  adminLogin: async (email, password) => {
    try {
      // First try with axios
      try {
        const response = await api.post('/auth/admin/login', { email, password });
        
        if (response.data.token) {
          // Store token and admin user data
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userData', JSON.stringify({
            _id: response.data._id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            role: response.data.role
          }));
        }
        
        return response.data;
      } catch (axiosError) {
        // If axios fails with 405, try fetch instead
        if (axiosError.response?.status === 405) {
          console.log('Trying alternative fetch method for admin login');
          
          // Create a fetch request manually
          const response = await fetch(`${BASE_URL}/auth/admin/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify({
              _id: data._id,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              role: data.role
            }));
          }
          
          return data;
        } else {
          throw axiosError;
        }
      }
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },
  
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Logout - clears storage
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  },
  
  // Get current user data
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('userData'));
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Check if user is admin
  isAdmin: () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData.role === 'ADMIN';
  },
  
  // Get the authentication token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default api;