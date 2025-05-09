import axios from 'axios';

// Determine the base URL based on the environment
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://grant-api.onrender.com'  // Update this with your production API URL
  : '/api'; // For local development with proxy

// Create axios instance with base URL
const api = axios.create({
  baseURL: BASE_URL,
});

// Add auth token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired tokens
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear tokens on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
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
      throw error.response?.data || { message: error.message };
    }
  },
  
  // Admin login - uses the specific admin login endpoint
  adminLogin: async (email, password) => {
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
    } catch (error) {
      console.error('Admin login error:', error);
      throw error.response?.data || { message: error.message };
    }
  },
  
  // Login with credentials object (for component compatibility)
  loginWithCredentials: async (credentials) => {
    return authService.login(credentials.email, credentials.password);
  },
  
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
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
  },
  
  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },
  
  // Reset password
  resetPassword: async (token, password, confirmPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password,
        confirmPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }
};

// Export applicationService with the updated token access
export const applicationService = {
  // Get all applications (admin only)
  getAllApplications: async () => {
    try {
      const response = await api.get('/applications');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // Get application details by ID
  getApplicationById: async (id) => {
    try {
      const response = await api.get(`/applications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // Update application status
  updateApplicationStatus: async (id, status) => {
    try {
      const response = await api.patch(`/applications/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default api;