import React, { useState, useEffect } from 'react';
import './EducationGrantApp.css';

const EducationGrantPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Previous Grant Recipient",
      image: "/path/to/sarah.jpg",
      quote: "This education grant made my dream of pursuing higher education possible. The support went beyond financial aid."
    },
    {
      name: "Michael Chen",
      role: "Graduate Student",
      image: "/path/to/michael.jpg",
      quote: "The education grant program's mentorship component helped me navigate my academic journey successfully."
    },
    {
      name: "Emily Rodriguez",
      role: "Undergraduate Scholar",
      image: "/path/to/emily.jpg",
      quote: "Being a first-generation college student, this education grant opened doors I never thought possible."
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(testimonialInterval);
  }, []);

  const handleApplyClick = () => {
    setShowModal(true);
  };

  return (
    <div className={`education-grant-page ${isVisible ? 'visible' : ''}`}>
      {/* Header Navigation */}
      <header className="edu-grant-header">
        <div className="header-logo">
          <h1>Education Grant Program</h1>
        </div>
        <nav className="header-nav">
          <a href="#overview">Overview</a>
          <a href="#eligibility">Eligibility</a>
          <a href="#process">Process</a>
          <a href="#funding">Funding</a>
          <a href="#support">Support</a>
          <button className="apply-button" onClick={handleApplyClick}>
            Apply Now
          </button>
        </nav>
      </header>

      {/* Main Hero Section */}
      <section className="edu-grant-hero">
        <div className="hero-content">
          <h2>Empowering Education Through Financial Support</h2>
          <p>Providing grants up to $50,000 for academic excellence and educational advancement</p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={handleApplyClick}>
              Start Your Application
            </button>
            <button className="secondary-btn">
              Download Guidelines
            </button>
          </div>
          <div className="grant-highlights">
            <div className="highlight-item">
              <span className="highlight-number">$250K</span>
              <span className="highlight-text">Maximum Grant</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-number">1000+</span>
              <span className="highlight-text">Students Funded</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-number">95%</span>
              <span className="highlight-text">Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grant Information Sections */}
      <section className="edu-grant-info" id="overview">
        <div className="info-container">
          <h2>Grant Overview</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Educational Support</h3>
              <ul>
                <li>Full tuition coverage</li>
                <li>Book and material allowance</li>
                <li>Research funding</li>
                <li>Conference attendance support</li>
              </ul>
            </div>
            <div className="info-card">
              <h3>Additional Benefits</h3>
              <ul>
                <li>Mentorship program</li>
                <li>Career guidance</li>
                <li>Networking opportunities</li>
                <li>Professional development</li>
              </ul>
            </div>
            <div className="info-card">
              <h3>Duration & Renewal</h3>
              <ul>
                <li>One academic year</li>
                <li>Performance-based renewal</li>
                <li>Progress monitoring</li>
                <li>Extended support options</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="edu-grant-eligibility" id="eligibility">
        <div className="eligibility-container">
          <h2>Eligibility Requirements</h2>
          <div className="eligibility-content">
            <div className="eligibility-criteria">
              <h3>Basic Requirements</h3>
              <ul>
                <li>Minimum GPA of 3.0</li>
                <li>Enrolled or accepted in accredited institution</li>
                <li>Demonstrated financial need</li>
                <li>Strong academic record</li>
              </ul>
            </div>
            <div className="eligibility-levels">
              <div className="level-card">
                <h4>Undergraduate</h4>
                <p>Full-time enrollment in bachelor's program</p>
                <button onClick={() => setShowModal(true)}>Check Eligibility</button>
              </div>
              <div className="level-card">
                <h4>Graduate</h4>
                <p>Pursuing master's or doctoral degree</p>
                <button onClick={() => setShowModal(true)}>Check Eligibility</button>
              </div>
              <div className="level-card">
                <h4>Research</h4>
                <p>Conducting academic research</p>
                <button onClick={() => setShowModal(true)}>Check Eligibility</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="pro003-edu-grant-process" id="process">
        <div className="pro003-process-container">
          <h2>Application Process</h2>
          <div className="pro003-process-timeline">
            <div className="pro003-timeline-item">
              <div className="pro003-timeline-marker"></div>
              <div className="pro003-timeline-content">
                <h3>Step 1: Initial Application</h3>
                <p>Complete online application form with personal and academic information</p>
                <span className="pro003-timeline-date">December 1, 2024</span>
              </div>
            </div>
            <div className="pro003-timeline-item">
              <div className="pro003-timeline-marker"></div>
              <div className="pro003-timeline-content">
                <h3>Step 2: Document Submission</h3>
                <p>Submit academic transcripts, recommendations, and financial documents</p>
                <span className="pro003-timeline-date">January 15, 2025</span>
              </div>
            </div>
            <div className="pro003-timeline-item">
              <div className="pro003-timeline-marker"></div>
              <div className="pro003-timeline-content">
                <h3>Step 3: Review Process</h3>
                <p>Application review and evaluation by grant committee</p>
                <span className="pro003-timeline-date">February 2025</span>
              </div>
            </div>
            <div className="pro003-timeline-item">
              <div className="pro003-timeline-marker"></div>
              <div className="pro003-timeline-content">
                <h3>Step 4: Final Decision</h3>
                <p>Notification of grant awards and next steps</p>
                <span className="pro003-timeline-date">March 15, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="edu-grant-support" id="support">
        <div className="support-container">
          <h2>Support & Resources</h2>
          <div className="support-grid">
            <div className="support-card">
              <h3>Application Support</h3>
              <p>Get help with your application process</p>
              <ul>
                <li>Application guidelines</li>
                <li>Document checklist</li>
                <li>FAQ section</li>
              </ul>
            </div>
            <div className="support-card">
              <h3>Technical Support</h3>
              <p>Technical assistance for online application</p>
              <ul>
                <li>System requirements</li>
                <li>Troubleshooting guide</li>
                <li>Contact support team</li>
              </ul>
            </div>
            <div className="support-card">
              <h3>Additional Resources</h3>
              <p>Extra resources for applicants</p>
              <ul>
                <li>Webinar recordings</li>
                <li>Sample applications</li>
                <li>Tips for success</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="edu-grant-testimonials">
        <h2>Success Stories</h2>
        <div className="testimonials-container">
          <div className="testimonials-slider">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`testimonial-card ${index === currentTestimonial ? 'active' : ''}`}
              >
                <div className="testimonial-content">
                  <p>{testimonial.quote}</p>
                  <div className="testimonial-author">
                    <span className="author-name">{testimonial.name}</span>
                    <span className="author-role">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {showModal && (
        <div className="application-modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>Start Your Grant Application</h2>
            <div className="application-options">
              <button onClick={() => window.location.href = '/apply'}>
                Undergraduate Application
              </button>
              <button onClick={() => window.location.href = '/apply'}>
                Graduate Application
              </button>
              <button onClick={() => window.location.href = '/apply'}>
                Research Grant Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationGrantPage;