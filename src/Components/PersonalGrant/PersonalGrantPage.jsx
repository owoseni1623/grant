import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PersonalGrantPage.css'

const PersonalGrantPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const navElement = document.querySelector('.grant-nav');
      const navOffset = navElement?.offsetTop || 0;
      const headerHeight = 64; // Adjust this value to match your header height
      const scrollPosition = window.pageYOffset + headerHeight;
      
      setIsNavSticky(scrollPosition > navOffset);
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="personal-grant-page">
      <div className="grant-page">
          <div className="grant-content-wrapper" style={{ paddingTop: '64px' }}>
            <header className="grant-header">
              <div className="header-content">
                <h1>Personal Development Grant Program</h1>
                <p className="header-subtitle">Empowering Individuals to Achieve Their Dreams</p>
                <div className="header-cta">
                  <Link to="/apply" className="apply-button primary">Apply Now</Link>
                  <Link to="/info-session" className="info-button secondary">Join Info Session</Link>
                </div>
                <div className="header-stats">
                  <div className="stat-item">
                    <span className="stat-number">$750K</span>
                    <span className="stat-label">Maximum Grant</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Recipients</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">95%</span>
                    <span className="stat-label">Success Rate</span>
                  </div>
                </div>
              </div>
            </header>

            <nav className={`grant-nav ${isNavSticky ? 'sticky' : ''}`} 
                style={{ 
                  top: isNavSticky ? '64px' : '0',
                  zIndex: 100
                }}>
              <div className="nav-container">
                <button 
                  className="mobile-menu-toggle"
                  onClick={toggleMenu}
                  aria-label="Toggle menu"
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
                
                <div className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
                  {['overview', 'eligibility', 'benefits', 'process', 'resources', 'success'].map((section) => (
                    <button
                      key={section}
                      className={activeSection === section ? 'active' : ''}
                      onClick={() => {
                        setActiveSection(section);
                        setIsMenuOpen(false);
                      }}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            <main className="grant-content">
              {activeSection === 'overview' && (
                <section className="content-section overview-section">
                  <h2>Grant Overview</h2>
                  <div className="info-card featured">
                    <h3>Available Funding</h3>
                    <p className="highlight">Up to $25,000 per recipient</p>
                    <p className="funding-note">Additional performance bonuses available</p>
                  </div>
                  
                  <div className="overview-description">
                    <p className="lead-text">
                      The Personal Development Grant Program is designed to support individuals who are committed to achieving significant personal and professional growth. This grant provides financial assistance and resources to help you pursue your goals, whether they're related to education, career advancement, or community impact.
                    </p>
                    
                    <div className="featured-quote">
                      <blockquote>
                        "This grant program transformed my career trajectory and opened doors I never thought possible."
                        <cite>- Sarah Chen, 2023 Grant Recipient</cite>
                      </blockquote>
                    </div>
                  </div>

                  <div className="key-points">
                    <div className="point">
                      <span className="point-icon">🎯</span>
                      <h4>Purpose-Driven</h4>
                      <p>Clear path to achieving your goals with structured milestones and support systems</p>
                    </div>
                    <div className="point">
                      <span className="point-icon">💡</span>
                      <h4>Innovative</h4>
                      <p>Supporting creative solutions and unique approaches to personal development</p>
                    </div>
                    <div className="point">
                      <span className="point-icon">🤝</span>
                      <h4>Supportive</h4>
                      <p>Comprehensive guidance and mentorship throughout your journey</p>
                    </div>
                    <div className="point">
                      <span className="point-icon">🌟</span>
                      <h4>Excellence</h4>
                      <p>Commitment to achieving exceptional results and lasting impact</p>
                    </div>
                  </div>

                  <div className="impact-metrics">
                    <h3>Program Impact</h3>
                    <div className="metrics-grid">
                      <div className="metric-card">
                        <span className="metric-number">2.5x</span>
                        <span className="metric-label">Average Income Increase</span>
                      </div>
                      <div className="metric-card">
                        <span className="metric-number">89%</span>
                        <span className="metric-label">Career Advancement Rate</span>
                      </div>
                      <div className="metric-card">
                        <span className="metric-number">94%</span>
                        <span className="metric-label">Goal Achievement Rate</span>
                      </div>
                      <div className="metric-card">
                        <span className="metric-number">1200+</span>
                        <span className="metric-label">Community Projects</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'eligibility' && (
                <section className="content-section eligibility-section">
                  <h2>Eligibility Requirements</h2>
                  
                  <div className="eligibility-intro">
                    <p className="lead-text">Our program seeks motivated individuals who demonstrate both potential and need. Review our comprehensive eligibility criteria below.</p>
                  </div>

                  <div className="eligibility-grid">
                    <div className="eligibility-item">
                      <h3>Age Requirement</h3>
                      <p>Must be 18 years or older at the time of application</p>
                      <ul className="requirement-details">
                        <li>Valid government ID required</li>
                        <li>No upper age limit</li>
                        <li>Special youth programs available for 16-17 year olds</li>
                      </ul>
                    </div>
                    
                    <div className="eligibility-item">
                      <h3>Residency</h3>
                      <p>U.S. citizen or permanent resident</p>
                      <ul className="requirement-details">
                        <li>Proof of residency required</li>
                        <li>Current U.S. address needed</li>
                        <li>International student visas eligible</li>
                      </ul>
                    </div>

                    <div className="eligibility-item">
                      <h3>Project Plan</h3>
                      <p>Detailed development plan required</p>
                      <ul className="requirement-details">
                        <li>Clear objectives and timeline</li>
                        <li>Measurable outcomes</li>
                        <li>Resource allocation plan</li>
                        <li>Impact assessment</li>
                      </ul>
                    </div>

                    <div className="eligibility-item">
                      <h3>Financial Need</h3>
                      <p>Demonstrated financial necessity</p>
                      <ul className="requirement-details">
                        <li>Income verification required</li>
                        <li>Current financial obligations</li>
                        <li>Other funding sources</li>
                      </ul>
                    </div>
                  </div>

                  <div className="eligibility-note">
                    <h4>Special Considerations</h4>
                    <p>Additional weight given to:</p>
                    <ul>
                      <li>First-generation college students</li>
                      <li>Underrepresented communities</li>
                      <li>Innovation in proposed projects</li>
                      <li>Potential for community impact</li>
                    </ul>
                  </div>
                </section>
              )}

              {activeSection === 'benefits' && (
                <section className="content-section benefits-section">
                  <h2>Grant Benefits</h2>
                  
                  <div className="benefits-intro">
                    <p className="lead-text">Our comprehensive benefits package is designed to support your complete development journey, from financial assistance to professional growth opportunities.</p>
                  </div>

                  <div className="benefits-grid">
                    <div className="benefit-card">
                      <h3>Financial Support</h3>
                      <div className="benefit-icon">💰</div>
                      <ul>
                        <li>Direct funding up to $25,000</li>
                        <li>Flexible use of funds</li>
                        <li>No repayment required</li>
                        <li>Performance-based bonuses</li>
                      </ul>
                    </div>

                    <div className="benefit-card">
                      <h3>Professional Development</h3>
                      <div className="benefit-icon">👔</div>
                      <ul>
                        <li>One-on-one mentorship</li>
                        <li>Industry networking events</li>
                        <li>Skills workshops</li>
                        <li>Leadership training</li>
                      </ul>
                    </div>

                    <div className="benefit-card">
                      <h3>Educational Resources</h3>
                      <div className="benefit-icon">📚</div>
                      <ul>
                        <li>Online learning platform access</li>
                        <li>Digital library membership</li>
                        <li>Research databases</li>
                        <li>Study materials</li>
                      </ul>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'process' && (
                <section className="content-section process-section">
                  <h2>Application Process</h2>

                  <div className="process-intro">
                    <p className="lead-text">Our streamlined application process is designed to be thorough yet accessible. Follow these steps to apply for the grant.</p>
                  </div>

                  <div className="process-timeline">
                    <div className="timeline-item">
                      <div className="timeline-number">1</div>
                      <h3>Initial Application</h3>
                      <div className="timeline-content">
                        <p className="timeline-description">Submit basic information and project outline</p>
                        <div className="timeline-duration">
                          <span className="duration-icon">⏱️</span>
                          <span>Duration: 1-2 hours</span>
                        </div>
                      </div>
                    </div>

                    <div className="timeline-item">
                      <div className="timeline-number">2</div>
                      <h3>Detailed Proposal</h3>
                      <div className="timeline-content">
                        <p className="timeline-description">Present comprehensive development plan</p>
                        <div className="timeline-duration">
                          <span className="duration-icon">⏱️</span>
                          <span>Duration: 1-2 weeks</span>
                        </div>
                      </div>
                    </div>

                    <div className="timeline-item">
                      <div className="timeline-number">3</div>
                      <h3>Review Process</h3>
                      <div className="timeline-content">
                        <p className="timeline-description">Application evaluation by committee</p>
                        <div className="timeline-duration">
                          <span className="duration-icon">⏱️</span>
                          <span>Duration: 3-4 weeks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'resources' && (
                <section className="content-section resources-section">
                  <h2>Available Resources</h2>
                  
                  <div className="resources-intro">
                    <p className="lead-text">Access our comprehensive collection of resources designed to support your growth journey.</p>
                  </div>

                  <div className="resources-grid">
                    <div className="resource-category">
                      <h3>Learning Materials</h3>
                      <ul className="resource-list">
                        <li>Online courses library</li>
                        <li>Educational videos</li>
                        <li>Interactive tutorials</li>
                        <li>Study guides</li>
                      </ul>
                    </div>

                    <div className="resource-category">
                      <h3>Tools & Software</h3>
                      <ul className="resource-list">
                        <li>Project management tools</li>
                        <li>Design software</li>
                        <li>Development environments</li>
                        <li>Analytics tools</li>
                      </ul>
                    </div>

                    <div className="resource-category">
                      <h3>Support Services</h3>
                      <ul className="resource-list">
                        <li>24/7 technical support</li>
                        <li>Writing assistance</li>
                        <li>Career counseling</li>
                        <li>Mental health resources</li>
                      </ul>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'success' && (
                <section className="content-section success-section">
                  <h2>Success Stories</h2>
                  
                  <div className="success-intro">
                    <p className="lead-text">Discover how our grant recipients have transformed their lives and made lasting impacts in their communities.</p>
                  </div>

                  <div className="success-stories-grid">
                    <div className="success-story">
                      <div className="story-header">
                        <img src="/api/placeholder/150/150" alt="Sarah Chen" className="story-image" />
                        <div className="story-meta">
                          <h3>Sarah Chen</h3>
                          <p className="story-category">Educational Achievement</p>
                        </div>
                      </div>
                      <p className="story-quote">"The grant enabled me to complete my master's degree and launch an educational technology startup."</p>
                      <div className="story-impact">
                        <span className="impact-label">Impact:</span>
                        <p>Now helps over 1,000 students annually</p>
                      </div>
                    </div>

                    <div className="success-story">
                      <div className="story-header">
                      <img src="/api/placeholder/150/150" alt="Marcus Johnson" className="story-image" />
                      <div className="story-meta">
                        <h3>Marcus Johnson</h3>
                        <p className="story-category">Community Development</p>
                      </div>
                    </div>
                    <p className="story-quote">"I established a youth mentorship program that has transformed our local community."</p>
                    <div className="story-impact">
                      <span className="impact-label">Impact:</span>
                      <p>Mentored 500+ youth in 2 years</p>
                    </div>
                  </div>

                  <div className="success-story">
                    <div className="story-header">
                      <img src="/api/placeholder/150/150" alt="Maria Rodriguez" className="story-image" />
                      <div className="story-meta">
                        <h3>Maria Rodriguez</h3>
                        <p className="story-category">Professional Growth</p>
                      </div>
                    </div>
                    <p className="story-quote">"The professional development resources helped me transition into a leadership role."</p>
                    <div className="story-impact">
                      <span className="impact-label">Impact:</span>
                      <p>Promoted to Senior Director</p>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </main>

          <div className={`floating-cta ${showScrollTop ? 'show' : ''}`}>
            <button onClick={scrollToTop} className="scroll-top" aria-label="Scroll to top">↑</button>
            <Link to="/apply" className="apply-button">Apply Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalGrantPage;