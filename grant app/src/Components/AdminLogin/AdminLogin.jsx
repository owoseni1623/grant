import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSpinner, FaEye, FaEyeSlash, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { useUsGrantContext } from '../../Context/UsGrantContext';
import { authService } from '../../services/authService';
import { useNotification, NotificationType } from '../../Context/NotificationContext';
import LoginDiagnostic from '../LoginDiagnostic/LoginDiagnostic';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const navigate = useNavigate();

  const { adminLogin, isAuthenticated, setError: setContextError } = useUsGrantContext();
  const { addNotification } = useNotification();

  useEffect(() => {
    // Check if already logged in as admin
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (isAuthenticated && userData.role === 'ADMIN') {
        console.log('Already logged in as admin, redirecting to dashboard');
        navigate('/admin/dashboard');
      }
    } catch (e) {
      console.error('Error checking admin status:', e);
    }
  }, [navigate, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDebugInfo(null);
    setContextError && setContextError(null);
    
    const { email, password } = formData;
    
    if (!email || !password) {
      setError('Please enter both email and password');
      addNotification('Please enter both email and password', NotificationType.WARNING);
      return;
    }
    
    try {
      setLoading(true);
      setDebugInfo('Attempting admin login with direct service call...');
      
      try {
        // Use the authService directly
        const userData = await authService.adminLogin(email, password);
        
        if (!userData || !userData.token) {
          throw new Error('Invalid response from server - missing authentication token');
        }
        
        // Store admin session data
        localStorage.setItem('userData', JSON.stringify({
          id: userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role || 'ADMIN'
        }));
        
        // Store token
        localStorage.setItem('token', userData.token);
        
        setSuccess('Login successful! Redirecting to admin dashboard...');
        setDebugInfo('Login successful via direct service call');
        addNotification('Admin login successful!', NotificationType.SUCCESS);
        
        // Navigate to admin dashboard
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
        return;
      } catch (serviceErr) {
        // If direct service call fails
        setDebugInfo(`Direct service call failed: ${serviceErr.message}`);
        console.error('Admin login failed with direct service call:', serviceErr);
        
        // Fallback to context-based login
        setDebugInfo('Trying context-based admin login...');
        const success = await adminLogin(email, password);
        
        if (success) {
          setSuccess('Login successful! Redirecting to admin dashboard...');
          addNotification('Admin login successful!', NotificationType.SUCCESS);
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 1000);
          return;
        } else {
          throw new Error('Admin login failed. Please verify your credentials.');
        }
      }
    } catch (err) {
      console.error('Admin login failed:', err);
      setDebugInfo(`Login failed: ${err.message}`);
      const errorMessage = err.message || 'Login failed. Please verify your admin credentials.';
      setError(errorMessage);
      addNotification(errorMessage, NotificationType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  // Simple validation
  const isValidEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return formData.email === '' || emailRegex.test(formData.email);
  };

  const isValidPassword = () => {
    return formData.password === '' || formData.password.length >= 6;
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Admin Portal</h1>
          <p>Enter your credentials to access the administrative dashboard</p>
        </div>
        
        <form className="admin-login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="admin-error-message">
              <FaExclamationCircle className="admin-message-icon" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="admin-success-message">
              <FaCheckCircle className="admin-message-icon" />
              <span>{success}</span>
            </div>
          )}
          
          {debugInfo && (
            <div className="admin-debug-message">
              <small>{debugInfo}</small>
            </div>
          )}
          
          <div className="admin-form-group">
            <label htmlFor="email">Email Address</label>
            <div className="admin-input-wrapper">
              <FaUser className="admin-input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`admin-input-field ${formData.email && !isValidEmail() ? 'input-error' : ''}`}
                placeholder="robert23@gmail.com"
                required
              />
            </div>
            {formData.email && !isValidEmail() && (
              <div className="field-error">Please enter a valid email address</div>
            )}
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="password">Password</label>
            <div className="admin-input-wrapper">
              <FaLock className="admin-input-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`admin-input-field ${formData.password && !isValidPassword() ? 'input-error' : ''}`}
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.password && !isValidPassword() && (
              <div className="field-error">Password must be at least 6 characters</div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading || (formData.email && !isValidEmail()) || (formData.password && !isValidPassword())}
            className={`admin-login-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <FaSpinner className="admin-spinner" />
                Authenticating...
              </>
            ) : (
              'Sign in as Admin'
            )}
          </button>
          
          <div className="admin-note">
            <div className="admin-note-title">Note:</div>
            <div className="admin-note-content">
              Admin credentials example:
              <span className="admin-credential-example"> robert23@gmail.com</span>
            </div>
          </div>
          
          {/* Toggle button for diagnostic tool */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button 
              type="button"
              onClick={() => setShowDiagnostic(!showDiagnostic)}
              style={{
                background: 'none',
                border: '1px solid #ccc',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#555'
              }}
            >
              {showDiagnostic ? 'Hide Diagnostic Tool' : 'Show Diagnostic Tool'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Render the diagnostic tool conditionally */}
      {showDiagnostic && <LoginDiagnostic />}
    </div>
  );
};

export default AdminLogin;