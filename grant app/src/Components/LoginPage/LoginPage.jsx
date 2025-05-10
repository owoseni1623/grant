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
  FaEyeSlash 
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
  const [showDiagnostic, setShowDiagnostic] = useState(false); // State to toggle diagnostic tool
  const { addNotification } = useNotification();

  const { login, isAuthenticated } = useUsGrantContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo('');
    setIsLoading(true);

    try {
      // Try direct service login first
      setDebugInfo('Attempting direct service login...');
      
      try {
        const userData = await authService.login(email, password);
        
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
        
        // Update context with login success
        login(email, password);
        navigate('/');
        return;
      } catch (serviceErr) {
        setDebugInfo(`Direct service login failed: ${serviceErr.message}`);
        console.error('Direct service login failed:', serviceErr);
        
        // Fallback to context-based login
        setDebugInfo('Trying context-based login...');
        const success = await login(email, password);
        
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

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>grant.GOV Secure Login</h1>
          <p>Access Your Government Grant Portal</p>
        </div>
        
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
                placeholder="Email (e.g. odumala@gmail.com)" 
                className="input-field"
              />
            </div>
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
                className="input-field"
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isLoading} 
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

export default LoginPage;