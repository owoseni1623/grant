import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification, NotificationType } from '../../Context/NotificationContext';
import { useUsGrantContext } from '../../Context/UsGrantContext';
import { authService } from '../../services/authService';
import { 
  FaUser, 
  FaLock, 
  FaSpinner, 
  FaEye, 
  FaEyeSlash,
  FaExclamationTriangle 
} from 'react-icons/fa';
import './LoginPage.css';
import LoginDiagnostic from '../LoginDiagnostic/LoginDiagnostic';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [networkStatus, setNetworkStatus] = useState({
    connected: navigator.onLine,
    testing: false
  });
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const { addNotification } = useNotification();

  const { login, isAuthenticated, setError: setContextError } = useUsGrantContext();
  const navigate = useNavigate();

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

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Test API connectivity
  const testApiConnection = async () => {
    setNetworkStatus(prev => ({ ...prev, testing: true }));
    try {
      const apiUrl = 'https://grant-api.onrender.com';
      const testUrl = `${apiUrl}/api/health`;
      
      setDebugInfo(`Testing connection to ${testUrl}...`);
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
      } else {
        setDebugInfo(`Connection failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setDebugInfo(`Connection error: ${error.message}`);
    } finally {
      setNetworkStatus(prev => ({ ...prev, testing: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo('');
    setContextError && setContextError(null);
    setIsLoading(true);

    // Validate network connection first
    if (!navigator.onLine) {
      setError('You appear to be offline. Please check your internet connection and try again.');
      setIsLoading(false);
      return;
    }

    try {
      // Try direct service login first using the improved service
      setDebugInfo('Attempting login via direct service call...');
      
      try {
        const userData = await authService.login(email, password);
        
        if (!userData || !userData.token) {
          throw new Error('Invalid response from server - missing authentication token');
        }
        
        // Update localStorage
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userData', JSON.stringify({
          id: userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role
        }));
        
        addNotification('Login successful!', NotificationType.SUCCESS);
        setDebugInfo('Login successful via direct service');
        
        // Sync with context
        try {
          await login(email, password);
        } catch (loginErr) {
          console.log('Context login failed but user is authenticated', loginErr);
          // Continue anyway since direct login worked
        }
        
        navigate('/');
        return;
      } catch (serviceErr) {
        setDebugInfo(`Direct service login failed: ${serviceErr.message}`);
        console.error('Direct service login failed:', serviceErr);
        
        // Fallback to context-based login
        setDebugInfo('Trying context-based login...');
        const success = await login(email, password, navigate);
        
        if (success) {
          addNotification('Login successful!', NotificationType.SUCCESS);
          navigate('/');
          return;
        } else {
          throw new Error('Login failed. Please check your credentials.');
        }
      }
    } catch (err) {
      const errorMessage = err.message || 'Invalid credentials. Please try again.';
      setError(errorMessage);
      addNotification(errorMessage, NotificationType.ERROR);
    } finally {
      setIsLoading(false);
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
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
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
              disabled={isLoading || (email && !isValidEmail()) || (password && !isValidPassword())} 
              className={`login-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
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
                  marginRight: '10px'
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

export default LoginPage;