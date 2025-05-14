import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterGrant } from '../../Context/RegisterGrantContext';
import axios from 'axios';
import './Login.css';

export const UserLogin = () => {
  const navigate = useNavigate();
  const { 
    state, 
    updateLoginForm, 
    validateLoginField, 
    login, 
    loading: contextLoading,
    setError: setContextError
  } = useRegisterGrant();
  
  const { loginForm, loginErrors } = state;
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  
  // Clear errors when component mounts
  useEffect(() => {
    setLocalError(null);
    setContextError(null);
  }, [setContextError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateLoginForm({ [name]: value });
    validateLoginField(name, value);
  };

  const handleDirectLogin = async () => {
    try {
      // API URL and endpoint
      const API_URL = 'https://grant-api.onrender.com';
      const endpoint = '/api/auth/login';
      
      console.log('Attempting direct login to:', `${API_URL}${endpoint}`);
      
      // Create request data
      const loginData = {
        email: loginForm.email.toLowerCase(),
        password: loginForm.password
      };
      
      // Make direct API call with explicit configuration
      const response = await axios({
        method: 'post',
        url: `${API_URL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: loginData
      });
      
      console.log('Login response received:', response.status);
      
      if (response.data && response.data.token) {
        // Store authentication data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify({
          id: response.data._id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role
        }));
        
        return true;
      } else {
        throw new Error('Invalid response from server - missing authentication token');
      }
    } catch (error) {
      console.error('Direct login error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    
    // Validate all fields before submission
    let isValid = true;
    const loginFields = ['email', 'password'];
    
    loginFields.forEach(field => {
      if (!validateLoginField(field, loginForm[field])) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      return false;
    }
    
    try {
      setLocalLoading(true);
      
      // Try both login methods for redundancy
      let success = false;
      let directLoginError = null;
      
      // First attempt: Try context login method
      try {
        console.log('Attempting login via context function');
        success = await login(e);
      } catch (contextError) {
        console.warn('Context login failed:', contextError);
      }
      
      // Second attempt: If context login fails, try direct API call
      if (!success) {
        try {
          console.log('Attempting direct API login as fallback');
          success = await handleDirectLogin();
        } catch (error) {
          directLoginError = error;
          console.error('Direct login also failed:', error);
        }
      }
      
      if (success) {
        console.log('Login successful, redirecting to dashboard');
        // Redirect to user dashboard on successful login
        navigate('/dashboard');
        return;
      }
      
      // If we get here, both login attempts failed
      const errorMessage = directLoginError?.response?.data?.message || 
                          'Login failed. Please check your credentials and try again.';
      
      setLocalError(errorMessage);
      setContextError(errorMessage);
      
    } catch (err) {
      console.error("Login processing error:", err);
      const errorMessage = err.response?.data?.message || 
                          'An unexpected error occurred. Please try again later.';
      
      setLocalError(errorMessage);
      setContextError(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  // Determine if any type of loading is happening
  const isLoading = localLoading || contextLoading;

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>User Login</h2>
        
        {/* Show error messages */}
        {(localError || state.error) && (
          <div className="error-message">
            {localError || state.error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginForm.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={loginErrors.email ? 'input-error' : ''}
              disabled={isLoading}
            />
            {loginErrors.email && <span className="error-text">{loginErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginForm.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={loginErrors.password ? 'input-error' : ''}
              disabled={isLoading}
            />
            {loginErrors.password && <span className="error-text">{loginErrors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="form-links">
            <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
            <a href="/register" className="register-link">Create an Account</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;