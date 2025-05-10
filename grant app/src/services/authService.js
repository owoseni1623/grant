/**
 * Authentication Service for Grant Application
 * Handles all auth-related API calls
 */

// Get base API URL from environment or use the default
const API_URL = process.env.REACT_APP_API_URL || 'https://grant-pi.vercel.app/api';

class AuthService {
  /**
   * Regular user login
   * @param {string} email User email
   * @param {string} password User password
   * @returns {Promise} User data with token
   */
  async login(email, password) {
    try {
      console.log('AuthService: Attempting login to:', `${API_URL}/auth/login`);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies
      });

      console.log('AuthService: Login response status:', response.status);

      // Handle non-OK responses
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        
        // If response is JSON, parse the error message
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        } else {
          // If not JSON, get text or use status code
          try {
            const errorText = await response.text();
            throw new Error(errorText || `Login failed with status ${response.status}`);
          } catch (textError) {
            throw new Error(`Login failed with status ${response.status}`);
          }
        }
      }

      // Parse successful response
      const data = await response.json();
      console.log('AuthService: Login successful');
      return data;
    } catch (error) {
      console.error('AuthService: Login error:', error);
      throw error;
    }
  }

  /**
   * Admin user login
   * @param {string} email Admin email
   * @param {string} password Admin password
   * @returns {Promise} Admin user data with token
   */
  async adminLogin(email, password) {
    try {
      console.log('AuthService: Attempting admin login to:', `${API_URL}/auth/admin/login`);
      
      const response = await fetch(`${API_URL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies
      });
      
      console.log('AuthService: Admin login response status:', response.status);
      
      // Handle non-OK responses
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        
        // If response is JSON, parse the error message
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Admin login failed');
        } else {
          // If not JSON, get text or use status code
          try {
            const errorText = await response.text();
            throw new Error(errorText || `Admin login failed with status ${response.status}`);
          } catch (textError) {
            throw new Error(`Admin login failed with status ${response.status}`);
          }
        }
      }
      
      // Parse successful response
      const data = await response.json();
      console.log('AuthService: Admin login successful');
      return data;
    } catch (error) {
      console.error('AuthService: Admin login error:', error);
      throw error;
    }
  }

  /**
   * Verify authentication token
   * @param {string} token JWT token
   * @returns {Promise} User profile data
   */
  async validateToken(token) {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include', // Include cookies
      });

      if (!response.ok) {
        throw new Error('Token invalid');
      }

      return await response.json();
    } catch (error) {
      console.error('AuthService: Token validation error:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   * @param {string} email User email
   * @returns {Promise} Response message
   */
  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to send reset link');
        } else {
          const errorText = await response.text();
          throw new Error(errorText || `Failed with status ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error('AuthService: Password reset error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData User registration data
   * @returns {Promise} Registration response
   */
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        } else {
          const errorText = await response.text();
          throw new Error(errorText || `Registration failed with status ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error('AuthService: Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout by clearing stored data
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    return true;
  }
}

// Create a singleton instance
export const authService = new AuthService();

// Export both class and instance
export default AuthService;