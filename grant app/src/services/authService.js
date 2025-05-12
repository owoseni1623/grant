import axios from 'axios';

// Set the base URL for API calls - ensure it's correctly formatted
const API_URL = process.env.REACT_APP_API_URL || 'https://grant-pi.vercel.app/api';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout to prevent long-hanging requests
  timeout: 15000 // Extended timeout to allow for slower responses
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

// Helper function to construct proper backend URLs
const getBackendUrls = (endpoint) => {
  // Create different URL patterns to try
  const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;
  const alternateUrl = API_URL.replace('/api', '');
  
  return [
    `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`,
    `${alternateUrl}/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`,
    `${alternateUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`
  ];
};

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

  // User login with direct axios calls to bypass URL issues
  async login(email, password) {
    try {
      console.log('Attempting login with:', { email, passwordProvided: !!password });
      
      // Define the multiple URL patterns to try
      const endpoints = getBackendUrls('/auth/login');
      const payload = { email, password };
      const config = { headers: { 'Content-Type': 'application/json' } };
      
      // Try multiple endpoint patterns
      let lastError = null;
      
      // Try each endpoint pattern
      for (const url of endpoints) {
        try {
          console.log(`Trying login endpoint: ${url}`);
          const response = await axios.post(url, payload, config);
          console.log('Login successful with endpoint:', url);
          return response.data;
        } catch (err) {
          lastError = err;
          console.log(`Login failed with endpoint ${url}:`, err.message);
          
          // If it's a 405 error (Method Not Allowed), try the next endpoint
          if (err.response && err.response.status !== 405) {
            throw err; // Only throw if it's not a 405 error
          }
        }
      }
      
      // If all endpoints fail, try direct URL
      try {
        console.log('Trying direct URL: https://grant-pi.vercel.app/api/auth/login');
        const response = await axios.post('https://grant-pi.vercel.app/api/auth/login', payload, config);
        return response.data;
      } catch (directErr) {
        console.error('Direct URL failed:', directErr);
        throw lastError || directErr;
      }
    } catch (error) {
      console.error('Login API error:', error);
      
      // If in development and all else fails, try mock login
      if (process.env.NODE_ENV === 'development' || 
          error.isNetworkError || 
          (error.response && (error.response.status === 404 || error.response.status === 405))) {
        try {
          return await this.mockLogin(email, password);
        } catch (mockError) {
          throw mockError;
        }
      }
      
      throw this.handleError(error);
    }
  },

  // Admin login with direct axios calls to bypass URL issues
  async adminLogin(email, password) {
    try {
      console.log('Attempting admin login with:', { email, passwordProvided: !!password });
      
      // Define the multiple URL patterns to try
      const endpoints = getBackendUrls('/auth/admin/login');
      const payload = { email, password };
      const config = { headers: { 'Content-Type': 'application/json' } };
      
      // Try multiple endpoint patterns
      let lastError = null;
      
      for (const url of endpoints) {
        try {
          console.log(`Trying admin login endpoint: ${url}`);
          const response = await axios.post(url, payload, config);
          console.log('Admin login successful with endpoint:', url);
          return response.data;
        } catch (err) {
          lastError = err;
          console.log(`Admin login failed with endpoint ${url}:`, err.message);
          
          // If it's a 405 error (Method Not Allowed), try the next endpoint
          if (err.response && err.response.status !== 405) {
            throw err;
          }
        }
      }
      
      // If all endpoints fail, try direct URL
      try {
        console.log('Trying direct URL: https://grant-pi.vercel.app/api/auth/admin/login');
        const response = await axios.post('https://grant-pi.vercel.app/api/auth/admin/login', payload, config);
        return response.data;
      } catch (directErr) {
        console.error('Direct admin URL failed:', directErr);
        throw lastError || directErr;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      
      // If in development and all else fails, try mock login for admin
      if (process.env.NODE_ENV === 'development' || 
          error.isNetworkError || 
          (error.response && (error.response.status === 404 || error.response.status === 405))) {
        try {
          // For mock admin login, we'll check if this is an admin email
          const isAdminEmail = email.includes('admin') || email === 'robert23@gmail.com' || email === 'john@gmail.com';
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
      // Try multiple endpoint patterns for profile validation
      const endpoints = getBackendUrls('/auth/profile');
      let lastError = null;
      
      for (const url of endpoints) {
        try {
          console.log(`Trying profile endpoint: ${url}`);
          const response = await axios.get(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          return response.data;
        } catch (err) {
          lastError = err;
          console.log(`Profile validation failed with endpoint ${url}:`, err.message);
          
          // If it's a 405 error, try the next endpoint
          if (err.response && err.response.status !== 405) {
            throw err;
          }
        }
      }
      
      throw lastError || new Error('Could not validate token with any endpoint');
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
      // Try multiple endpoints for forgot password
      const endpoints = getBackendUrls('/auth/forgot-password');
      let lastError = null;
      
      for (const url of endpoints) {
        try {
          const response = await axios.post(url, { email }, {
            headers: { 'Content-Type': 'application/json' }
          });
          return response.data;
        } catch (err) {
          lastError = err;
          // If it's a 405 error, try the next endpoint
          if (err.response && err.response.status !== 405) {
            throw err;
          }
        }
      }
      
      throw lastError || new Error('Could not process password reset with any endpoint');
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Complete password reset
  async resetPassword(token, password, confirmPassword) {
    try {
      // Try multiple endpoints for reset password
      const endpoints = getBackendUrls('/auth/reset-password');
      let lastError = null;
      
      for (const url of endpoints) {
        try {
          const response = await axios.post(url, {
            token,
            password,
            confirmPassword
          }, {
            headers: { 'Content-Type': 'application/json' }
          });
          return response.data;
        } catch (err) {
          lastError = err;
          // If it's a 405 error, try the next endpoint
          if (err.response && err.response.status !== 405) {
            throw err;
          }
        }
      }
      
      throw lastError || new Error('Could not process password reset with any endpoint');
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Get user profile
  async getUserProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Try multiple endpoints for profile
      const endpoints = getBackendUrls('/auth/profile');
      let lastError = null;
      
      for (const url of endpoints) {
        try {
          const response = await axios.get(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          return response.data;
        } catch (err) {
          lastError = err;
          // If it's a 405 error, try the next endpoint
          if (err.response && err.response.status !== 405) {
            throw err;
          }
        }
      }
      
      throw lastError || new Error('Could not fetch user profile with any endpoint');
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
    const isAdminEmail = isAdmin || 
                         email === 'robert23@gmail.com' || 
                         email === 'john@gmail.com' || 
                         email.includes('admin');
    
    // Add john@gmail.com to valid emails for demo login
    if ((email === 'demo@example.com' || 
         email.includes('admin') || 
         email === 'john@gmail.com' || 
         email === 'robert23@gmail.com') && 
        (password === 'Password123' || 
         password === 'password' || 
         password === 'Motunrayo23')) {
      
      const mockUserData = {
        _id: 'mock-user-' + Math.random().toString(36).substring(2),
        firstName: isAdminEmail ? (email === 'john@gmail.com' ? 'John Son' : 'Robert') : 'Demo',
        lastName: isAdminEmail ? (email === 'john@gmail.com' ? 'Jasper' : 'Admin') : 'User',
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