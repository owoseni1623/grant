import React, { useState, useEffect, useRef } from 'react';
import './InnovationGrantsPage.css';

const InnovationGrantsPage = () => {
  const [activeSection, setActiveSection] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [animateStats, setAnimateStats] = useState(false);

  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateStats(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
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

  const successStories = [
    {
      title: "AI-Driven Healthcare Solution",
      organization: "MedTech Innovations",
      impact: "Developed predictive diagnostic algorithm reducing diagnostic time by 70%",
      grant: "$750,000",
      image: "/success-story-1.jpg"
    },
    {
      title: "Sustainable Energy Breakthrough",
      organization: "GreenTech Pioneers",
      impact: "Created novel solar storage technology increasing efficiency by 45%",
      grant: "$1.2M",
      image: "/success-story-2.jpg"
    },
    {
      title: "EdTech Personalization Platform",
      organization: "Learning Dynamics",
      impact: "Developed AI-powered adaptive learning system for personalized education",
      grant: "$600,000",
      image: "/success-story-3.jpg"
    }
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="innovation-grants-page">
      {/* Enhanced Hero Section with Dynamic Background */}
      <header className="hero-innovative">
        <div className="hero-content">
          <div className="hero-overlay"></div>
          <div className="hero-text">
            <h1>Breakthrough Innovation Grants 2024</h1>
            <p className="hero-subtitle">Transforming Visionary Ideas into World-Changing Solutions</p>
            
            <div className="hero-stats" ref={statsRef}>
              <div className={`stat ${animateStats ? 'animate' : ''}`}>
                <span className="stat-number">$10M+</span>
                <span className="stat-label">Total Funding Pool</span>
              </div>
              <div className={`stat ${animateStats ? 'animate' : ''}`}>
                <span className="stat-number">50+</span>
                <span className="stat-label">Cutting-Edge Projects</span>
              </div>
              <div className={`stat ${animateStats ? 'animate' : ''}`}>
                <span className="stat-number">36</span>
                <span className="stat-label">Months Support</span>
              </div>
            </div>

            <div className="cta-buttons">
              <a href="/apply" className="primary-btn">
                Apply for Grant
              </a>
              <a href="/webinar" className="secondary-btn">
                Upcoming Webinar
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Innovation Focus Areas */}
      <section className="innovation-focus-areas">
        <h2>Innovation Domains</h2>
        <div className="focus-grid">
          <div className="focus-card">
            <div className="focus-icon">🧠</div>
            <h3>Deep Tech</h3>
            <ul>
              <li>Quantum Computing</li>
              <li>Advanced AI</li>
              <li>Neuromorphic Engineering</li>
              <li>Biotechnology</li>
            </ul>
          </div>
          <div className="focus-card">
            <div className="focus-icon">🌍</div>
            <h3>Climate Solutions</h3>
            <ul>
              <li>Carbon Capture</li>
              <li>Renewable Energy</li>
              <li>Sustainable Materials</li>
              <li>Environmental Tech</li>
            </ul>
          </div>
          <div className="focus-card">
            <div className="focus-icon">🏥</div>
            <h3>Health Innovation</h3>
            <ul>
              <li>Precision Medicine</li>
              <li>Digital Health</li>
              <li>Bioengineering</li>
              <li>Medical AI</li>
            </ul>
          </div>
          <div className="focus-card">
            <div className="focus-icon">🌐</div>
            <h3>Social Impact Tech</h3>
            <ul>
              <li>Inclusive Technologies</li>
              <li>Educational Platforms</li>
              <li>Accessibility Solutions</li>
              <li>Community Empowerment</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Unique Interactive Section */}
      <section className="grant-mechanics">
        <h2>Grant Mechanics</h2>
        <div className="mechanics-timeline">
          {[
            {
              title: "Concept Pitch",
              description: "Submit a groundbreaking innovation concept",
              icon: "💡"
            },
            {
              title: "Expert Evaluation",
              description: "Rigorous assessment by industry leaders",
              icon: "🔬"
            },
            {
              title: "Rapid Prototyping",
              description: "Seed funding for initial prototype development",
              icon: "🚀"
            },
            {
              title: "Scaled Funding",
              description: "Progressive funding based on milestones",
              icon: "📈"
            }
          ].map((stage, index) => (
            <div key={index} className="timeline-stage">
              <div className="stage-icon">{stage.icon}</div>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories Carousel with More Dynamic Design */}
      <section className="success-stories-innovative">
        <h2>Breakthrough Success Stories</h2>
        <div className="stories-carousel">
          {successStories.map((story, index) => (
            <div key={index} className="story-card">
              <div className="story-header">
                <h3>{story.title}</h3>
                <span className="grant-badge">{story.grant}</span>
              </div>
              <div className="story-body">
                <div className="story-organization">{story.organization}</div>
                <p className="story-impact">{story.impact}</p>
                <a href="#" className="read-more">Explore Impact →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comprehensive FAQ Section */}
      <section className="faq-section-innovative">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          {[
            {
              question: "What makes an innovative proposal stand out?",
              answer: "We seek transformative ideas with clear technological advancement, scalable impact, and potential to solve significant global challenges."
            },
            {
              question: "Are there restrictions on team composition?",
              answer: "We welcome diverse teams from academia, startups, research institutions. Multidisciplinary teams are strongly encouraged."
            },
            {
              question: "How competitive is the grant process?",
              answer: "Highly competitive. Less than 5% of applications are selected. Focus on originality, technical feasibility, and potential societal impact."
            }
          ].map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeAccordion === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq-question">
                <h4>{faq.question}</h4>
                <span className="accordion-icon">+</span>
              </div>
              {activeAccordion === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="final-cta-innovative">
        <div className="cta-content">
          <h2>Your Innovation Could Change the World</h2>
          <p>Don't let groundbreaking ideas remain unexplored. Apply now and unlock your potential.</p>
          <div className="cta-buttons">
            <a href="/apply" className="apply-btn">Start Application</a>
            <a href="/info-session" className="info-session-btn">Join Info Session</a>
          </div>
        </div>
      </section>

      {/* Scroll to Top */}
      <button 
        className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
        onClick={scrollToTop}
      >
        ↑
      </button>
    </div>
  );
};

export default InnovationGrantsPage;