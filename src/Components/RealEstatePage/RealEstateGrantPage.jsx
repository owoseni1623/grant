import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RealEstateGrantPage.css';

// Import images - add these at the top of your file
import urban1Image from '/public/Images/urban1.jpg';
import ruralImage from '/public/Images/rural.jpg';
import com1Image from '/public/Images/com.webp';

const RealEstateGrantPage = () => {
  const [activeSection, setActiveSection] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [showPropertyMap, setShowPropertyMap] = useState(false);

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

  const handleLearnMore = () => {
    const element = document.getElementById('grant-details');
    element.scrollIntoView({ behavior: 'smooth' });
  };

  const successStories = [
    {
      title: "Urban Revitalization Project",
      organization: "City Renewal Foundation",
      impact: "Transformed 10 abandoned properties into affordable housing",
      grant: "$750,000",
      image: urban1Image
    },
    {
      title: "Rural Housing Initiative",
      organization: "Homestead Hope",
      impact: "Developed sustainable housing for 50 low-income families",
      grant: "$500,000",
      image: ruralImage
    },
    {
      title: "Community Land Trust",
      organization: "Neighborhood Foundations",
      impact: "Created permanent affordable housing model in urban center",
      grant: "$1.2M",
      image: com1Image
    }
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="real-estate-grant-page">
      {/* Hero Section with Advanced Animations */}
        <header className="hero001">
            <div className="hero-content001"></div>
                <div className="hero-text-animation001">
                    <h1>Real Estate Community Development Grant</h1>
                    <p className="hero-subtitle">Transforming Spaces, Empowering Communities</p>
                    
                    <div className="grant-statistics">
                        <div className="stat-block">
                            <span className="stat-number">$10M</span>
                            <span className="stat-label">Total Funding Pool</span>
                        </div>
                        <div className="stat-block">
                            <span className="stat-number">75+</span>
                            <span className="stat-label">Projects Funded</span>
                        </div>
                        <div className="stat-block">
                            <span className="stat-number">36</span>
                            <span className="stat-label">Months Duration</span>
                        </div>
                    </div>

                    <div className="cta-group">
                      <button className="primary-cta" onClick={handleLearnMore}>
                          Learn More
                      </button>
                      <Link to="/apply" className="secondary-cta">
                          Apply Now
                      </Link>
                    </div>
                </div>
        </header>

      {/* Innovative Impact Areas */}
      <section className="impact-zones">
        <h2>Real Estate Grant Impact Areas</h2>
        <div className="impact-grid">
          {[
            {
              icon: '🏘️',
              title: 'Affordable Housing',
              description: 'Creating sustainable, accessible housing solutions',
              highlights: [
                'Low-income housing',
                'Senior living developments',
                'Mixed-income communities'
              ]
            },
            {
              icon: '🏗️',
              title: 'Urban Regeneration',
              description: 'Revitalizing neglected urban spaces',
              highlights: [
                'Brownfield redevelopment',
                'Historic preservation',
                'Community infrastructure'
              ]
            },
            {
              icon: '🌿',
              title: 'Sustainable Development',
              description: 'Eco-friendly and resilient housing models',
              highlights: [
                'Green building standards',
                'Energy-efficient designs',
                'Climate-resilient construction'
              ]
            },
            {
              icon: '🤝',
              title: 'Community Empowerment',
              description: 'Supporting local real estate ecosystems',
              highlights: [
                'Community land trusts',
                'First-time homeowner support',
                'Micro-development programs'
              ]
            }
          ].map((zone, index) => (
            <div key={index} className="impact-card">
              <div className="impact-icon">{zone.icon}</div>
              <h3>{zone.title}</h3>
              <p>{zone.description}</p>
              <ul>
                {zone.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Application Process */}
      <section className="application-workflow">
        <h2>Grant Application Journey</h2>
        <div className="workflow-timeline">
          {[
            {
              title: "Initial Consultation",
              description: "Schedule a comprehensive project consultation",
              steps: [
                "Free 1-hour consultation",
                "Project scope assessment",
                "Eligibility verification"
              ]
            },
            {
              title: "Proposal Development",
              description: "Craft a compelling and detailed project proposal",
              steps: [
                "Detailed project blueprint",
                "Financial projections",
                "Community impact analysis"
              ]
            },
            {
              title: "Technical Review",
              description: "Rigorous evaluation of project feasibility",
              steps: [
                "Expert panel review",
                "Site feasibility study",
                "Financial sustainability check"
              ]
            },
            {
              title: "Final Selection",
              description: "Comprehensive project selection process",
              steps: [
                "Committee deliberation",
                "Site visits",
                "Final grant allocation"
              ]
            }
          ].map((stage, index) => (
            <div key={index} className="workflow-stage">
              <div className="stage-number">{index + 1}</div>
              <div className="stage-content">
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
                <ul>
                  {stage.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories Showcase */}
      <section className="success-stories">
        <h2>Transformative Project Highlights</h2>
        <div className="stories-carousel">
          {successStories.map((story, index) => (
            <div key={index} className="story-card">
              <div className="story-image">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="story-img"
                />
              </div>
              <div className="story-details">
                <h3>{story.title}</h3>
                <h4>{story.organization}</h4>
                <p>{story.impact}</p>
                <div className="story-footer">
                  <span className="grant-amount">{story.grant}</span>
                  <button>Explore Project</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advanced FAQ Section */}
      <section className="advanced-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          {[
            {
              question: "What types of real estate projects qualify?",
              answer: "We support residential, commercial, and mixed-use development projects that demonstrate significant community impact and sustainable design principles."
            },
            {
              question: "How much funding is available?",
              answer: "Grants range from $100,000 to $1,000,000, with funding decisions based on project scope, innovation, and potential community transformation."
            },
            {
              question: "What are the key evaluation criteria?",
              answer: "Projects are assessed on community need, financial sustainability, innovative design, environmental considerations, and long-term social impact."
            }
          ].map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeAccordion === index ? 'expanded' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq-header">
                <h3>{faq.question}</h3>
                <span className="toggle-icon">+</span>
              </div>
              {activeAccordion === index && (
                <div className="faq-body">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact and Support */}
      <section className="contact-support">
        <div className="support-grid">
          <div className="support-card">
            <div className="support-icon">📞</div>
            <h3>Direct Consultation</h3>
            <p>1-888-REALGRANT</p>
            <p>Expert Guidance Available</p>
          </div>
          <div className="support-card">
            <div className="support-icon">💬</div>
            <h3>Online Support</h3>
            <p>24/7 Application Helpdesk</p>
            <p>Instant Query Resolution</p>
          </div>
          <div className="support-card">
            <div className="support-icon">📧</div>
            <h3>Email Support</h3>
            <p>grants@realestate.org</p>
            <p>48-Hour Response Guarantee</p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="final-cta">
        <h2>Your Community Transformation Starts Here</h2>
        <p>Innovative Real Estate Projects. Sustainable Community Development.</p>
        <div className="cta-button-011">
          <Link to="/apply" className="primary-action-011">
              Start Your Application
          </Link>
          <button className="secondary-action-011">Download Guidebook</button>
        </div>
      </section>

      {/* Scroll to Top */}
      <button 
        className={`scroll-top ${isVisible ? 'visible' : ''}`} 
        onClick={scrollToTop}
      >
        ↑
      </button>
    </div>
  );
};

export default RealEstateGrantPage;