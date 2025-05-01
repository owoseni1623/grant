import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Award, Users, Building, Book, BarChart, Shield, Search, Clock } from 'lucide-react';
import './GrantAboutUs.css'

const GrantAboutUs = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [visibleSection, setVisibleSection] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  
  const sections = useRef({});
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3,
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame to schedule state updates
          requestAnimationFrame(() => {
            setVisibleSection(entry.target.id);
          });
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Add passive event listeners for any scroll events
    const addPassiveEventListeners = () => {
      Object.values(sections.current).forEach(section => {
        if (section) {
          section.addEventListener('touchstart', () => {}, { passive: true });
          section.addEventListener('touchmove', () => {}, { passive: true });
          section.addEventListener('wheel', () => {}, { passive: true });
          observer.observe(section);
        }
      });
    };

    addPassiveEventListeners();

    return () => {
      // Cleanup listeners
      Object.values(sections.current).forEach(section => {
        if (section) {
          section.removeEventListener('touchstart', () => {});
          section.removeEventListener('touchmove', () => {});
          section.removeEventListener('wheel', () => {});
          observer.unobserve(section);
        }
      });
      observer.disconnect();
    };
  }, []);

  const governmentStats = [
    {
      number: "$650B+",
      label: "Annual Grant Funding",
      icon: <Award size={32} />,
      description: "Distributed across various federal programs"
    },
    {
      number: "280,000+",
      label: "Active Grants",
      icon: <Users size={32} />,
      description: "Supporting diverse initiatives nationwide"
    },
    {
      number: "50+",
      label: "Federal Agencies",
      icon: <Building size={32} />,
      description: "Collaborating to serve Americans"
    },
    {
      number: "1M+",
      label: "Beneficiaries",
      icon: <Users size={32} />,
      description: "Lives impacted through grant programs"
    }
  ];

  const pillars = [
    {
      icon: <Book size={32} />,
      title: "Education",
      description: "Supporting academic excellence through targeted funding initiatives",
      stats: ["$85B+ in education grants", "25,000+ institutions funded", "12M+ students impacted"]
    },
    {
      icon: <BarChart size={32} />,
      title: "Research",
      description: "Advancing scientific discovery and innovation across disciplines",
      stats: ["$120B+ in research funding", "15,000+ research projects", "100+ breakthrough discoveries"]
    },
    {
      icon: <Shield size={32} />,
      title: "Community",
      description: "Strengthening local communities through strategic investments",
      stats: ["$95B+ in community grants", "50,000+ communities served", "30M+ lives improved"]
    }
  ];

  const keyFeatures = [
    {
      icon: <Search size={32} />,
      title: "AI-Powered Grant Discovery",
      description: "Advanced machine learning algorithms match organizations with ideal opportunities",
      benefits: [
        "Personalized recommendations",
        "Real-time opportunity alerts",
        "Intelligent eligibility checking"
      ]
    },
    {
      icon: <Shield size={32} />,
      title: "Enterprise Security",
      description: "Bank-grade security protecting sensitive application data",
      benefits: [
        "End-to-end encryption",
        "Multi-factor authentication",
        "SOC 2 Type II certified"
      ]
    },
    {
      icon: <BarChart size={32} />,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into application performance",
      benefits: [
        "Real-time status tracking",
        "Success rate analytics",
        "Funding trend analysis"
      ]
    },
    {
      icon: <Clock size={32} />,
      title: "Automated Compliance",
      description: "Built-in tools ensuring complete regulatory compliance",
      benefits: [
        "Automatic requirement checking",
        "Deadline management",
        "Document verification"
      ]
    }
  ];

  const testimonials = [
    {
      quote: "Grant.gov transformed how we access federal funding opportunities.",
      author: "Dr. Sarah Chen",
      role: "Research Director",
      organization: "National Science Institute"
    },
    {
      quote: "The platform's AI-powered matching saved us countless hours in grant discovery.",
      author: "Michael Rodriguez",
      role: "Executive Director",
      organization: "Community Development Coalition"
    },
    {
      quote: "Revolutionary approach to grant management and compliance.",
      author: "Jennifer Smith",
      role: "Grants Administrator",
      organization: "State University System"
    }
  ];

  const impactMetrics = [
    { metric: "$450B+", label: "Facilitated Funding" },
    { metric: "95%", label: "Application Success Rate" },
    { metric: "200k+", label: "Projects Funded" },
    { metric: "48hrs", label: "Average Response Time" }
  ];

  return (
    <div className="abo002-modern-container">
      <motion.header 
        className="abo002-hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="abo002-hero-content">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            grant.GOV
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Empowering America's Future Through Strategic Grant Funding
          </motion.p>
          <motion.div 
            className="abo002-hero-cta"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <button className="abo002-primary-button">Explore Grants</button>
            <button className="abo002-secondary-button">Learn More</button>
          </motion.div>
        </div>
        <div className="abo002-scroll-indicator">
          <ChevronDown size={32} />
        </div>
      </motion.header>

      <section 
        ref={el => sections.current.stats = el} 
        id="stats" 
        className={`abo002-stats-section ${visibleSection === 'stats' ? 'abo002-visible' : ''}`}
      >
        <div className="abo002-section-header">
          <h2>Government Grant Landscape</h2>
          <p>Transforming communities through strategic federal funding</p>
        </div>
        <div className="abo002-stats-grid">
          {governmentStats.map((stat, index) => (
            <motion.div
              key={index}
              className="abo002-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="abo002-stat-icon">{stat.icon}</div>
              <h3>{stat.number}</h3>
              <h4>{stat.label}</h4>
              <p>{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section 
        ref={el => sections.current.pillars = el}
        id="pillars" 
        className="abo002-pillars-section"
      >
        <div className="abo002-section-header">
          <h2>Our Strategic Pillars</h2>
          <p>Building America's future through targeted investment</p>
        </div>
        <div className="abo002-pillars-grid">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              className="abo002-pillar-card"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="abo002-pillar-icon">{pillar.icon}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
              <ul className="abo002-pillar-stats">
                {pillar.stats.map((stat, statIndex) => (
                  <li key={statIndex}>{stat}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="abo002-video-section">
        <div className="abo002-video-container">
          {!isVideoPlaying ? (
            <div className="abo002-video-placeholder">
              <img src="/Images/work.png" alt="Grant.gov overview" />
              <button
                className="abo002-play-button"
                onClick={() => setIsVideoPlaying(true)}
              >
                Play Overview
              </button>
            </div>
          ) : (
            <div className="abo002-video-player">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/QglaOv6HD28?autoplay=1"
                title="Grant.gov Overview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </section>
    
      <section 
        ref={el => sections.current.features = el}
        id="features" 
        className="abo002-features-section"
      >
        <div className="abo002-section-header">
          <h2>Platform Capabilities</h2>
          <p>Cutting-edge technology powering grant success</p>
        </div>
        <div className="abo002-features-grid">
          {keyFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="abo002-feature-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="abo002-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <ul className="abo002-feature-benefits">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex}>{benefit}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <section 
        ref={el => sections.current.testimonials = el}
        id="testimonials" 
        className="abo002-testimonials-section"
      >
        <div className="abo002-section-header">
          <h2>Success Stories</h2>
          <p>Hear from our grant recipients</p>
        </div>
        <div className="abo002-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="abo002-testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <p className="abo002-quote">{testimonial.quote}</p>
              <div className="abo002-testimonial-author">
                <h4>{testimonial.author}</h4>
                <p>{testimonial.role}</p>
                <p className="abo002-organization">{testimonial.organization}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section 
        ref={el => sections.current.impact = el}
        id="impact" 
        className="abo002-impact-section"
      >
        <div className="abo002-section-header">
          <h2>Our Impact</h2>
          <p>Measuring success through meaningful outcomes</p>
        </div>
        <div className="abo002-impact-grid">
          {impactMetrics.map((item, index) => (
            <motion.div
              key={index}
              className="abo002-impact-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3>{item.metric}</h3>
              <p>{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GrantAboutUs;