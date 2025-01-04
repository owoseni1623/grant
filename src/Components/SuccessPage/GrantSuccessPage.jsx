import React, { useState, useEffect, useRef } from 'react';
import { Download, Workflow, ArrowRight, FileText, CheckCircle } from 'lucide-react';
import { useApplicationForm } from '../../Context/ApplicationFormContext'; // Import the context
import './GrantSuccessPage.css';
import './ConfettiAnimation.css';

const GrantSuccessPage = () => {
  const { 
    formData, 
    submissionResponse 
  } = useApplicationForm(); // Use the context to get form data

  const [animationStage, setAnimationStage] = useState(0);
  const [confettiParticles, setConfettiParticles] = useState([]);
  const backgroundRef = useRef(null);
  const [activeSection, setActiveSection] = useState('overview');

  // Advanced Confetti Generation
  const generateConfetti = () => {
    const particleCount = 300;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: -50,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      size: Math.random() * 12 + 3,
      speed: Math.random() * 5 + 2,
      rotation: Math.random() * 360,
      delay: Math.random() * 2000
    }));
    setConfettiParticles(particles);
  };

  // Parallax Background Effect
  const handleMouseMove = (e) => {
    if (backgroundRef.current) {
      const x = (e.clientX - window.innerWidth / 2) / 40;
      const y = (e.clientY - window.innerHeight / 2) / 40;
      backgroundRef.current.style.transform = `translate(${-x}px, ${-y}px)`;
    }
  };

  // Download Confirmation Handler
  const handleDownloadConfirmation = () => {
    const confirmationData = `
Grant Application Confirmation

Personal Information:
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phoneNumber}
Date of Birth: ${formData.dateOfBirth}
Address: ${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.zip}

Grant Application Details:
Funding Type: ${formData.fundingType}
Funding Amount: $${formData.fundingAmount.toLocaleString()}
Funding Purpose: ${formData.fundingPurpose}

Additional Information:
Employment Status: ${formData.employmentStatus}
Education Level: ${formData.educationLevel}
Citizenship Status: ${formData.citizenshipStatus}

Application Status: Submitted
    `;

    const blob = new Blob([confirmationData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Grant_Confirmation_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  useEffect(() => {
    generateConfetti();
    window.addEventListener('mousemove', handleMouseMove);
    
    const animationTimer = setTimeout(() => setAnimationStage(1), 500);
    const confettiTimer = setInterval(() => {
      setConfettiParticles(prev => 
        prev.map(p => ({ ...p, y: p.y + p.speed }))
          .filter(p => p.y < window.innerHeight)
      );
    }, 50);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(animationTimer);
      clearInterval(confettiTimer);
    };
  }, []);

  const renderSection = () => {
    switch(activeSection) {
      case 'overview':
        return (
          <div className="details-section">
            <div className="section-header">
              <CheckCircle className="section-icon" />
              <h2>Application Overview</h2>
            </div>
            <div className="details-grid">
              <div className="detail-card">
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phoneNumber}</p>
                <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
              </div>
              <div className="detail-card">
                <h3>Address Details</h3>
                <p><strong>Address:</strong> {formData.streetAddress}</p>
                <p><strong>City:</strong> {formData.city}</p>
                <p><strong>State:</strong> {formData.state}</p>
                <p><strong>ZIP:</strong> {formData.zip}</p>
              </div>
              <div className="detail-card">
                <h3>Application Information</h3>
                <p><strong>Funding Type:</strong> {formData.fundingType}</p>
                <p><strong>Funding Amount:</strong> ${formData.fundingAmount.toLocaleString()}</p>
                <p><strong>Citizenship Status:</strong> {formData.citizenshipStatus}</p>
                <p><strong>Submission Date:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );
      case 'purpose':
        return (
          <div className="details-section">
            <div className="section-header">
              <FileText className="section-icon" />
              <h2>Funding Purpose</h2>
            </div>
            <div className="purpose-content">
              <p>{formData.fundingPurpose}</p>
            </div>
          </div>
        );
      case 'process':
        return (
          <div className="details-section">
            <div className="section-header">
              <Workflow className="section-icon" />
              <h2>Application Process</h2>
            </div>
            <div className="process-timeline">
              <div className="timeline-step active">
                <div className="step-indicator">1</div>
                <div className="step-details">
                  <h3>Application Submitted</h3>
                  <p>Your application has been received and logged in our system.</p>
                  <span className="step-date">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <div className="timeline-step">
                <div className="step-indicator">2</div>
                <div className="step-details">
                  <h3>Initial Review</h3>
                  <p>Our team will conduct a preliminary assessment of your application.</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="step-indicator">3</div>
                <div className="step-details">
                  <h3>Detailed Evaluation</h3>
                  <p>Comprehensive review of your project proposal and potential impact.</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="step-indicator">4</div>
                <div className="step-details">
                  <h3>Final Decision</h3>
                  <p>Grant committee will make the final funding decision.</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="advanced-grant-success-container">
      <div className="background-overlay" ref={backgroundRef}></div>
      
      {/* Animated Confetti */}
      {confettiParticles.map((particle, index) => (
        <div 
          key={index} 
          className="confetti-particle" 
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            transform: `rotate(${particle.rotation}deg)`,
            animationDelay: `${particle.delay}ms`
          }}
        />
      ))}

      <div className={`success-content ${animationStage > 0 ? 'animate' : ''}`}>
        <div className="success-header">
          <div className="success-icon-wrapper">
            <svg className="success-icon" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4CAF50" />
                  <stop offset="100%" stopColor="#81C784" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="none" stroke="url(#successGradient)" strokeWidth="8" />
              <path d="M25 50 L45 70 L75 30" fill="none" stroke="url(#successGradient)" strokeWidth="8" />
            </svg>
          </div>
          <h1>Congratulations, {formData.firstName}!</h1>
          <p className="success-subtitle">Your grant application has been successfully submitted.</p>
        </div>

        <div className="navigation-tabs">
          <button 
            className={`nav-tab ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            Overview <ArrowRight className="tab-icon" />
          </button>
          <button 
            className={`nav-tab ${activeSection === 'purpose' ? 'active' : ''}`}
            onClick={() => setActiveSection('purpose')}
          >
            Purpose <ArrowRight className="tab-icon" />
          </button>
          <button 
            className={`nav-tab ${activeSection === 'process' ? 'active' : ''}`}
            onClick={() => setActiveSection('process')}
          >
            Process <ArrowRight className="tab-icon" />
          </button>
        </div>

        <div className="details-container">
          {renderSection()}
        </div>

        <div className="action-section">
          <div className="action-buttons">
            <button 
              className="primary-button" 
              onClick={handleDownloadConfirmation}
            >
              <Download className="button-icon" />
              Download Confirmation
            </button>
            <button className="secondary-button">
              <Workflow className="button-icon" />
              Track Application
            </button>
          </div>
          <p className="disclaimer">
            * Important: Please save your application details for future reference
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrantSuccessPage;