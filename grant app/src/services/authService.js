import axios from 'axios';

// Set the base URL for API calls
const API_URL = process.env.REACT_APP_API_URL || 'https://grant-pi.vercel.app/api';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout to prevent long-hanging requests
  timeout: 10000
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Log all outgoing requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 405 Method Not Allowed errors specifically
    if (error.response && error.response.status === 405) {
      console.error('API Method Not Allowed:', error.config.method, error.config.url);
      return Promise.reject({
        message: `The server doesn't support ${error.config.method} requests for this endpoint.`,
        status: 405,
        isApiError: true
      });
    }
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

  // User login with enhanced debugging and error handling
  async login(email, password) {
    try {
      console.log('Attempting login with:', { email, passwordProvided: !!password });
      
      // Try login with proper endpoint
      try {
        const response = await apiClient.post('/auth/login', { email, password });
        console.log('Login response received:', response.status);
        return response.data;
      } catch (innerError) {
        // If primary endpoint fails, try fallback
        if (innerError.response && (innerError.response.status === 405 || innerError.response.status === 404)) {
          console.log('Trying alternative login endpoint...');
          // Try fallback structure - handles both possible backend URL structures
          const altResponse = await axios.post(`${API_URL.replace('/api', '')}/api/auth/login`, { email, password }, {
            headers: { 'Content-Type': 'application/json' }
          });
          return altResponse.data;
        }
        throw innerError;
      }
    } catch (error) {
      console.error('Login API error:', error);
      
      // If in development and all else fails, try mock login
      if (process.env.NODE_ENV === 'development' && (error.isNetworkError || error.response?.status === 404)) {
        try {
          return await this.mockLogin(email, password);
        } catch (mockError) {
          throw mockError;
        }
      }
      
      throw this.handleError(error);
    }
  },

  // Admin login with similar fallback strategy
  async adminLogin(email, password) {
    try {
      console.log('Attempting admin login with:', { email, passwordProvided: !!password });
      
      try {
        const response = await apiClient.post('/auth/admin/login', { email, password });
        return response.data;
      } catch (innerError) {
        // If primary endpoint fails, try fallback
        if (innerError.response && (innerError.response.status === 405 || innerError.response.status === 404)) {
          console.log('Trying alternative admin login endpoint...');
          // Try fallback structure
          const altResponse = await axios.post(`${API_URL.replace('/api', '')}/api/auth/admin/login`, { email, password }, {
            headers: { 'Content-Type': 'application/json' }
          });
          return altResponse.data;
        }
        throw innerError;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      
      // If in development and all else fails, try mock login for admin
      if (process.env.NODE_ENV === 'development' && (error.isNetworkError || error.response?.status === 404)) {
        try {
          // For mock admin login, we'll check if this is an admin email
          const isAdminEmail = email.includes('admin') || email === 'robert23@gmail.com';
          return await this.mockLogin(email, password, isAdminEmail);
        } catch (mockError) {
          throw mockError;
        }
      }
      
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

  // Mock login for development - to be used when API is unavailable
  async mockLogin(email, password, isAdmin = false) {
    console.log('Using mock login as fallback');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check for demo credentials or explicit admin flag
    const isAdminEmail = isAdmin || email === 'robert23@gmail.com';
    
    if ((email === 'demo@example.com' || email.includes('admin') || email === 'robert23@gmail.com') && 
        (password === 'Password123' || password === 'password')) {
      const mockUserData = {
        _id: 'mock-user-' + Math.random().toString(36).substring(2),
        firstName: isAdminEmail ? 'Robert' : 'Demo',
        lastName: isAdminEmail ? 'Admin' : 'User',
        email: email,
        role: isAdminEmail ? 'ADMIN' : 'USER',
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(2)
      };
      return mockUserData;
    }
    
    // Simulate auth failure
    throw new Error('Invalid credentials');
  },

  // Standardized error handling with better details and classification
  handleError(error) {
    // If axios error
    if (error.isAxiosError) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const message = error.response.data?.message || 'Server returned an error';
        const status = error.response.status;
        const fields = error.response.data?.fields || [];
        
        console.error(`Error ${status}: ${message}`);
        return {
          message,
          status,
          fields,
          isApiError: true
        };
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Network error, no response received');
        
        return {
          message: 'Unable to connect to the server. Please check your internet connection.',
          isNetworkError: true
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request configuration error:', error.message);
        return {
          message: error.message || 'An error occurred while setting up the request',
          isConfigError: true
        };
      }
    }
    
    // For non-axios errors (like parsing errors)
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      console.error('JSON Parsing Error:', error);
      return {
        message: 'The server response was invalid. Please try again later.',
        isParsingError: true
      };
    }
    
    // Generic error fallback
    console.error('Unexpected error:', error);
    return {
      message: error.message || 'An unexpected error occurred',
      isUnknownError: true
    };
  }
};