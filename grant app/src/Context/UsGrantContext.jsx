import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const UsGrantContext = createContext(null);

// Navigation helper function
export const navigateToPage = (navigate, path) => {
  if (navigate) {
    navigate(path);
  }
};

// Provider component
export const UsGrantProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get base API URL from environment or use the default
  // IMPORTANT FIX: Ensure the API URL doesn't have a trailing slash
  const API_URL = process.env.REACT_APP_API_URL || 'https://grant-pi.vercel.app/api';

  // Login function with enhanced error handling
  const login = async (email, password, navigate) => {
    setError(null);
    try {
      console.log('Attempting login to:', `${API_URL}/auth/login`);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies
      });

      // Log the status before processing
      console.log('Login response status:', response.status);

      // Handle non-OK responses
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        
        // Check if the response is JSON
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        } else {
          // If not JSON, get text
          const errorText = await response.text();
          throw new Error(errorText || `Login failed with status ${response.status}`);
        }
      }

      // Parse successful response
      const data = await response.json();
      console.log('Login successful, received data:', data);

      if (data.token) {
        // Store token and user info
        localStorage.setItem('token', data.token);
        const userData = {
          id: data._id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);

        // Navigate if navigate function is provided
        navigateToPage(navigate, '/');
        return true;
      } else {
        throw new Error('No authentication token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An unexpected error occurred');
      return false;
    }
  };

  // Admin login function - UPDATED to handle different response types
  const adminLogin = async (email, password, navigate) => {
    setError(null);
    try {
      console.log('Attempting admin login to:', `${API_URL}/auth/admin/login`);
      
      const response = await fetch(`${API_URL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies
      });
      
      console.log('Admin login response status:', response.status);
      
      // Handle non-OK responses
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        
        // Check if the response is JSON
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Admin login failed');
        } else {
          // If not JSON, get text
          const errorText = await response.text();
          throw new Error(errorText || `Admin login failed with status ${response.status}`);
        }
      }
      
      // Parse successful response
      const data = await response.json();
      console.log('Admin login successful, received data:', data);
      
      if (data.token) {
        // Store token and user info
        localStorage.setItem('token', data.token);
        const userData = {
          id: data._id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        
        // Navigate if navigate function is provided
        navigateToPage(navigate, '/admin/dashboard');
        return true;
      } else {
        throw new Error('No authentication token received');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.message || 'An unexpected error occurred');
      return false;
    }
  };

  // Logout function
  const logout = (navigate) => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);

    // Navigate if navigate function is provided
    navigateToPage(navigate, '/login');
  };

  // Token validation
  const validateToken = async (token) => {
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

      const data = await response.json();

      setUser({
        id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token validation error:', error);
      // Remove token and reset authentication
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Password reset function
  const resetPassword = async (email) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Handle non-OK responses with better error handling
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

      const data = await response.json();

      return {
        success: true,
        message: data.message || 'Password reset link sent to your email',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message || 'An unexpected error occurred');
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
      };
    }
  };

  // Sign up function
  const signUp = async (userData, navigate) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Better error handling for non-OK responses
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

      const data = await response.json();

      // Navigate to login after successful registration
      navigateToPage(navigate, '/login');
      return {
        success: true,
        message: data.message || 'Account created successfully',
      };
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
      };
    }
  };

  // Check authentication on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Context value
  const contextValue = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    adminLogin,
    logout,
    resetPassword,
    signUp,
    setError,
  };

  return (
    <UsGrantContext.Provider value={contextValue}>
      {children}
    </UsGrantContext.Provider>
  );
};

// Custom hook to use the context
export const useUsGrantContext = () => {
  const context = useContext(UsGrantContext);
  if (!context) {
    throw new Error('useUsGrantContext must be used within a UsGrantProvider');
  }
  return context;
};

export default UsGrantContext;