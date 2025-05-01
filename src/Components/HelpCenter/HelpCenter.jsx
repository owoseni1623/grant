import React, { useState, useEffect, useRef } from 'react';
import './HelpCenter.css';

const HelpCenter = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const searchInputRef = useRef(null);

  const helpSections = [
    {
      id: 'getting-started',
      icon: '🚀',
      title: 'Getting Started',
      description: 'Your complete guide to beginning the grant application process',
      topics: [
        {
          id: 'account-creation',
          title: 'Create Your Account',
          content: 'Step-by-step guide to creating and verifying your Grant.gov account, including required documentation and identity verification.',
          videoLink: 'https://example.com/account-creation-tutorial'
        },
        {
          id: 'eligibility-check',
          title: 'Eligibility Verification',
          content: 'Comprehensive overview of eligibility criteria, including citizenship requirements, organizational prerequisites, and specific grant restrictions.',
          eligibilityCriteria: [
            'U.S. Citizenship',
            'Organizational Registration',
            'Financial Standing',
            'Project Alignment'
          ]
        }
      ]
    },
    {
      id: 'application-process',
      icon: '📝',
      title: 'Application Process',
      description: 'Navigating the comprehensive grant application workflow',
      topics: [
        {
          id: 'document-preparation',
          title: 'Document Preparation',
          content: 'Detailed guidance on gathering required documents, formatting requirements, and creating a competitive application.',
          requiredDocuments: [
            'Proof of Citizenship',
            'Organizational Tax Documents',
            'Project Proposal',
            'Budget Breakdown'
          ]
        },
        {
          id: 'submission-guidelines',
          title: 'Submission Workflow',
          content: 'Comprehensive instructions for submitting your grant application, including technical requirements, file formats, and submission checklist.',
          submissionSteps: [
            'Complete All Sections',
            'Verify Document Formats',
            'Review Submission Checklist',
            'Final Submission Confirmation'
          ]
        }
      ]
    },
    {
      id: 'support-resources',
      icon: '🆘',
      title: 'Support & Resources',
      description: 'Comprehensive support network for your grant application journey',
      topics: [
        {
          id: 'contact-support',
          title: 'Contact Information',
          content: 'Direct support channels, including phone numbers, email addresses, and live chat options.',
          supportChannels: [
            'Phone Support: 1-800-GRANT-US',
            'Email: support@grant.gov',
            'Live Chat: Available 8 AM - 6 PM EST'
          ]
        },
        {
          id: 'faq-section',
          title: 'Frequently Asked Questions',
          content: 'Comprehensive answers to the most common grant application questions.',
          faqs: [
            {
              question: 'How long does the application process take?',
              answer: 'Typically 4-6 weeks from submission to initial review.'
            },
            {
              question: 'Are there application fees?',
              answer: 'Most federal grant applications are free to submit.'
            }
          ]
        }
      ]
    }
  ];

  const openModal = (content) => {
    setModalContent(content);
  };

  const closeModal = (e) => {
    // Prevent event from propagating
    if (e) {
      e.stopPropagation();
    }
    setModalContent(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setActiveSection(null);
  };

  const filteredSections = helpSections.filter(section => 
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.topics.some(topic => 
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
    <div className="advanced-grant-help-center">
      <header className="help-center-header">
        <div className="header-content">
          <h1>grant.GOV Application Help Center</h1>
          <div className="search-container">
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search help resources (Ctrl + F)" 
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>
      </header>

      <main className="help-center-main">
        {filteredSections.map(section => (
          <div 
            key={section.id} 
            className={`help-section ${activeSection === section.id ? 'active' : ''}`}
          >
            <div 
              className="section-header"
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            >
              <span className="section-icon">{section.icon}</span>
              <div className="section-title">
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>
              <span className="toggle-icon">
                {activeSection === section.id ? '−' : '+'}
              </span>
            </div>

            {activeSection === section.id && (
              <div className="section-topics">
                {section.topics.map(topic => (
                  <div 
                    key={topic.id} 
                    className="topic-card"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent section collapse
                      openModal(topic);
                    }}
                  >
                    <h3>{topic.title}</h3>
                    <p>{topic.content.substring(0, 150)}...</p>
                    <span className="learn-more">Learn More</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </main>

      {modalContent && (
        <div 
          className="modal-overlay" 
          onClick={closeModal}
        >
          <div 
            className="modal-content" 
            onClick={(e) => {
              // Prevent the modal from closing when clicking inside
              e.stopPropagation();
            }}
          >
            <button 
              className="close-modal" 
              onClick={closeModal}
            >
              ×
            </button>
            <h2>{modalContent.title}</h2>
            <p>{modalContent.content}</p>
            
            {modalContent.eligibilityCriteria && (
              <div className="modal-section">
                <h3>Eligibility Criteria</h3>
                <ul>
                  {modalContent.eligibilityCriteria.map((criteria, index) => (
                    <li key={index}>{criteria}</li>
                  ))}
                </ul>
              </div>
            )}

            {modalContent.requiredDocuments && (
              <div className="modal-section">
                <h3>Required Documents</h3>
                <ul>
                  {modalContent.requiredDocuments.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}

            {modalContent.faqs && (
              <div className="modal-section">
                <h3>Related FAQs</h3>
                {modalContent.faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <strong>{faq.question}</strong>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;