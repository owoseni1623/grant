import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSpinner, FaEye, FaEyeSlash, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { useUsGrantContext } from '../../Context/UsGrantContext';
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
  const navigate = useNavigate();

  const { adminLogin, isAuthenticated, user } = useUsGrantContext();

  useEffect(() => {
    // Check if already logged in as admin
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (isAuthenticated && userData.role === 'ADMIN') {
      navigate('/admin/dashboard');
    }
  }, [navigate, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const manualAdminLogin = async (email, password) => {
    try {
      setDebugInfo('Attempting manual admin login...');
      
      // Attempt with direct XMLHttpRequest for maximum control
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        // Update URL if needed based on your API structure
        xhr.open('POST', 'https://grant-pi.vercel.app/api/auth/admin/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.withCredentials = true;
        
        xhr.onload = function() {
          setDebugInfo(`XHR status: ${xhr.status}, Response: ${xhr.responseText.substring(0, 100)}`);
          
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
                
                // Navigate to dashboard
                navigate('/admin/dashboard');
                resolve(true);
              } else {
                reject(new Error('No authentication token received'));
              }
            } catch (e) {
              reject(new Error('Error parsing response: ' + e.message));
            }
          } else {
            reject(new Error(`Server error: ${xhr.status} ${xhr.statusText}`));
          }
        };
        
        xhr.onerror = function() {
          setDebugInfo('XHR network error occurred');
          reject(new Error('Network error occurred'));
        };
        
        xhr.send(JSON.stringify({ email, password }));
      });
    } catch (error) {
      setDebugInfo(`Manual login error: ${error.message}`);
      throw error;
    }
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
      
      // Try context-based admin login
      try {
        // Use the adminLogin method from UsGrantContext
        const success = await adminLogin(email, password, navigate);
        
        if (success) {
          setSuccess('Login successful! Redirecting to admin dashboard...');
          return;
        }
      } catch (contextError) {
        setDebugInfo(`Context login failed: ${contextError.message}`);
        console.error('Context admin login failed:', contextError);
        
        // If context login fails, try direct API call
        try {
          await manualAdminLogin(email, password);
          setSuccess('Login successful! Redirecting to admin dashboard...');
          return;
        } catch (manualError) {
          console.error('Manual admin login failed:', manualError);
          throw new Error('Login failed after multiple attempts. Please check your credentials.');
        }
      }
      
      setError('Login failed. Please check your admin credentials.');
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.message || 'Login failed. Please check your admin credentials.');
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
          
          {debugInfo && process.env.NODE_ENV === 'development' && (
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
                placeholder="admin@example.com"
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
              Use the admin email and password you registered with. For example: 
              <span className="admin-credential-example"> robert23@gmail.com</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;