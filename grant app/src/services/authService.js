// Auth service for handling authentication operations
const API_URL = process.env.REACT_APP_API_URL || 'https://grant-pi.vercel.app/api';

// Helper function to handle response errors
const handleResponse = async (response) => {
  // Log response for debugging
  console.log(`Response status: ${response.status} ${response.statusText}`);
  
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    
    // Check if the response is JSON
    if (contentType && contentType.includes('application/json')) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      } catch (jsonError) {
        // If JSON parsing fails, use text response
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }
    } else {
      // If not JSON, get text directly
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }
  }
  
  // For successful responses, try to parse as JSON
  try {
    return await response.json();
  } catch (e) {
    // If there's no JSON body or parsing fails
    return { success: true, message: 'Operation completed successfully' };
  }
};

// Auth service object with authentication methods
export const authService = {
  // Login user
  async login(email, password) {
    console.log('AuthService: Attempting login to', `${API_URL}/auth/login`);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('AuthService login error:', error);
      throw error;
    }
  },
  
  // Admin login
  async adminLogin(email, password) {
    console.log('AuthService: Attempting admin login to', `${API_URL}/auth/admin/login`);
    try {
      const response = await fetch(`${API_URL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('AuthService admin login error:', error);
      throw error;
    }
  },
  
  // Register user
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('AuthService register error:', error);
      throw error;
    }
  },
  
  // Get user profile
  async getUserProfile(token) {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('AuthService get profile error:', error);
      throw error;
    }
  },
  
  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('AuthService forgot password error:', error);
      throw error;
    }
  },
  
  // Reset password
  async resetPassword(token, password, confirmPassword) {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('AuthService reset password error:', error);
      throw error;
    }
  },
  
  // Logout - client side only
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  },
  
  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

export default authService;