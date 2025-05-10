import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

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
  
  // Login function with enhanced error handling
  const login = async (email, password, navigate) => {
    setError(null);
    try {
      const data = await authService.login(email, password);

      if (data && data.token) {
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

  // Admin login function
  const adminLogin = async (email, password, navigate) => {
    setError(null);
    try {
      const data = await authService.adminLogin(email, password);
      
      if (data && data.token) {
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
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);

    // Navigate if navigate function is provided
    navigateToPage(navigate, '/login');
  };

  // Token validation
  const validateToken = async (token) => {
    try {
      const data = await authService.validateToken(token);

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
      const data = await authService.forgotPassword(email);

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
      const data = await authService.register(userData);

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