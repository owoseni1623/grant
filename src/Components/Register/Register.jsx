import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRegisterGrant } from '../../Context/RegisterGrantContext';
import './Register.css';

const Register = () => {
  const {
    state: { formData, errors: formErrors, loading, error, success },
    updateForm,
    validateField,
    handleRegisterSubmit
  } = useRegisterGrant();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
    validateField(name, value);
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="grants-registration-page">
      <div className="register-container">
        <div className="register-header">
          <h1>REGISTER</h1>
          <p className="register-info">
            Please enter your information below to create a new Grants.gov account. 
            Required fields are marked with an asterisk (*).
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="register-form">
          <div className="form-section">
            <h2>Contact Information</h2>
            
            <div className="form-group">
              <label htmlFor="firstName">
                First Name: <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleChange}
                className={formErrors.firstName ? 'error' : ''}
              />
              {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                Last Name: <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleChange}
                className={formErrors.lastName ? 'error' : ''}
              />
              {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email Address: <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className={formErrors.email ? 'error' : ''}
                autoComplete="username"
              />
              {formErrors.email && <span className="error-message">{formErrors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="primaryPhone">
                Primary Phone Number: <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="primaryPhone"
                name="primaryPhone"
                value={formData.primaryPhone || ''}
                onChange={handleChange}
                className={formErrors.primaryPhone ? 'error' : ''}
                placeholder="+234XXXXXXXXXX"
              />
              {formErrors.primaryPhone && <span className="error-message">{formErrors.primaryPhone}</span>}
              <small className="help-text">
                Include country code (e.g., +234 for Nigeria, +1 for USA)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="mobilePhone">Mobile Phone Number:</label>
              <input
                type="tel"
                id="mobilePhone"
                name="mobilePhone"
                value={formData.mobilePhone || ''}
                onChange={handleChange}
                className={formErrors.mobilePhone ? 'error' : ''}
                placeholder="+234XXXXXXXXXX"
              />
              {formErrors.mobilePhone && <span className="error-message">{formErrors.mobilePhone}</span>}
              <small className="help-text">
                Include country code (e.g., +234 for Nigeria, +1 for USA) for password reset via SMS
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password: <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password || ''}
                  onChange={handleChange}
                  className={formErrors.password ? 'error' : ''}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('password')}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formErrors.password && <span className="error-message">{formErrors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password: <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword || ''}
                  onChange={handleChange}
                  className={formErrors.confirmPassword ? 'error' : ''}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('confirm')}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formErrors.confirmPassword && <span className="error-message">{formErrors.confirmPassword}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          {error && (
            <div className="error-banner">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="success-banner">
              <p>Account created successfully! You can now log in.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;