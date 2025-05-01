import React, { useState, useRef } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const formRef = useRef(null);

  const departments = [
    'General Inquiry',
    'Application Support',
    'Technical Support', 
    'Billing & Payments',
    'Account Management'
  ];

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.department) {
      errors.department = 'Please select a department';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulated form submission
      setSubmitStatus('success');
      
      // Reset form after submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          department: '',
          message: ''
        });
        setSubmitStatus(null);
      }, 3000);
    } else {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="con002-advanced-contact-page">
      <header className="con002-contact-header">
        <div className="con002-header-overlay">
          <h1>Contact grant.GOV Support</h1>
          <p>We're here to help you through every step of your grant application journey</p>
        </div>
      </header>

      <div className="con002-contact-container">
        <div className="con002-contact-info">
          <div className="con002-contact-methods">
            <div className="con002-contact-method">
              <i className="con002-icon-phone">📞</i>
              <h3>Phone Support</h3>
              <p>1-800-GRANT-US</p>
              <p>Monday - Friday, 8 AM - 6 PM EST</p>
            </div>

            <div className="con002-contact-method">
              <i className="con002-icon-email">✉️</i>
              <h3>Email Support</h3>
              <p>support@grant.gov</p>
              <p>Response within 24-48 hours</p>
            </div>

            <div className="con002-contact-method">
              <i className="con002-icon-chat">💬</i>
              <h3>Live Chat</h3>
              <p>Available during business hours</p>
              <button>Start Chat</button>
            </div>
          </div>
        </div>

        <div className="con002-contact-form-section">
          <form 
            ref={formRef}
            onSubmit={handleSubmit} 
            className="con002-contact-form"
          >
            <h2>Send Us a Message</h2>
            
            {submitStatus === 'success' && (
              <div className="con002-form-success">
                Thank you! Your message has been sent successfully.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="con002-form-error">
                Please correct the errors in the form.
              </div>
            )}

            <div className="con002-form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={formErrors.name ? 'con002-input-error' : ''}
              />
              {formErrors.name && <span className="con002-error-text">{formErrors.name}</span>}
            </div>

            <div className="con002-form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={formErrors.email ? 'con002-input-error' : ''}
              />
              {formErrors.email && <span className="con002-error-text">{formErrors.email}</span>}
            </div>

            <div className="con002-form-group">
              <label>Phone Number (Optional)</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={formErrors.phone ? 'con002-input-error' : ''}
              />
              {formErrors.phone && <span className="con002-error-text">{formErrors.phone}</span>}
            </div>

            <div className="con002-form-group">
              <label>Department</label>
              <select 
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={formErrors.department ? 'con002-input-error' : ''}
              >
                <option value="">Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </select>
              {formErrors.department && <span className="con002-error-text">{formErrors.department}</span>}
            </div>

            <div className="con002-form-group">
              <label>Your Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your inquiry or issue"
                className={formErrors.message ? 'con002-input-error' : ''}
              />
              {formErrors.message && <span className="con002-error-text">{formErrors.message}</span>}
            </div>

            <button type="submit" className="con002-submit-button">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <section className="con002-additional-support">
        <h2>Need More Assistance?</h2>
        <div className="con002-support-options">
          <div className="con002-support-card">
            <h3>Frequently Asked Questions</h3>
            <p>Find quick answers to common questions</p>
            <button>View FAQs</button>
          </div>
          <div className="con002-support-card">
            <h3>Community Forums</h3>
            <p>Connect with other grant applicants</p>
            <button>Visit Forums</button>
          </div>
          <div className="con002-support-card">
            <h3>Video Tutorials</h3>
            <p>Step-by-step guidance for your application</p>
            <button>Watch Tutorials</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;