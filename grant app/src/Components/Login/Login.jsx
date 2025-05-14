import React from 'react';
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
    loading,
    setError
  } = useRegisterGrant();
  
  const { loginForm, loginErrors } = state;
  const [localLoading, setLocalLoading] = React.useState(false);
  const [localError, setLocalError] = React.useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateLoginForm({ [name]: value });
    validateLoginField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    
    // Validate fields
    let isValid = true;
    const loginFields = ['email', 'password'];
    
    loginFields.forEach(field => {
      const fieldValue = loginForm[field];
      if (!validateLoginField(field, fieldValue)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      return false;
    }
    
    try {
      setLocalLoading(true);
      
      // Try to use the context login function first
      console.log('Attempting login via context function');
      let success = await login(e);
      
      // If that fails, try a direct API call as backup
      if (!success) {
        console.log('Context login failed, attempting direct API call as fallback');
        
        // Create a dedicated axios instance for this request
        const loginClient = axios.create({
          baseURL: 'https://grant-api.onrender.com',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: false
        });
        
        // Make the request directly
        const response = await loginClient.post('/api/auth/login', {
          email: loginForm.email.toLowerCase(),
          password: loginForm.password
        });
        
        const userData = response.data;
        
        if (userData && userData.token) {
          // Store user data in localStorage
          localStorage.setItem('token', userData.token);
          localStorage.setItem('userData', JSON.stringify({
            id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role: userData.role
          }));
          
          success = true;
        }
      }
      
      if (success) {
        // Redirect to user dashboard on successful login
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setLocalError(errorMessage);
      setError(errorMessage);
    } finally {
      setLocalLoading(true);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>User Login</h2>
        {(localError || state.error) && (
          <div className="error-message">{localError || state.error}</div>
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
            />
            {loginErrors.password && <span className="error-text">{loginErrors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading || localLoading}
          >
            {(loading || localLoading) ? 'Logging in...' : 'Login'}
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

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { 
    state, 
    updateAdminLoginForm, 
    validateAdminLoginField, 
    adminLogin, 
    loading, 
    error 
  } = useRegisterGrant();
  
  const { adminLoginForm, adminLoginErrors } = state;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateAdminLoginForm({ [name]: value });
    validateAdminLoginField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await adminLogin(e);
    if (success) {
      // Redirect to admin dashboard on successful login
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="login-container admin-login">
      <div className="login-form-container">
        <h2>Admin Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-email">Email Address</label>
            <input
              type="email"
              id="admin-email"
              name="email"
              value={adminLoginForm.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              className={adminLoginErrors.email ? 'input-error' : ''}
            />
            {adminLoginErrors.email && <span className="error-text">{adminLoginErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              type="password"
              id="admin-password"
              name="password"
              value={adminLoginForm.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              className={adminLoginErrors.password ? 'input-error' : ''}
            />
            {adminLoginErrors.password && <span className="error-text">{adminLoginErrors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="submit-button admin-submit"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Default export for the Login component
export default UserLogin;