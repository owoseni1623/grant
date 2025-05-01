import React, { useState, useRef, useEffect } from 'react';
import { useGrantsContext } from '../../Context/GrantsContext';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaBriefcase, 
  FaUsers, 
  FaGraduationCap, 
  FaBuilding, 
  FaClipboardCheck,
  FaSearch,
  FaPencilAlt,
  FaChevronLeft,
  FaChevronRight,
  FaStore,
  FaHandHoldingHeart,
  FaSchool,
  FaHouseUser,
  FaTools,
  FaLightbulb,
  FaUserFriends,
  FaRandom,
  FaHandHoldingUsd,
  FaUserPlus,
  FaLandmark
} from 'react-icons/fa';
import './HomePage.css';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    "/Images/cgrant.png",
    "/Images/cgrant3.jpg",
    "/Images/cgrant4.jpg",
    "/Images/cgrant4.jpeg",
    "/Images/grant001.jpg",
    "/Images/grant0000.webp"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="hero-section">
      {images.map((img, index) => (
        <div
          key={index}
          className="hero-slide"
          style={{
            opacity: currentSlide === index ? 1 : 0,
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${img})`,
          }}
        />
      ))}
      <div className="hero-nav-wrapper">
        <div 
          className="hero-nav-button left" 
          onClick={handlePrevSlide}
          role="button"
          tabIndex={0}
        >
          <FaChevronLeft />
        </div>
        <div 
          className="hero-nav-button right" 
          onClick={handleNextSlide}
          role="button"
          tabIndex={0}
        >
          <FaChevronRight />
        </div>
      </div>
      <div className="hero-content">
        <h1>Applications are NOW Available!</h1>
        <p>Each year <strong>billions</strong> of dollars are awarded to individuals and businesses in the form of grants and other types of funding. <strong>Apply for YOUR piece today!</strong></p>
      </div>
      <div className="hero-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const { state, actions } = useGrantsContext();
  const [currentTestimonialSlide, setCurrentTestimonialSlide] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const testimonialContainerRef = useRef(null);

  const firstLayerCategories = [
    { icon: FaHome, title: 'Personal Grant', color: '#3498db', link: '/personal-grant' },
    { icon: FaBriefcase, title: 'Business Grant', color: '#2ecc71', link: '/business-grant' },
    { icon: FaUsers, title: 'Community Grant', color: '#e74c3c', link: '/community-grant' },
    { icon: FaGraduationCap, title: 'Education Grant', color: '#f39c12', link: '/education-grant' },
    { icon: FaBuilding, title: 'Real Estate Grant', color: '#9b59b6', link: '/real-estate-grant' }
  ];

  const testimonials = [
    { text: "The grant I received helped me start my dream business. The application process was straightforward and the support was incredible.", author: "Sarah Mitchell" },
    { text: "As a first-time homebuyer, the grant assistance made homeownership possible. I'm forever grateful!", author: "John Davies" },
    { text: "The community grant we received transformed our neighborhood park. It's now a vibrant space for everyone.", author: "Maria Rodriguez" },
    { text: "Thanks to the education grant, I was able to complete my degree without taking on massive debt.", author: "David Chen" },
    { text: "The small business grant helped me expand my operation and hire two new employees.", author: "Lisa Thompson" },
    { text: "The innovation grant funded my research project, leading to a breakthrough in renewable energy.", author: "Dr. James Wilson" },
    { text: "Our non-profit received crucial funding that helped us serve more families in need.", author: "Patricia Garcia" },
    { text: "The agricultural grant helped modernize our family farm and increase productivity.", author: "Robert Johnson" },
    { text: "Thanks to the arts grant, our community theater is thriving and bringing culture to our town.", author: "Emma White" },
    { text: "The technology grant helped our school district provide laptops to underprivileged students.", author: "Michael Brown" },
    { text: "The healthcare initiative grant allowed us to open a free clinic in an underserved area.", author: "Dr. Susan Lee" },
    { text: "The environmental grant funded our local conservation project, protecting endangered species.", author: "Tom Anderson" }
  ];

  const { grantCategories } = state;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialSlide((prev) => 
        prev === Math.floor(testimonials.length / 4) ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonialContainerRef.current) {
      testimonialContainerRef.current.style.transform = 
        `translateX(-${currentTestimonialSlide * 100}%)`;
    }
  }, [currentTestimonialSlide]);

  const handleTestimonialSlide = (direction) => {
    const container = testimonialContainerRef.current;
    const cardWidth = container.querySelector('.testimonial-card').offsetWidth + 32; // width + margins
    
    if (direction === 'right') {
      setCurrentSlide(prev => 
        prev < Math.floor(testimonials.length / 4) ? prev + 1 : prev
      );
    } else {
      setCurrentSlide(prev => 
        prev > 0 ? prev - 1 : prev
      );
    }

    container.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
  };

  return (
    <div className="usa-funding-homepage">
      <HeroCarousel />

      <section className="category-icons-section">
        <h2 className="category-header">Let's get started! Select your type of grant:</h2>
        <div className="categories-container">
          {firstLayerCategories.map((category, index) => (
            <Link to={category.link} key={index} className="category-card">
              <div className="category-icon" style={{ backgroundColor: category.color }}>
                <category.icon />
              </div>
              <h3>{category.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="how-it-works-section">
        <h2>Here's how it works</h2>
        <p>USA Funding Applications is an online funding application system that gives you access to over 20,000 APPLICATION SOURCES, including GRANTS.</p>
        
        <div className="how-it-works-steps">
          <div className="step-card">
            <div className="step-icon">
              <FaClipboardCheck />
            </div>
            <h3>REGISTER</h3>
            <p>Easy to fill out. Your information is secure.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">
              <FaSearch />
            </div>
            <h3>RESEARCH</h3>
            <p>We provide the application sources and teach you how to apply.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">
              <FaPencilAlt />
            </div>
            <h3>APPLY</h3>
            <p>There's no limit to the number of grants and other sources you can apply to.</p>
          </div>
        </div>
      </section>

      <section className="ome010-testimonials-section">
      <div className="ome010-testimonials-content">
        <h2 className="ome010-section-title">What People Are Saying</h2>
        <div className="ome010-testimonials-carousel">
          <button 
            className="ome010-carousel-button left" 
            onClick={() => handleTestimonialSlide('left')}
            aria-label="Previous Testimonials"
          >
            <FaChevronLeft />
          </button>
          
          <div className="ome010-testimonials-window">
            <div 
              ref={testimonialContainerRef} 
              className="ome010-testimonials-container"
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="ome010-testimonial-card">
                  <p>"{testimonial.text}"</p>
                  <span className="ome010-testimonial-author">- {testimonial.author}</span>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="ome010-carousel-button right" 
            onClick={() => handleTestimonialSlide('right')}
            aria-label="Next Testimonials"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>

      <section className="money-sources-section">
        <div className="content-flex">
          <div className="text-content">
            <h2>Where does the money come from?</h2>
            <div className="money-sources-paragraphs">
              <p className="money-source-p">
                It's a documented fact that Billions of Dollars in Free Money are donated every year by American Corporate Giving Programs, Foundations, and other Charitable Institutions, Individuals, and Other Agencies. We read daily about gigantic sums of Funding being given to businesses and individuals, just like you, to help them fulfill their goals and dreams, but often times these people will not tell you HOW or WHERE they got this Funding. In order to know HOW and WHERE to tap into these vast treasures, don't sit around and hope you hear it through the grapevine, find out yourself with the help of USA Funding Applications.
              </p>
              <p className="money-source-p">
                Many funding opportunities are awarded for projects and businesses for general operating expenses and other capital, such as, a new building or major pieces of equipment. Sometimes you can also include inventory, salaries, labor, advertising, marketing, etc. Also remember that most funding is not available for personal expenses or paying off debt, but there are other assistance programs out there to help you out of your situation!
              </p>
            </div>
            <Link to="/apply" className="cta-link">Start the Application Process Today!</Link>
          </div>
        </div>
      </section>

      <section className="application-categories-section">
        <h2 className="categories-header">
          Here are the FUNDING CATEGORIES you'll have access to with over 200,000,000 APPLICATIONS to apply to!
        </h2>
        <div className="categories-grid">
          {grantCategories.map((category, index) => (
            <Link 
              to="/apply" // Changed this line to direct to /apply
              key={index} 
              className="funding-category-card"
            >
              <div className="category-icon-container">
                <category.icon />
              </div>
              <h3>{category.title}</h3>
              <p>{category.count.toLocaleString()} Applications</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="recent-applications-section">
        <h2>We've recently added the following number of applications:</h2>
        <div className="application-stats">
          <p>Last 7 Days: <strong>{state.statistics.recentApplications.sevenDays}</strong> new applications</p>
          <p>Last 30 Days: <strong>{state.statistics.recentApplications.thirtyDays}</strong> new applications</p>
          <p>Last 90 Days: <strong>{state.statistics.recentApplications.ninetyDays}</strong> new applications</p>
        </div>
        
        <div className="application-cta">
          <h3>Get your piece of the funding pie.</h3>
          <p>Funding applications do not require collateral, credit checks, security deposits or co-signers...</p>
          
          <div className="cta-buttons">
            <Link to="/apply" className="cta-button primary">Start the Application Process Now</Link>
            <Link to="/register" className="cta-button secondary">Sign up today!</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;