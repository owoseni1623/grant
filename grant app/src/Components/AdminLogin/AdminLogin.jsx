import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaSpinner, FaEye, FaEyeSlash, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { authService } from '../../services/authService';
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
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in as admin
    if (authService.isAuthenticated() && authService.isAdmin()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

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
    
    const { email, password } = formData;
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      
      // Important: Use the adminLogin method instead of the regular login
      const data = await authService.adminLogin(email, password);
      
      if (data.token) {
        setSuccess('Login successful! Redirecting to admin dashboard...');
        
        // Short delay before redirect for better UX
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      }
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