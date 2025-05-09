import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSpinner, FaEye, FaEyeSlash, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { useUsGrantContext } from '../../Context/UsGrantContext';
import { authService } from '../../services/authService';
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
  const [showDiagnostic, setShowDiagnostic] = useState(false); // State to toggle diagnostic tool
  const navigate = useNavigate();

  const { adminLogin, isAuthenticated } = useUsGrantContext();

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
    
    const { email, password } = formData;
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setDebugInfo('Attempting admin login with direct service call...');
      
      try {
        // Use the updated authService directly
        const userData = await authService.adminLogin(email, password);
        
        // Store admin session data
        localStorage.setItem('userData', JSON.stringify({
          ...userData,
          role: 'ADMIN'
        }));
        
        setSuccess('Login successful! Redirecting to admin dashboard...');
        setDebugInfo('Login successful via direct service call');
        navigate('/admin/dashboard');
      } catch (serviceErr) {
        // If direct service call fails
        setDebugInfo(`Direct service call failed: ${serviceErr.message}`);
        console.error('Admin login failed with direct service call:', serviceErr);
        
        // Fallback to context-based login
        setDebugInfo('Trying context-based admin login...');
        const success = await adminLogin(email, password);
        
        if (success) {
          setSuccess('Login successful! Redirecting to admin dashboard...');
          navigate('/admin/dashboard');
          return;
        } else {
          throw new Error('Context-based login returned false');
        }
      }
    } catch (err) {
      console.error('Admin login failed:', err);
      setDebugInfo(`Login failed: ${err.message}`);
      setError('Login failed. Please verify your admin credentials.');
    } finally {
      setLoading(false);
    }
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
                className="admin-input-field"
                placeholder="robert23@gmail.com"
                required
              />
            </div>
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
                className="admin-input-field"
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
          </div>
          
          <button
            type="submit"
            disabled={loading}
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