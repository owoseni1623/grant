import axios from 'axios';

// Force use of the correct API URL regardless of environment
// This is the URL that works based on your Postman tests
const API_BASE_URL = 'https://grant-api.onrender.com';

// Create axios instance with proper configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Changed to false to avoid CORS issues with credentials
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

// Enhanced error handling interceptor with improved diagnostics
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    
    // If the error has a response, log it for debugging
    if (error.response) {
      console.error('Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
        request: {
          url: error.response.config.url,
          method: error.response.config.method,
          baseURL: error.response.config.baseURL
        }
      });
    } else if (error.request) {
      // If the request was made but no response was received
      console.error('Request error - no response received:', error.request);
    } else {
      // If something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    // Enhanced error handling
    if (error.response && error.response.status === 405) {
      console.error('Method not allowed error. Check if the API endpoint exists and supports this HTTP method.');
    }
    
    throw error.response?.data || error;
  }
);

export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      console.log(`Registering user at ${API_BASE_URL}/api/auth/register`);
      return await apiClient.post('/api/auth/register', userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // User login with detailed error handling
  login: async (email, password) => {
    try {
      console.log(`Attempting login to: ${API_BASE_URL}/api/auth/login with email: ${email}`);
      
      // Double check we're using the correct URL and not a relative one
      const response = await apiClient.post('/api/auth/login', { email, password });
      console.log('Login success response:', response);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      
      // Check for network or server errors
      if (!error.response) {
        throw new Error('Network error - please check your connection or try again later');
      }
      
      // Handle specific status codes
      if (error.response.status === 401) {
        throw new Error('Invalid credentials. Please check your email and password.');
      } else if (error.response.status === 404 || error.response.status === 405) {
        throw new Error(`Login service error (${error.response.status}). Please try again later.`);
      }
      
      throw error;
    }
  },

  // Admin login with detailed error handling
  adminLogin: async (email, password) => {
    try {
      console.log(`Attempting admin login to: ${API_BASE_URL}/api/auth/admin/login with email: ${email}`);
      
      // Use full URL to ensure correct endpoint
      const response = await apiClient.post('/api/auth/admin/login', { email, password });
      console.log('Admin login success response:', response);
      return response;
    } catch (error) {
      console.error('Admin login error:', error);
      
      // Similar error handling as login
      if (!error.response) {
        throw new Error('Network error - please check your connection or try again later');
      }
      
      if (error.response.status === 401) {
        throw new Error('Invalid admin credentials. Please check your email and password.');
      } else if (error.response.status === 403) {
        throw new Error('Access denied. You do not have admin privileges.');
      } else if (error.response.status === 404 || error.response.status === 405) {
        throw new Error(`Admin login service error (${error.response.status}). Please try again later.`);
      }
      
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