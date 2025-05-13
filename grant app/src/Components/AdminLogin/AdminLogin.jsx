import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSpinner, FaEye, FaEyeSlash, FaExclamationCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useRegisterGrant } from '../../Context/RegisterGrantContext';
import { useNotification, NotificationType } from '../../Context/NotificationContext';
import LoginDiagnostic from '../LoginDiagnostic/LoginDiagnostic';
import './AdminLogin.css';

const AdminLogin = () => {
  // Local state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const [networkStatus, setNetworkStatus] = useState({
    connected: navigator.onLine,
    testing: false
  });
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  
  // Hooks
  const navigate = useNavigate();
  const { adminLogin, updateAdminLoginForm, isAuthenticated, user, loading: contextLoading, error: contextError, success: contextSuccess } = useRegisterGrant();
  const { addNotification } = useNotification();

  // Check network connectivity
  useEffect(() => {
    const handleOnline = () => setNetworkStatus(prev => ({ ...prev, connected: true }));
    const handleOffline = () => setNetworkStatus(prev => ({ ...prev, connected: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check if already logged in as admin
  useEffect(() => {
    try {
      if (isAuthenticated && user?.role === 'ADMIN') {
        console.log('Already logged in as admin, redirecting to dashboard');
        navigate('/admin/dashboard');
      }
    } catch (e) {
      console.error('Error checking admin status:', e);
    }
  }, [navigate, isAuthenticated, user]);

  // Update context when form data changes
  useEffect(() => {
    updateAdminLoginForm(formData);
  }, [formData, updateAdminLoginForm]);

  // Watch for context error updates
  useEffect(() => {
    if (contextError) {
      setError(contextError);
    }
  }, [contextError]);

  // Watch for loading state from context
  useEffect(() => {
    setLoading(contextLoading);
  }, [contextLoading]);

  // Watch for success from context
  useEffect(() => {
    if (contextSuccess) {
      setSuccess('Login successful! Redirecting to admin dashboard...');
      addNotification('Admin login successful!', NotificationType.SUCCESS);
      
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    }
  }, [contextSuccess, addNotification, navigate]);

  // Test API connectivity
  const testApiConnection = async () => {
    setNetworkStatus(prev => ({ ...prev, testing: true }));
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://grant-api.onrender.com';
      const testUrl = `${apiUrl}/api/auth/admin/login`; // Use a real admin endpoint
      
      setDebugInfo(`Testing connection to admin endpoint at ${apiUrl}...`);
      
      // Just do an OPTIONS request to see if the server responds
      const response = await fetch(testUrl, { 
        method: 'OPTIONS',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
      });
      
      if (response.ok) {
        setDebugInfo(`Connection successful: ${response.status} ${response.statusText}`);
      } else {
        setDebugInfo(`Connection response: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setDebugInfo(`Connection error: ${error.message}`);
    } finally {
      setNetworkStatus(prev => ({ ...prev, testing: false }));
    }
  };

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
    
    const { email, password } = formData;
    
    // Validate network connection first
    if (!navigator.onLine) {
      setError('You appear to be offline. Please check your internet connection and try again.');
      return;
    }
    
    if (!email || !password) {
      setError('Please enter both email and password');
      addNotification('Please enter both email and password', NotificationType.WARNING);
      return;
    }
    
    // Additional validation
    if (!isValidEmail() || !isValidPassword()) {
      setError('Please check your email and password format');
      return;
    }
    
    try {
      setDebugInfo('Attempting admin login with context...');
      await adminLogin(e);
    } catch (err) {
      console.error('Admin login failed:', err);
      setDebugInfo(`Login failed: ${err.message}`);
      const errorMessage = err.message || 'Login failed. Please verify your admin credentials.';
      setError(errorMessage);
      addNotification(errorMessage, NotificationType.ERROR);
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
        
        {!networkStatus.connected && (
          <div className="network-warning" style={{ 
            backgroundColor: '#fef6e4', 
            border: '1px solid #f8d7da', 
            borderRadius: '4px', 
            padding: '10px', 
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FaExclamationTriangle style={{ color: '#dc3545' }} />
            <span>You are currently offline. Please check your internet connection.</span>
          </div>
        )}
        
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
          
          {/* Network testing and diagnostic tools */}
          <div className="diagnostics-section" style={{ marginTop: '20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button 
                type="button"
                onClick={testApiConnection}
                disabled={networkStatus.testing}
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
                {networkStatus.testing ? 'Testing...' : 'Test API Connection'}
              </button>
              
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
          </div>
        </form>
      </div>
      
      {/* Render the diagnostic tool conditionally */}
      {showDiagnostic && <LoginDiagnostic />}
    </div>
  );
};

export default AdminLogin;