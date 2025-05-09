import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api', // Adjust if your API is on a different base path
});

// Add auth token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API service methods
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

export const authService = {
  // Admin login
  adminLogin: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Store the token
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // Login with credentials object (for compatibility with AdminLogin component)
  login: async (credentials) => {
    return authService.adminLogin(credentials.email, credentials.password);
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },
  
  // Check if user is admin
  isAdmin: () => {
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    return user.role === 'admin';
  },

  // Get the authentication token
  getToken: () => {
    return localStorage.getItem('adminToken');
  }
};

export default api;