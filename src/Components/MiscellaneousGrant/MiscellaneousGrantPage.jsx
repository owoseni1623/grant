import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './MiscellaneousGrantPage.css';

const MiscellaneousGrantPage = () => {
  const [activeSection, setActiveSection] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [animateCounters, setAnimateCounters] = useState(false);
  const [direction, setDirection] = useState('right');
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const slidesPerView = 3;

  // Refs for counter animation
  const grantTotalRef = useRef(null);
  const projectsRef = useRef(null);
  const impactRef = useRef(null);

  // Responsive slide calculation
const handleResize = useCallback(() => {
  if (window.innerWidth < 768) {
    setSlidesPerView(1);
  } else if (window.innerWidth < 1024) {
    setSlidesPerView(2);
  } else {
    setSlidesPerView(3);
  }
}, []);

  // Add event listener in useEffect
  useEffect(() => {
    // Initial resize
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);
  

  const innovationStories = [
    {
      title: "Rural Telemedicine Breakthrough",
      organization: "HealthConnect America",
      impact: "Revolutionized healthcare access for 500,000+ rural Americans by developing AI-powered remote diagnostic platforms, reducing medical travel costs and improving early disease detection",
      grant: "$1.5M",
      image: "/Images/grannt4.webp"
    },
    {
      title: "Climate Adaptation for Coastal Communities",
      organization: "Resilient Shorelines Institute",
      impact: "Developed cutting-edge flood mitigation technologies protecting 12 vulnerable coastal cities, creating adaptive infrastructure that saves an estimated $250M in potential damage annually",
      grant: "$2.3M",
      image: "/Images/grannt5.jpg"
    },
    {
      title: "Digital Equity in Education",
      organization: "TechBridge Learning",
      impact: "Provided comprehensive digital learning resources to 75,000 students in low-income communities, including free devices, high-speed internet access, and personalized online learning platforms",
      grant: "$1.8M",
      image: "/Images/grannt66.png"
    },
    {
      title: "Sustainable Urban Agriculture Network",
      organization: "Green City Solutions",
      impact: "Implemented vertical farming technologies in 10 major cities, creating 3,000 local jobs and generating 2.5 million pounds of fresh produce annually in food desert regions",
      grant: "$1.4M",
      image: "/Images/grant.webp"
    },
    {
      title: "AI-Powered Veteran Mental Health Support",
      organization: "Warrior Wellness Technologies",
      impact: "Developed an innovative AI counseling platform that provides 24/7 mental health support for veterans, with personalized intervention strategies and crisis management tools",
      grant: "$1.2M",
      image: "/Images/grannt7.jpg"
    },
    {
      title: "Clean Energy Innovation Lab",
      organization: "NextGen Power Solutions",
      impact: "Created breakthrough solar and wind energy technologies reducing carbon emissions by 450,000 tons annually, with potential to power over 100,000 homes in rural and urban communities",
      grant: "$2.6M",
      image: "/Images/grannt8.webp"
    },
    {
      title: "Cybersecurity Education for Small Businesses",
      organization: "Digital Shield Alliance",
      impact: "Developed comprehensive cybersecurity training and tools for 50,000 small businesses, protecting local economies from potential cyber threats and data breaches",
      grant: "$1.1M",
      image: "/Images/grant3.jpeg"
    },
    {
      title: "Advanced Mobility for Disabled Americans",
      organization: "AccessTech Innovations",
      impact: "Engineered AI-driven assistive technologies enabling greater independence for 75,000 Americans with mobility challenges, including smart prosthetics and adaptive transportation solutions",
      grant: "$1.7M",
      image: "/Images/grant4.jpg"
    },
    {
      title: "Rural Broadband Connectivity Project",
      organization: "Connect America Network",
      impact: "Extended high-speed internet access to 250,000 rural households, bridging the digital divide and creating economic opportunities in underserved regions",
      grant: "$2.1M",
      image: "/Images/grant5.jpg"
    },
    {
      title: "AI-Enhanced Early Childhood Education",
      organization: "Future Learners Institute",
      impact: "Developed personalized learning platforms using AI to support early childhood education, benefiting 100,000 children in disadvantaged communities with adaptive learning technologies",
      grant: "$1.6M",
      image: "/Images/grant6.jpg"
    }
];

const getVisibleStories = useCallback(() => {
  const start = currentIndex * slidesPerView;
  return innovationStories.slice(start, start + slidesPerView);
}, [currentIndex]);

const handleNextSlide = () => {
  const maxIndex = Math.ceil(innovationStories.length / slidesPerView) - 1;
  setCurrentIndex(prev => prev < maxIndex ? prev + 1 : 0);
};

const handlePrevSlide = () => {
  const maxIndex = Math.ceil(innovationStories.length / slidesPerView) - 1;
  setCurrentIndex(prev => prev > 0 ? prev - 1 : maxIndex);
};



// Auto-slide effect
useEffect(() => {
  const autoSlideInterval = setInterval(handleNextSlide, 5000);
  return () => clearInterval(autoSlideInterval);
}, [slidesPerView]);

// Resize event listener
useEffect(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [handleResize]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setAnimateCounters(true);
            startCounterAnimation();
          }
        });
      },
      { threshold: 0.5 }
    );

    const counterElements = [grantTotalRef.current, projectsRef.current, impactRef.current];
    counterElements.forEach(el => el && observer.observe(el));

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      counterElements.forEach(el => el && observer.unobserve(el));
    };
  }, []);

  const startCounterAnimation = () => {
    const animateCounter = (ref, endValue) => {
      const element = ref.current;
      if (!element) return;

      let start = 0;
      const duration = 2000;
      const step = (endValue / duration) * 10;

      const updateCounter = () => {
        start += step;
        if (start < endValue) {
          element.textContent = Math.round(start).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = endValue.toLocaleString();
        }
      };

      requestAnimationFrame(updateCounter);
    };

    animateCounter(grantTotalRef, 5000000);
    animateCounter(projectsRef, 250);
    animateCounter(impactRef, 100000);
  };

  const handleScroll = () => {
    const scrolled = window.scrollY;
    setIsVisible(scrolled > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };


  useEffect(() => {
    const autoSlideInterval = setInterval(() => {
      handleNextSlide();
    }, 5000);

    return () => clearInterval(autoSlideInterval);
  }, [handleNextSlide]);

  // Responsive slide count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="miscellaneous-grant-page">
      {/* Enhanced Hero Section */}
        <header className="hero-section0">
            <div className="hero-content">
                <div className="hero-text">
                    <h1>Innovative Grants: Transforming Possibilities</h1>
                    <p className="hero-subtitle">Empowering Visionary Projects Across Domains</p>
                    
                    <div className="impact-counters">
                    <div className="counter-item">
                        <span ref={grantTotalRef} className="counter-number">0</span>
                        <span className="counter-label">Total Grant Funding</span>
                    </div>
                    <div className="counter-item">
                        <span ref={projectsRef} className="counter-number">0</span>
                        <span className="counter-label">Funded Projects</span>
                    </div>
                    <div className="counter-item">
                        <span ref={impactRef} className="counter-number">0</span>
                        <span className="counter-label">People Impacted</span>
                    </div>
                    </div>

                    <div className="cta-buttons">
                        <a href="/apply" className="secondary-btn">
                            Apply Now
                        </a>
                        <button className="primary-btn">Explore Opportunities</button>
                    </div>
                </div>
                <div className="hero-visual">
                    {/* Interactive SVG or Animation Placeholder */}
                </div>
            </div>
        </header>

      {/* Unique Grant Categories */}
      <section className="grant-categories">
        <h2>Diverse Grant Categories</h2>
        <div className="category-grid">
          {[
            {
              icon: "🧠",
              title: "Research & Innovation",
              description: "Funding groundbreaking research across multiple disciplines"
            },
            {
              icon: "🌍",
              title: "Global Impact",
              description: "Supporting international development and humanitarian projects"
            },
            {
              icon: "🚀",
              title: "Emerging Technologies",
              description: "Accelerating cutting-edge technological advancements"
            },
            {
              icon: "🌈",
              title: "Social Innovation",
              description: "Driving transformative solutions for complex societal challenges"
            }
          ].map((category, index) => (
            <div key={index} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Evaluation Process */}
      <section className="evaluation-process">
        <h2>Our Comprehensive Evaluation Framework</h2>
        <div className="process-timeline">
          {[
            {
              title: "Initial Screening",
              description: "Automated assessment of basic eligibility and alignment",
              icon: "🔍"
            },
            {
              title: "Expert Review",
              description: "Detailed evaluation by domain specialists",
              icon: "👥"
            },
            {
              title: "Innovation Assessment",
              description: "Unique scoring for creativity and potential impact",
              icon: "💡"
            },
            {
              title: "Final Selection",
              description: "Holistic review by diverse grant committee",
              icon: "🏆"
            }
          ].map((stage, index) => (
            <div key={index} className="process-stage">
              <div className="stage-icon">{stage.icon}</div>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Innovation Stories Showcase */}

      <section className="innovation-stories">
      <h2>Breakthrough Project Spotlights</h2>
      <div className="slider-container">
        <div className="stories-carousel">
          {getVisibleStories().map((story, index) => (
            <div 
              key={index} 
              className="story-card" 
              style={{ 
                width: `${100 / slidesPerView}%`,
                display: 'inline-block',
                padding: '0 1rem',
                boxSizing: 'border-box'
              }}
            >
              <div className="story-image">
                <img 
                  src={story.image} 
                  alt={story.title} 
                  onError={(e) => {
                    e.target.src = '/placeholder-image.png';
                    e.target.onerror = null;
                  }}
                />
              </div>
              <div className="story-details">
                <h3>{story.title}</h3>
                <h4>{story.organization}</h4>
                <p className="impact-description">{story.impact}</p>
                <div className="story-footer">
                  <span className="grant-amount">{story.grant}</span>
                  <button className="read-more">Explore Impact</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="slider-navigation">
        <button 
          className="slider-btn slider-prev" 
          onClick={handlePrevSlide}
          aria-label="Previous Stories"
        >
          <ChevronLeft />
        </button>
        <button 
          className="slider-btn slider-next" 
          onClick={handleNextSlide}
          aria-label="Next Stories"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="slide-indicators">
        {Array.from({ length: Math.ceil(innovationStories.length / slidesPerView) }).map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>

      {/* FAQ Accordion */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-accordion">
          {[
            {
              question: "What makes our grants unique?",
              answer: "Our grants focus on interdisciplinary, high-potential projects that address complex global challenges through innovative approaches."
            },
            {
              question: "How competitive is the selection process?",
              answer: "We maintain a rigorous, merit-based selection process that evaluates projects based on innovation, potential impact, and scalability."
            },
            {
              question: "Can international organizations apply?",
              answer: "Yes! We welcome applications from global organizations with transformative project proposals that demonstrate significant potential for impact."
            }
          ].map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeAccordion === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq-header">
                <h3>{faq.question}</h3>
                <span className="accordion-icon">+</span>
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

      {/* Contact & Support */}
      <section className="contact-section">
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">📧</div>
            <h4>Email Support</h4>
            <p>grants@innovate.org</p>
            <p>24/7 Response Tracking</p>
          </div>
          <div className="contact-card">
            <div className="contact-icon">🌐</div>
            <h4>Virtual Consultation</h4>
            <p>Book Expert Session</p>
            <p>Personalized Guidance</p>
          </div>
          <div className="contact-card">
            <div className="contact-icon">💬</div>
            <h4>Community Forum</h4>
            <p>Connect with Grantees</p>
            <p>Share Insights</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>Your Innovative Project Awaits</h2>
          <p>Transform your visionary idea into reality with our comprehensive grant support</p>
          <div className="cta-button-011">
            <a href="/apply" className="primary-cta-011">
              Start Application
            </a>
            <button className="secondary-cta-011">Explore Resources</button>
          </div>
        </div>
      </section>

      {/* Scroll to Top */}
      {isVisible && (
        <button className="scroll-top" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default MiscellaneousGrantPage;