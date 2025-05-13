import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification, NotificationType } from '../../Context/NotificationContext';
import { useRegisterGrant } from '../../Context/RegisterGrantContext';
import { 
  FaUser, 
  FaLock, 
  FaSpinner, 
  FaEye, 
  FaEyeSlash,
  FaExclamationTriangle,
  FaSyncAlt
} from 'react-icons/fa';
import './LoginPage.css';
import LoginDiagnostic from '../LoginDiagnostic/LoginDiagnostic';

const LoginPage = () => {
  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [networkStatus, setNetworkStatus] = useState({
    connected: navigator.onLine,
    testing: false,
    apiStatus: null
  });
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  
  // Hooks
  const { addNotification } = useNotification();
  const { login, updateLoginForm, isAuthenticated, user, loading, error: contextError, success } = useRegisterGrant();
  const navigate = useNavigate();

  // Check network connectivity
  useEffect(() => {
    const handleOnline = () => setNetworkStatus(prev => ({ ...prev, connected: true }));
    const handleOffline = () => setNetworkStatus(prev => ({ ...prev, connected: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial API status check
    testApiConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Watch for context error updates
  useEffect(() => {
    if (contextError) {
      setError(contextError);
    }
  }, [contextError]);

  // Watch for context success
  useEffect(() => {
    if (success) {
      setSuccessMessage('Login successful! Redirecting...');
      addNotification('Login successful!', NotificationType.SUCCESS);
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  }, [success, addNotification, navigate]);

  // Update form values in context when local state changes
  useEffect(() => {
    updateLoginForm({ email, password });
  }, [email, password, updateLoginForm]);

  // Test API connectivity
  const testApiConnection = async () => {
    setNetworkStatus(prev => ({ ...prev, testing: true }));
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://grant-api.onrender.com';
      const testUrl = `${apiUrl}/api/health`;
      
      setDebugInfo(`Testing connection to ${testUrl}...`);
      
      try {
        const response = await fetch(testUrl, { 
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors',
        });
        
        if (response.ok) {
          setDebugInfo(`Connection successful: ${response.status} ${response.statusText}`);
          setNetworkStatus(prev => ({ ...prev, apiStatus: 'connected' }));
        } else {
          setDebugInfo(`Connection limited: ${response.status} ${response.statusText}`);
          setNetworkStatus(prev => ({ ...prev, apiStatus: 'limited' }));
        }
      } catch (fetchError) {
        // Fall back to OPTIONS request if GET fails
        try {
          const optionsResponse = await fetch(apiUrl, { 
            method: 'OPTIONS',
            mode: 'cors',
          });
          
          if (optionsResponse.ok) {
            setDebugInfo(`OPTIONS connection successful: ${optionsResponse.status}`);
            setNetworkStatus(prev => ({ ...prev, apiStatus: 'limited' }));
          } else {
            setDebugInfo(`Connection failed: ${optionsResponse.status}`);
            setNetworkStatus(prev => ({ ...prev, apiStatus: 'failed' }));
          }
        } catch (optionsError) {
          setDebugInfo(`Connection error: ${optionsError.message}`);
          setNetworkStatus(prev => ({ ...prev, apiStatus: 'failed' }));
        }
      }
    } catch (error) {
      setDebugInfo(`Connection error: ${error.message}`);
      setNetworkStatus(prev => ({ ...prev, apiStatus: 'failed' }));
    } finally {
      setNetworkStatus(prev => ({ ...prev, testing: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setDebugInfo('');
    
    // Validate network connection first
    if (!navigator.onLine) {
      setError('You appear to be offline. Please check your internet connection and try again.');
      return;
    }

    // Validation checks
    if (!isValidEmail() || !isValidPassword()) {
      setError('Please check your email and password');
      return;
    }

    setDebugInfo('Attempting login via RegisterGrantContext...');
    
    try {
      // Use the login function from context
      await login(e);
    } catch (err) {
      const errorMessage = err.message || 'Invalid credentials. Please try again.';
      setError(errorMessage);
      addNotification(errorMessage, NotificationType.ERROR);
    }
  };

  // Simple validation
  const isValidEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email === '' || emailRegex.test(email);
  };

  const isValidPassword = () => {
    return password === '' || password.length >= 6;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>grant.GOV Secure Login</h1>
          <p>Access Your Government Grant Portal</p>
        </div>
        
        {!networkStatus.connected && (
          <div className="network-warning">
            <FaExclamationTriangle />
            <span>You are currently offline. Please check your internet connection.</span>
          </div>
        )}
        
        {networkStatus.apiStatus === 'failed' && networkStatus.connected && (
          <div className="network-warning" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
            <FaExclamationTriangle />
            <span>Unable to connect to the authentication server. The service may be temporarily unavailable.</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          {debugInfo && <div className="debug-info"><small>{debugInfo}</small></div>}
          
          <div className="form-group">
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="Email (e.g. john@gmail.com)" 
                className={`input-field ${email && !isValidEmail() ? 'input-error' : ''}`}
              />
            </div>
            {email && !isValidEmail() && <div className="field-error">Please enter a valid email address</div>}
          </div>
          
          <div className="form-group">
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Password" 
                className={`input-field ${password && !isValidPassword() ? 'input-error' : ''}`}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {password && !isValidPassword() && <div className="field-error">Password must be at least 6 characters</div>}
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading || (email && !isValidEmail()) || (password && !isValidPassword())} 
              className={`login-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner" /> Logging In...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </div>
          
          <div className="form-footer">
            <Link to="/forgot-password" className="auth-link">
              Forgot Password?
            </Link>
            <Link to="/register" className="auth-link">
              Create Account
            </Link>
          </div>

          <div className="social-login">
            <p>Or continue with:</p>
            <div className="social-buttons">
              <button type="button" className="social-btn google">
                Google
              </button>
              <button type="button" className="social-btn microsoft">
                Microsoft
              </button>
            </div>
          </div>
          
          {/* Network testing tools */}
          <div className="diagnostics-section">
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
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
                  color: '#555',
                  marginRight: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {networkStatus.testing ? (
                  <>
                    <FaSpinner className="spinner" style={{ fontSize: '10px' }} /> Testing...
                  </>
                ) : (
                  <>
                    <FaSyncAlt style={{ fontSize: '10px' }} /> Test API Connection
                  </>
                )}
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

export default LoginPage;