import React, { useState, useRef, useEffect } from 'react';
import './FAQPage.css';

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const searchInputRef = useRef(null);

  const faqData = [
    {
      category: 'Getting Started',
      icon: '🚀',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Creating an account is simple. Click on "Sign Up" in the top right corner, fill out the registration form with your email and personal details, and verify your email address through the link sent to your inbox.',
          tags: ['account', 'registration', 'new users']
        },
        {
          question: 'What documents do I need to get started?',
          answer: 'Typically, you\'ll need a government-issued ID, proof of address, and any relevant professional certifications. The exact requirements depend on your specific use case and the platform you\'re using.',
          tags: ['documentation', 'verification', 'requirements']
        }
      ]
    },
    {
      category: 'Billing & Payments',
      icon: '💳',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and in some regions, local payment methods like Apple Pay and Google Pay.',
          tags: ['payment', 'methods', 'billing']
        },
        {
          question: 'How are subscription charges processed?',
          answer: 'Subscriptions are automatically renewed at the end of each billing cycle. You will receive an email notification before the renewal, and charges are processed on the payment method you have on file.',
          tags: ['subscription', 'billing', 'renewal']
        }
      ]
    },
    {
      category: 'Technical Support',
      icon: '🛠️',
      faqs: [
        {
          question: 'How can I reset my password?',
          answer: 'Visit the login page and click "Forgot Password". Enter your registered email address, and you\'ll receive a password reset link. Follow the instructions to create a new password.',
          tags: ['password', 'security', 'account']
        },
        {
          question: 'What should I do if I encounter a technical issue?',
          answer: 'First, check our troubleshooting guide. If the issue persists, contact our support team through the "Help" section, providing detailed information about the problem you\'re experiencing.',
          tags: ['support', 'troubleshooting', 'help']
        }
      ]
    },
    {
      category: 'Privacy & Security',
      icon: '🔒',
      faqs: [
        {
          question: 'How do you protect my personal information?',
          answer: 'We use industry-standard encryption, two-factor authentication, and regular security audits to protect your data. Your personal information is never sold or shared without your explicit consent.',
          tags: ['privacy', 'security', 'data protection']
        },
        {
          question: 'What is your data retention policy?',
          answer: 'We retain user data only as long as necessary for providing our services. You can request data deletion at any time through your account settings or by contacting our privacy team.',
          tags: ['data', 'privacy', 'retention']
        }
      ]
    }
  ];

  // Toggle question expansion
  const toggleQuestion = (category, index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [`${category}-${index}`]: !prev[`${category}-${index}`]
    }));
  };

  // Search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setActiveCategory(null);
  };

  // Filter FAQs based on search
  const filteredFAQs = faqData.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm) ||
      faq.answer.toLowerCase().includes(searchTerm) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  })).filter(category => category.faqs.length > 0);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="faq003-container">
      <header className="faq003-header">
        <h1>Frequently Asked Questions</h1>
        <div className="faq003-search-wrapper">
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search FAQs (Ctrl + F)" 
            value={searchTerm}
            onChange={handleSearch}
            className="faq003-search-input"
          />
        </div>
      </header>

      <div className="faq003-categories">
        {filteredFAQs.map((category, catIndex) => (
          <div key={catIndex} className="faq003-category">
            <div 
              className={`faq003-category-header ${activeCategory === catIndex ? 'active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === catIndex ? null : catIndex)}
            >
              <span className="faq003-category-icon">{category.icon}</span>
              <h2>{category.category}</h2>
              <span className="faq003-expand-icon">
                {activeCategory === catIndex ? '−' : '+'}
              </span>
            </div>

            {activeCategory === catIndex && (
              <div className="faq003-category-faqs">
                {category.faqs.map((faq, faqIndex) => (
                  <div 
                    key={faqIndex} 
                    className={`faq003-faq-item ${expandedQuestions[`${category.category}-${faqIndex}`] ? 'expanded' : ''}`}
                  >
                    <div 
                      className="faq003-faq-question" 
                      onClick={() => toggleQuestion(category.category, faqIndex)}
                    >
                      <h3>{faq.question}</h3>
                      <span className="faq003-toggle-icon">
                        {expandedQuestions[`${category.category}-${faqIndex}`] ? '−' : '+'}
                      </span>
                    </div>
                    {expandedQuestions[`${category.category}-${faqIndex}`] && (
                      <div className="faq003-faq-answer">
                        <p>{faq.answer}</p>
                        {faq.tags && (
                          <div className="faq003-faq-tags">
                            {faq.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="faq003-tag">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFAQs.length === 0 && (
        <div className="faq003-no-results">
          <p>No FAQs found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default FAQPage;