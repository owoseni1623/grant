import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterGrant } from '../../Context/RegisterGrantContext';
import './Login.css';

export const UserLogin = () => {
  const navigate = useNavigate();
  const { 
    state, 
    updateLoginForm, 
    validateLoginField, 
    login, 
    loading, 
    error 
  } = useRegisterGrant();
  
  const { loginForm, loginErrors } = state;
  
  // New state for debugging
  const [debugInfo, setDebugInfo] = React.useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateLoginForm({ [name]: value });
    validateLoginField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous debug info
    setDebugInfo(null);
    
    try {
      // Display what's being submitted (for debugging only - remove in production)
      setDebugInfo({
        submitting: true,
        endpoint: 'https://grant-api.onrender.com/api/auth/login',
        credentials: {
          email: loginForm.email,
          passwordLength: loginForm.password?.length || 0
        }
      });
      
      const success = await login(e);
      if (success) {
        // Redirect to user dashboard on successful login
        navigate('/dashboard');
      } else {
        // Update debug info on failure
        setDebugInfo(prev => ({
          ...prev,
          loginSuccess: false,
          failureReason: "Login function returned false"
        }));
      }
    } catch (err) {
      // Capture error details for debugging
      setDebugInfo(prev => ({
        ...prev,
        loginSuccess: false,
        error: err.message,
        stack: err.stack
      }));
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>User Login</h2>
        {error && <div className="error-message">{error}</div>}
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
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="form-links">
            <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
            <a href="/register" className="register-link">Create an Account</a>
          </div>
        </form>
        
        {/* Debug section - remove in production */}
        {debugInfo && process.env.NODE_ENV !== 'production' && (
          <div className="debug-info" style={{marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', fontSize: '12px'}}>
            <h4>Debug Information</h4>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
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