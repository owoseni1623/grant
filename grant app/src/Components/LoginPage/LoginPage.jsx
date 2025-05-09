import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification, NotificationType } from '../../Context/NotificationContext';
import { useUsGrantContext } from '../../Context/UsGrantContext';
import { 
  FaUser, 
  FaLock, 
  FaSpinner, 
  FaEye, 
  FaEyeSlash 
} from 'react-icons/fa';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    setIsLoading(true);

    try {
      const success = await login(email, password, navigate);
      if (success) {
        addNotification('Login successful!', NotificationType.SUCCESS);
      } else {
        setError('Invalid credentials. Please try again.');
        addNotification('Invalid credentials. Please try again.', NotificationType.ERROR);
      }
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred. Please try again later.';
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
          
          <div className="form-group">
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="Email" 
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
        </form>
      </div>
    </div>
  );
};

export default LoginPage;