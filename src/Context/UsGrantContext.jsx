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

  // Login function with enhanced error handling
  const login = async (email, password, navigate) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('userToken', data.token);
        setUser({
          id: data._id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        });
        setIsAuthenticated(true);

        // Navigate if navigate function is provided
        navigateToPage(navigate, '/');
        return true;
      } else {
        setError(data.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
      return false;
    }
  };

  // Logout function
  const logout = (navigate) => {
    localStorage.removeItem('userToken');
    setUser(null);
    setIsAuthenticated(false);

    // Navigate if navigate function is provided
    navigateToPage(navigate, '/login');
  };

  // Token validation
  const validateToken = async (token) => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser({
          id: data._id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        });
        setIsAuthenticated(true);
      } else {
        throw new Error('Token invalid');
      }
    } catch (error) {
      // Remove token and reset authentication
      localStorage.removeItem('userToken');
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
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'Password reset link sent to your email',
        };
      } else {
        setError(data.message || 'Failed to send reset link');
        return {
          success: false,
          message: data.message || 'Failed to send reset link',
        };
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('An unexpected error occurred');
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  };

  // Sign up function
  const signUp = async (userData, navigate) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to login after successful registration
        navigateToPage(navigate, '/login');
        return {
          success: true,
          message: 'Account created successfully',
        };
      } else {
        setError(data.message || 'Registration failed');
        return {
          success: false,
          message: data.message || 'Registration failed',
        };
      }
    } catch (error) {
      setError('An unexpected error occurred');
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  };

  // Check authentication on initial load
  useEffect(() => {
    const token = localStorage.getItem('userToken');
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