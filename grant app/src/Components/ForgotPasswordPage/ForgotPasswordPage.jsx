import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaSpinner, 
  FaCheckCircle 
} from 'react-icons/fa';
import { useUsGrantContext } from '../../Context/UsGrantContext';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { resetPassword } = useUsGrantContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await resetPassword(email);
      
      // More robust success handling
      if (result && result.success) {
        setSuccess('Password reset link sent successfully. Please check your email.');
        
        // Auto-redirect after success
        const redirectTimer = setTimeout(() => {
          navigate('/login');
        }, 3000);

        // Cleanup to prevent memory leaks
        return () => clearTimeout(redirectTimer);
      } else {
        // More specific error handling based on possible scenarios
        const errorMessage = result.message || 
          'Unable to send password reset link. Please try again.';
        setError(errorMessage);
      }
    } catch (err) {
      // Detailed error logging and user-friendly message
      console.error('Password reset error:', err);
      
      const errorMessage = err.response?.data?.message || 
        'An unexpected error occurred. Please try again later.';
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>Reset Your Password</h1>
          <p>Enter the email associated with your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="forgot-password-form">
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              <FaCheckCircle className="success-icon" />
              {success}
            </div>
          )}
          
          <div className="form-group">
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="Enter your email" 
                className="input-field"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isLoading} 
              className={`reset-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinner" /> Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </div>
          
          <div className="form-footer">
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;