import React, { useState, useEffect } from 'react';
import './HomeImprovementGrantPage.css';

const HomeImprovementGrantPage = () => {
  const [activeSection, setActiveSection] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [formStep, setFormStep] = useState(1);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    const scrolled = window.scrollY;
    setIsVisible(scrolled > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const successStories = [
    {
      title: "Historic Home Restoration",
      homeowner: "Maria Rodriguez",
      location: "San Antonio, TX",
      details: "Restored 1920s craftsman home, preserving architectural heritage",
      grant: "$75,000",
      before: "/before-restoration.jpg",
      after: "/after-restoration.jpg"
    },
    {
      title: "Accessibility Transformation",
      homeowner: "James Thompson",
      location: "Chicago, IL",
      details: "Modified home for wheelchair accessibility and senior living",
      grant: "$65,000",
      before: "/before-accessibility.jpg",
      after: "/after-accessibility.jpg"
    },
    {
      title: "Energy Efficiency Upgrade",
      homeowner: "Emily Chen",
      location: "Seattle, WA", 
      details: "Implemented comprehensive green energy and insulation improvements",
      grant: "$85,000",
      before: "/before-energy.jpg",
      after: "/after-energy.jpg"
    }
  ];

  const handleNextStep = () => {
    if (formStep < 4) setFormStep(formStep + 1);
  };

  const handlePreviousStep = () => {
    if (formStep > 1) setFormStep(formStep - 1);
  };

  return (
    <div className="home-improvement-grant-page">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Home Transformation Grant Program 2024</h1>
            <p className="hero-subtitle">Revitalize Your Home, Enhance Your Community</p>
            
            <div className="grant-highlights">
              <div className="highlight">
                <span className="highlight-number">$100K</span>
                <span className="highlight-text">Maximum Grant</span>
              </div>
              <div className="highlight">
                <span className="highlight-number">500+</span>
                <span className="highlight-text">Homes Transformed</span>
              </div>
              <div className="highlight">
                <span className="highlight-number">18</span>
                <span className="highlight-text">Month Program</span>
              </div>
            </div>

            <div className="cta-buttons">
              <button className="primary-btn">Learn More</button>
              <a href="/apply" className="secondary-btn">
                  Start Application
              </a>
            </div>
          </div>
          <div className="hero-image">
            {/* Animated home transformation visual */}
          </div>
        </div>
      </header>

      {/* Grant Overview Section */}
      <section className="grant-overview">
        <h2>Grant Program Details</h2>
        <div className="overview-cards">
          <div className="overview-card">
            <div className="card-icon">🏠</div>
            <h3>Eligible Improvements</h3>
            <ul>
              <li>Structural Repairs</li>
              <li>Energy Efficiency</li>
              <li>Accessibility Modifications</li>
              <li>Historic Preservation</li>
            </ul>
          </div>
          <div className="overview-card">
            <div className="card-icon">💰</div>
            <h3>Financial Support</h3>
            <ul>
              <li>$25K - $100K Grants</li>
              <li>0% Interest Loans</li>
              <li>Tax Credit Assistance</li>
              <li>Flexible Repayment</li>
            </ul>
          </div>
          <div className="overview-card">
            <div className="card-icon">⏱️</div>
            <h3>Program Timeline</h3>
            <ul>
              <li>Application Open: July 2024</li>
              <li>Review Period: September</li>
              <li>Approvals: October</li>
              <li>Project Start: November</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Eligibility Section */}
      <section className="eligibility-section">
        <h2>Who Can Apply?</h2>
        <div className="eligibility-grid">
          <div className="eligibility-category">
            <h3>Homeowner Criteria</h3>
            <ul>
              <li>Primary Residence</li>
              <li>Low to Moderate Income</li>
              <li>Property Tax Compliance</li>
              <li>Good Standing Community Member</li>
            </ul>
          </div>
          <div className="eligibility-category">
            <h3>Property Requirements</h3>
            <ul>
              <li>Built Before 2000</li>
              <li>Primary Residential Use</li>
              <li>Structural Integrity</li>
              <li>Located in Designated Areas</li>
            </ul>
          </div>
          <div className="eligibility-category">
            <h3>Improvement Types</h3>
            <ul>
              <li>Safety Upgrades</li>
              <li>Accessibility Improvements</li>
              <li>Energy Conservation</li>
              <li>Essential Repairs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Detailed Application Process */}
      <section className="application-process">
        <h2>Application Journey</h2>
        <div className="process-steps">
          {[
            {
              title: "Initial Consultation",
              description: "Free consultation to assess project potential",
              icon: "🤝"
            },
            {
              title: "Documentation Preparation",
              description: "Gather required home and financial documents",
              icon: "📄"
            },
            {
              title: "Technical Assessment",
              description: "Professional evaluation of proposed improvements",
              icon: "🔬"
            },
            {
              title: "Funding Approval",
              description: "Review and final grant determination",
              icon: "💡"
            }
          ].map((step, index) => (
            <div key={index} className="process-step">
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories Carousel */}
      <section className="success-stories">
        <h2>Transformation Stories</h2>
        <div className="stories-carousel">
          {successStories.map((story, index) => (
            <div key={index} className="story-card">
              <div className="story-images">
                <div className="before-image">
                  <img src="/api/placeholder/300/200" alt="Before" />
                  <span>Before</span>
                </div>
                <div className="after-image">
                  <img src="/api/placeholder/300/200" alt="After" />
                  <span>After</span>
                </div>
              </div>
              <div className="story-details">
                <h3>{story.title}</h3>
                <p>Homeowner: {story.homeowner}</p>
                <p>Location: {story.location}</p>
                <p>{story.details}</p>
                <div className="grant-info">
                  <strong>Grant Awarded: {story.grant}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        {[
          {
            question: "What types of improvements are covered?",
            answer: "We cover structural repairs, energy efficiency upgrades, accessibility modifications, and essential home safety improvements."
          },
          {
            question: "How long does the approval process take?",
            answer: "The typical approval process takes 4-6 weeks from initial application to final decision."
          },
          {
            question: "Do I need to repay the grant?",
            answer: "Most grants do not require repayment if project specifications are met. Some may have partial repayment terms."
          },
          {
            question: "Can I apply if my home needs multiple improvements?",
            answer: "Yes! We encourage comprehensive home improvement plans that address multiple aspects of home functionality and efficiency."
          }
        ].map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeAccordion === index ? 'active' : ''}`}
            onClick={() => toggleAccordion(index)}
          >
            <div className="faq-question">
              <h3>{faq.question}</h3>
              <span className="accordion-icon">+</span>
            </div>
            {activeAccordion === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
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

export default HomeImprovementGrantPage;