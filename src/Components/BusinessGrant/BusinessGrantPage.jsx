import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BusinessGrantPage.css';

const BusinessGrantPage = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [calculatedAmount, setCalculatedAmount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);

    const grantCategories = [
        {
            id: 1,
            title: "Technology Innovation",
            maxAmount: 250000,
            description: "For businesses developing cutting-edge technology solutions"
        },
        {
            id: 2,
            title: "Green Business",
            maxAmount: 200000,
            description: "Supporting environmentally sustainable business practices"
        },
        {
            id: 3,
            title: "Small Business Growth",
            maxAmount: 150000,
            description: "Helping small businesses scale their operations"
        },
        {
            id: 4,
            title: "Digital Transformation",
            maxAmount: 175000,
            description: "Supporting businesses in their digital journey"
        }
    ];

    const successStories = [
        {
            id: 1,
            company: "TechStart Inc.",
            founder: "Sarah Johnson",
            grantAmount: "200,000",
            story: "Transformed from a local startup to a national tech provider"
        },
        {
            id: 2,
            company: "Green Solutions Co.",
            founder: "Michael Chen",
            grantAmount: "175,000",
            story: "Expanded sustainable product line across 12 states"
        },
        {
            id: 3,
            company: "Digital Health Pro",
            founder: "Emma Williams",
            grantAmount: "225,000",
            story: "Developed revolutionary healthcare management platform"
        }
    ];

    const timeline = [
        { phase: "Application Submission", duration: "2-3 days" },
        { phase: "Initial Review", duration: "1-2 weeks" },
        { phase: "Documentation", duration: "1 week" },
        { phase: "Final Review", duration: "2 weeks" },
        { phase: "Award Decision", duration: "1 week" },
        { phase: "Fund Distribution", duration: "1-2 weeks" }
    ];

    const faqs = [
        {
            question: "What documents do I need to apply?",
            answer: "You'll need business registration, tax returns, financial statements, and a detailed business plan."
        },
        {
            question: "How long is the application process?",
            answer: "The entire process typically takes 6-8 weeks from submission to decision."
        },
        {
            question: "Can I apply for multiple grant categories?",
            answer: "Yes, you can apply for up to two grant categories simultaneously."
        }
    ];

    const calculateEstimate = (revenue, employees) => {
        // Simple estimation logic
        const baseAmount = revenue * 0.2;
        const employeeBonus = employees * 1000;
        return Math.min(baseAmount + employeeBonus, 250000);
    };

    return (
        <div className="grant-page">
            {/* Hero Section */}
            <header className="header">
                <div className="header-content">
                    <h1>Business Growth & Innovation Grant 2024</h1>
                    <p className="subtitle">Empowering Businesses to Reach New Heights</p>
                    <div className="header-cta">
                        <button onClick={() => setShowModal(true)} className="primary-button">
                            Calculate Your Grant
                        </button>
                        <Link to="/apply" className="secondary-button">
                            Start Application
                        </Link>
                    </div>
                </div>
                <div className="header-stats">
                    <div className="stat-item">
                        <h3>$10M+</h3>
                        <p>Total Funding</p>
                    </div>
                    <div className="stat-item">
                        <h3>500+</h3>
                        <p>Businesses Funded</p>
                    </div>
                    <div className="stat-item">
                        <h3>95%</h3>
                        <p>Success Rate</p>
                    </div>
                </div>
            </header>

            {/* Grant Categories Section */}
            <section className="categories-section">
                <h2>Grant Categories</h2>
                <div className="categories-grid">
                    {grantCategories.map((category) => (
                        <div 
                            key={category.id}
                            className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            <h3>{category.title}</h3>
                            <p className="amount">Up to ${category.maxAmount.toLocaleString()}</p>
                            <p>{category.description}</p>
                            <button className="learn-more-btn">Learn More</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Success Stories Section */}
            <section className="success-stories">
                <h2>Success Stories</h2>
                <div className="stories-carousel">
                    {successStories.map((story) => (
                        <div key={story.id} className="story-card">
                            <div className="story-header">
                                <h3>{story.company}</h3>
                                <p className="founder">Founded by {story.founder}</p>
                            </div>
                            <div className="story-content">
                                <p className="grant-amount">Received: ${story.grantAmount}</p>
                                <p className="story-text">{story.story}</p>
                            </div>
                            <button className="read-more-btn">Read Full Story</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Timeline Section */}
            <section className="timeline-section">
                <h2>Application Timeline</h2>
                <div className="timeline">
                    {timeline.map((phase, index) => (
                        <div key={index} className="timeline-item">
                            <div className="timeline-point"></div>
                            <div className="timeline-content">
                                <h3>{phase.phase}</h3>
                                <p>{phase.duration}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Resources Section */}
            <section className="resources-section">
                <h2>Grant Resources</h2>
                <div className="resources-grid">
                    <div className="resource-card">
                        <h3>Application Guide</h3>
                        <p>Step-by-step guide to completing your application</p>
                        <button className="download-btn">Download PDF</button>
                    </div>
                    <div className="resource-card">
                        <h3>Video Tutorials</h3>
                        <p>Watch our detailed application tutorials</p>
                        <button className="watch-btn">Watch Now</button>
                    </div>
                    <div className="resource-card">
                        <h3>Templates</h3>
                        <p>Business plan and financial templates</p>
                        <button className="download-btn">Download Pack</button>
                    </div>
                    <div className="resource-card">
                        <h3>Webinars</h3>
                        <p>Join our weekly information sessions</p>
                        <button className="register-btn">Register</button>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-grid">
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <h3>{faq.question}</h3>
                            <p>{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Support Section */}
            <section className="support-section">
                <h2>Need Help?</h2>
                <div className="support-options">
                    <div className="support-card">
                        <h3>Schedule Consultation</h3>
                        <p>Book a one-on-one session with our grant advisors</p>
                        <button className="schedule-btn">Book Now</button>
                    </div>
                    <div className="support-card">
                        <h3>Live Chat</h3>
                        <p>Chat with our support team</p>
                        <button className="chat-btn">Start Chat</button>
                    </div>
                    <div className="support-card">
                        <h3>Email Support</h3>
                        <p>Get answers within 24 hours</p>
                        <button className="email-btn">Send Email</button>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="final-cta">
                <h2>Ready to Transform Your Business?</h2>
                <p>Join hundreds of successful businesses that have accelerated their growth through our grant program.</p>
                <div className="cta-buttons">
                    <Link to="/apply" className="apply-button">Start Application</Link>
                    <button className="schedule-call-button">Schedule a Call</button>
                </div>
            </section>

            {/* Calculator Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Grant Calculator</h2>
                        <form className="calculator-form">
                            <div className="form-group">
                                <label>Annual Revenue</label>
                                <input type="number" placeholder="Enter annual revenue" />
                            </div>
                            <div className="form-group">
                                <label>Number of Employees</label>
                                <input type="number" placeholder="Enter number of employees" />
                            </div>
                            <button type="submit" className="calculate-btn">
                                Calculate Estimate
                            </button>
                        </form>
                        <button className="close-modal" onClick={() => setShowModal(false)}>
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessGrantPage;