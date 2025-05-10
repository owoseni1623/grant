import axios from 'axios';

// Set the base URL for API calls
const API_URL = process.env.REACT_APP_API_URL || 'https://grant-pi.vercel.app/api';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth service with improved error handling
export const authService = {
  // User registration
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw this.handleError(error);
    }
  },

  // User login with enhanced debugging
  async login(email, password) {
    try {
      console.log('Attempting login with:', { email, passwordProvided: !!password });
      console.log('API URL:', `${API_URL}/auth/login`);
      
      const response = await apiClient.post('/auth/login', { email, password });
      console.log('Login response received:', response.status);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      
      // Log additional request details for debugging
      if (error.request) {
        console.log('Request was made but no response received');
        console.log('Request data:', { email, passwordLength: password?.length });
      }
      
      throw this.handleError(error);
    }
  },

  // Admin login
  async adminLogin(email, password) {
    try {
      console.log('Attempting admin login with:', { email, passwordProvided: !!password });
      const response = await apiClient.post('/auth/admin/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw this.handleError(error);
    }
  },

  // Token validation
  async validateToken(token) {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      throw this.handleError(error);
    }
  },

  // Logout function
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  },

  // Password reset request
  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Complete password reset
  async resetPassword(token, password, confirmPassword) {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        password,
        confirmPassword
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Get user profile
  async getUserProfile() {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Standardized error handling
  handleError(error) {
    if (error.response) {
      // Server responded with an error status
      const message = error.response.data.message || 'An error occurred';
      const status = error.response.status;
      const fields = error.response.data.fields || [];
      
      console.error(`Error ${status}: ${message}`);
      return {
        message,
        status,
        fields,
        isAxiosError: true
      };
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error, no response received');
      return {
        message: 'Unable to connect to the server. Please check your internet connection.',
        isNetworkError: true
      };
    } else {
      // Something else caused an error
      console.error('Unexpected error:', error.message);
      return {
        message: error.message || 'An unexpected error occurred',
      };
    }
  }
};