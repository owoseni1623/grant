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
  const API_URL = process.env.REACT_APP_API_URL || 'https://grant-pi.vercel.app/api';

  // Login function with enhanced error handling
  const login = async (email, password, navigate) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          // If we can't parse as JSON, use the text itself
          throw new Error(errorText || 'Login failed');
        }
        throw new Error(errorData.message || 'Login failed');
      }

      // Parse successful response
      const data = await response.json();

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

  // Admin login function - UPDATED to fix the issue
  const adminLogin = async (email, password, navigate) => {
    setError(null);
    try {
      // Changed to use XMLHttpRequest to troubleshoot fetch issues
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_URL}/auth/admin/login`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.withCredentials = true;
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              
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
                resolve(true);
              } else {
                setError('No authentication token received');
                resolve(false);
              }
            } catch (e) {
              setError('Error parsing response');
              console.error('Parse error:', e);
              resolve(false);
            }
          } else {
            setError('Admin login failed: ' + xhr.status + ' ' + xhr.statusText);
            console.error('Admin login error:', xhr.status, xhr.statusText, xhr.responseText);
            resolve(false);
          }
        };
        
        xhr.onerror = function() {
          setError('Network error occurred during admin login');
          console.error('Network error:', xhr);
          resolve(false);
        };
        
        xhr.send(JSON.stringify({ email, password }));
      });
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset link');
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
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
    adminLogin, // Add the admin login function
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