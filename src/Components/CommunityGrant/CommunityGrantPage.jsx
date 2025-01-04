import React, { useState, useEffect } from 'react';
import './CommunityGrantPage.css';


import workImage from '/public/Images/work.png';
import eduImage from '/public/Images/edu.jpeg';
import careImage from '/public/Images/care.jpeg';

const CommunityGrantPage = () => {
  const [activeSection, setActiveSection] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [showSuccessStories, setShowSuccessStories] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    const scrolled = window.scrollY;
    if (scrolled > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLearnMore = () => {
    const element = document.getElementById('grant-details');
    element.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const successStories = [
    {
      title: "Green Community Initiative",
      organization: "EcoTech Solutions",
      impact: "Transformed 5 urban spaces into sustainable community gardens",
      grant: "$250,000",
      image: workImage
    },
    {
      title: "Youth Tech Education Program",
      organization: "Future Leaders Institute",
      impact: "Trained 500+ students in coding and digital skills",
      grant: "$350,000",
      image: eduImage
    },
    {
      title: "Senior Care Innovation",
      organization: "Golden Years Foundation",
      impact: "Developed telehealth platform serving 1000+ seniors",
      grant: "$400,000",
      image: careImage
    }
  ];

  return (
    <div className="grant-page">
      {/* Enhanced Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="hero-text-animation">
            <h1>Community Development Grant Program 2024</h1>
            <p className="hero-subtitle">Empowering Communities, Building Future</p>
            <div className="grant-highlights">
              <div className="highlight">
                <span className="highlight-number">$2.5M</span>
                <span className="highlight-text">Maximum Grant</span>
              </div>
              <div className="highlight">
                <span className="highlight-number">100+</span>
                <span className="highlight-text">Projects Funded</span>
              </div>
              <div className="highlight">
                <span className="highlight-number">24</span>
                <span className="highlight-text">Month Duration</span>
              </div>
            </div>
            <div className="cta-buttons">
              <button className="primary-btn pulse" onClick={handleLearnMore}>
                Learn More
              </button>
              <a href="/apply" className="secondary-btn glow">
                Apply Now
              </a>
            </div>
          </div>
          <div className="hero-image">
            {/* Add hero image or animation here */}
          </div>
        </div>
      </header>

      {/* Enhanced Grant Overview */}
      <section id="grant-details" className="grant-overview">
        <h2 className="section-title">Grant Overview</h2>
        <div className="info-cards">
          <div className="info-card hover-effect">
            <div className="icon rotating">💰</div>
            <h3>Grant Amount</h3>
            <p>Up to $500,000 per project</p>
            <ul className="card-details">
              <li>Minimum grant: $50,000</li>
              <li>Average award: $250,000</li>
              <li>Multi-year funding available</li>
              <li>Performance-based installments</li>
            </ul>
          </div>
          <div className="info-card hover-effect">
            <div className="icon rotating">📅</div>
            <h3>Important Dates</h3>
            <p>Next Deadline: December 31, 2024</p>
            <ul className="card-details">
              <li>Application Opens: July 1, 2024</li>
              <li>Early Bird Deadline: October 31, 2024</li>
              <li>Review Period: January 2025</li>
              <li>Project Start: March 2025</li>
            </ul>
          </div>
          <div className="info-card hover-effect">
            <div className="icon rotating">⏱️</div>
            <h3>Project Duration</h3>
            <p>12-24 months implementation</p>
            <ul className="card-details">
              <li>Planning phase: 1-2 months</li>
              <li>Implementation: 12-24 months</li>
              <li>Evaluation period: 3 months</li>
              <li>Extension possible</li>
            </ul>
          </div>
        </div>
      </section>

      {/* New Impact Areas Section */}
      <section className="impact-areas">
        <h2 className="section-title">Impact Areas</h2>
        <div className="impact-grid">
          <div className="impact-card">
            <div className="impact-icon">🌱</div>
            <h3>Environmental Sustainability</h3>
            <ul>
              <li>Renewable Energy Projects</li>
              <li>Waste Management Solutions</li>
              <li>Green Space Development</li>
              <li>Climate Action Initiatives</li>
            </ul>
          </div>
          <div className="impact-card">
            <div className="impact-icon">📚</div>
            <h3>Education & Skills</h3>
            <ul>
              <li>STEM Education Programs</li>
              <li>Vocational Training</li>
              <li>Digital Literacy</li>
              <li>Adult Education</li>
            </ul>
          </div>
          <div className="impact-card">
            <div className="impact-icon">🏘️</div>
            <h3>Community Development</h3>
            <ul>
              <li>Affordable Housing</li>
              <li>Public Space Improvement</li>
              <li>Community Centers</li>
              <li>Infrastructure Projects</li>
            </ul>
          </div>
          <div className="impact-card">
            <div className="impact-icon">💪</div>
            <h3>Social Innovation</h3>
            <ul>
              <li>Mental Health Services</li>
              <li>Youth Empowerment</li>
              <li>Senior Support Programs</li>
              <li>Disability Services</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Enhanced Interactive Sections */}
      <section className="interactive-content">
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeSection === 1 ? 'active' : ''}`}
              onClick={() => setActiveSection(1)}
            >
              Eligibility
            </button>
            <button 
              className={`tab ${activeSection === 2 ? 'active' : ''}`}
              onClick={() => setActiveSection(2)}
            >
              Focus Areas
            </button>
            <button 
              className={`tab ${activeSection === 3 ? 'active' : ''}`}
              onClick={() => setActiveSection(3)}
            >
              Requirements
            </button>
            <button 
              className={`tab ${activeSection === 4 ? 'active' : ''}`}
              onClick={() => setActiveSection(4)}
            >
              Evaluation Criteria
            </button>
          </div>

          <div className="tab-content">
            {activeSection === 1 && (
              <div className="content-section fade-in">
                <h3>Who Can Apply?</h3>
                <div className="eligibility-grid">
                  <div className="eligibility-item">
                    <h4>Non-profit Organizations</h4>
                    <ul>
                      <li>Registered 501(c)(3) organizations</li>
                      <li>Minimum 2 years of operation</li>
                      <li>Clean audit history</li>
                      <li>Board of Directors in place</li>
                    </ul>
                  </div>
                  <div className="eligibility-item">
                    <h4>Government Agencies</h4>
                    <ul>
                      <li>Local government departments</li>
                      <li>Public institutions</li>
                      <li>State agencies</li>
                      <li>Municipal corporations</li>
                    </ul>
                  </div>
                  <div className="eligibility-item">
                    <h4>Educational Institutions</h4>
                    <ul>
                      <li>Public schools</li>
                      <li>Universities</li>
                      <li>Research institutions</li>
                      <li>Educational nonprofits</li>
                    </ul>
                  </div>
                  <div className="eligibility-item">
                    <h4>Community Organizations</h4>
                    <ul>
                      <li>Community-based organizations</li>
                      <li>Social enterprises</li>
                      <li>Grassroots organizations</li>
                      <li>Collaborative partnerships</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {activeSection === 2 && (
              <div className="content-section fade-in">
                <h3>Focus Areas</h3>
                <div className="focus-areas-container">
                  <div className="focus-area">
                    <h4>Community Infrastructure</h4>
                    <p>Projects that improve physical infrastructure and community facilities</p>
                    <ul>
                      <li>Public space development</li>
                      <li>Accessibility improvements</li>
                      <li>Community centers</li>
                      <li>Transportation solutions</li>
                    </ul>
                  </div>
                  <div className="focus-area">
                    <h4>Education & Youth</h4>
                    <p>Programs focused on education and youth development</p>
                    <ul>
                      <li>After-school programs</li>
                      <li>STEM education</li>
                      <li>Mentorship initiatives</li>
                      <li>Career development</li>
                    </ul>
                  </div>
                  <div className="focus-area">
                    <h4>Economic Development</h4>
                    <p>Initiatives supporting local economic growth</p>
                    <ul>
                      <li>Job training programs</li>
                      <li>Small business support</li>
                      <li>Entrepreneurship education</li>
                      <li>Innovation hubs</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {activeSection === 3 && (
              <div className="content-section fade-in">
                <h3>Application Requirements</h3>
                <div className="requirements-grid">
                  <div className="requirement-category">
                    <h4>Project Proposal</h4>
                    <ul>
                      <li>Executive summary</li>
                      <li>Problem statement</li>
                      <li>Project objectives</li>
                      <li>Implementation plan</li>
                      <li>Expected outcomes</li>
                      <li>Sustainability plan</li>
                    </ul>
                  </div>
                  <div className="requirement-category">
                    <h4>Financial Documents</h4>
                    <ul>
                      <li>Detailed budget</li>
                      <li>Financial statements</li>
                      <li>Audit reports</li>
                      <li>Tax returns</li>
                      <li>Funding sources</li>
                      <li>Cost breakdown</li>
                    </ul>
                  </div>
                  <div className="requirement-category">
                    <h4>Organization Documents</h4>
                    <ul>
                      <li>Registration certificate</li>
                      <li>Board list</li>
                      <li>Annual reports</li>
                      <li>Staff qualifications</li>
                      <li>Partner agreements</li>
                      <li>Previous grants</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {activeSection === 4 && (
              <div className="content-section fade-in">
                <h3>Evaluation Criteria</h3>
                <div className="evaluation-matrix">
                  <div className="evaluation-category">
                    <h4>Impact (40%)</h4>
                    <ul>
                      <li>Community benefit</li>
                      <li>Number of beneficiaries</li>
                      <li>Long-term effects</li>
                      <li>Innovation level</li>
                    </ul>
                  </div>
                  <div className="evaluation-category">
                    <h4>Feasibility (30%)</h4>
                    <ul>
                      <li>Technical viability</li>
                      <li>Resource allocation</li>
                      <li>Timeline realism</li>
                      <li>Risk management</li>
                    </ul>
                  </div>
                  <div className="evaluation-category">
                    <h4>Sustainability (30%)</h4>
                    <ul>
                      <li>Financial sustainability</li>
                      <li>Community engagement</li>
                      <li>Partnership strength</li>
                      <li>Future planning</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Success Stories Carousel */}
      <section className="success-stories">
  <h2 className="section-title">Success Stories</h2>
  <div className="stories-container">
    {successStories.map((story, index) => (
      <div key={index} className="story-card">
        <div className="story-image">
          {/* Use the story.image as the src */}
          <img src={story.image} alt={story.title} />
        </div>
        <div className="story-content">
          <h3>{story.title}</h3>
          <h4>{story.organization}</h4>
          <p className="impact">{story.impact}</p>
          <p className="grant-amount">Grant Amount: {story.grant}</p>
          <button className="read-more-btn">Read Full Story</button>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Enhanced Application Process */}
      <section className="application-process">
        <h2 className="section-title">Application Process</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-content">
              <div className="step-number">1</div>
              <h4>Review Guidelines</h4>
              <p>Carefully read all grant requirements and eligibility criteria</p>
              <ul className="process-details">
                <li>Download program guidelines</li>
                <li>Review evaluation criteria</li>
                <li>Check eligibility requirements</li>
                <li>Note important deadlines</li>
              </ul>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-content">
              <div className="step-number">2</div>
              <h4>Register Interest</h4>
              <p>Submit initial expression of interest</p>
              <ul className="process-details">
                <li>Create online account</li>
                <li>Complete organization profile</li>
                <li>Submit letter of intent</li>
                <li>Receive confirmation</li>
              </ul>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-content">
              <div className="step-number">3</div>
              <h4>Prepare Documents</h4>
              <p>Gather all required documentation and complete forms</p>
              <ul className="process-details">
                <li>Collect organizational documents</li>
                <li>Prepare project narrative</li>
                <li>Develop detailed budget</li>
                <li>Secure partnership letters</li>
              </ul>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-content">
              <div className="step-number">4</div>
              <h4>Submit Application</h4>
              <p>Complete the online application with supporting materials</p>
              <ul className="process-details">
                <li>Fill application form</li>
                <li>Upload documents</li>
                <li>Review submission</li>
                <li>Submit final application</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          {[
            {
              question: "How are grant amounts determined?",
              answer: "Grant amounts are determined based on project scope, potential impact, organizational capacity, and available funding. We consider factors such as project budget, timeline, and expected outcomes."
            },
            {
              question: "Can organizations submit multiple applications?",
              answer: "Organizations may submit up to two applications per grant cycle, but they must be for distinct projects with different objectives and outcomes."
            },
            {
              question: "What is the review process?",
              answer: "Applications undergo a three-stage review: initial screening for eligibility, technical review by subject matter experts, and final evaluation by the grant committee."
            },
            {
              question: "Is matching funding required?",
              answer: "While not required, applications demonstrating matching funds or in-kind contributions may receive additional consideration during evaluation."
            }
          ].map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeAccordion === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq-question">
                <h4>{faq.question}</h4>
                <span className="accordion-icon"></span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2 className="section-title">Need Help?</h2>
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">📧</div>
            <h4>Email Support</h4>
            <p>grants@example.com</p>
            <p>Response within 24 hours</p>
          </div>
          <div className="contact-card">
            <div className="contact-icon">📞</div>
            <h4>Phone Support</h4>
            <p>1-800-GRANTS</p>
            <p>Mon-Fri, 9AM-5PM EST</p>
          </div>
          <div className="contact-card">
            <div className="contact-icon">💬</div>
            <h4>Live Chat</h4>
            <p>Available on website</p>
            <p>24/7 Support</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>Ready to Make an Impact?</h2>
          <p>Join us in building stronger communities through innovative projects.</p>
          <div className="cta-buttons">
            <a href="/apply" className="apply-btn pulse">Start Your Application</a>
            <button className="schedule-call-btn">Schedule Consultation</button>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button 
        className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
        onClick={scrollToTop}
      >
        ↑
      </button>
    </div>
  );
};

export default CommunityGrantPage;