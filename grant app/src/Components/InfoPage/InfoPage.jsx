import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './InfoPage.css';

const InfoSectionPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApply = (grantTitle) => {
    // You can pass grant-specific data through the navigation
    navigate('/apply', { state: { grantTitle } });
  };

  const categories = [
    'Individual Grants',
    'Business Grants',
    'Educational Grants',
    'Research Grants',
    'Community Development',
    'Healthcare Grants'
  ];

  const grantTypes = [
    {
      category: 'Individual Grants',
      title: 'Personal Development Grant',
      amount: '$75,000 - $150,000',
      deadline: '2025-04-31',
      description: 'Supporting individual growth and skill development'
    },
    {
      category: 'Business Grants',
      title: 'Small Business Innovation Grant',
      amount: '$100,000 - $200,000',
      deadline: '2025-05-30',
      description: 'Fostering innovation in small businesses'
    },
    {
      category: 'Educational Grants',
      title: 'Academic Excellence Scholarship',
      amount: '$75,000 - $150,000',
      deadline: '2025-04-30',
      description: 'Supporting academic achievement and research'
    },
    {
      category: 'Research Grants',
      title: 'Scientific Research Innovation Grant',
      amount: '$100,000 - $500,000',
      deadline: '2025-09-30',
      description: 'Supporting breakthrough research in science and technology'
    },
    {
      category: 'Research Grants',
      title: 'Medical Research Fellowship',
      amount: '$75,000 - $250,000',
      deadline: '2025-11-15',
      description: 'Advancing medical research and clinical studies'
    },
    {
      category: 'Community Development',
      title: 'Neighborhood Improvement Grant',
      amount: '$100,000 - $1,000,000',
      deadline: '2025-08-31',
      description: 'Supporting local community development initiatives'
    },
    {
      category: 'Community Development',
      title: 'Urban Planning Grant',
      amount: '$250,000 - $2,000,000',
      deadline: '2025-10-15',
      description: 'Funding sustainable urban development projects'
    },
    {
      category: 'Healthcare Grants',
      title: 'Healthcare Innovation Fund',
      amount: '$100,000 - $500,000',
      deadline: '2025-12-15',
      description: 'Supporting innovative healthcare solutions and technologies'
    },
    {
      category: 'Healthcare Grants',
      title: 'Rural Healthcare Access Grant',
      amount: '$50,000 - $250,000',
      deadline: '2024-11-30',
      description: 'Improving healthcare access in rural communities'
    }
  ];

  const applicationSteps = [
    {
      title: 'Registration & Account Setup',
      duration: '1-2 to working days',
      tasks: [
        'Create grants.gov account',
        'Verify email address',
        'Complete profile information',
        'Set up multi-factor authentication'
      ]
    },
    {
      title: 'Documentation Preparation',
      duration: '1 to 7 working days',
      tasks: [
        'Gather personal identification',
        'Prepare financial statements',
        'Draft project proposal',
        'Compile supporting documents'
      ]
    },
    {
      title: 'Application Submission',
      duration: '1-3 working days',
      tasks: [
        'Complete online forms',
        'Upload required documents',
        'Review submission',
        'Submit application'
      ]
    },
    {
      title: 'Review & Decision',
      duration: '1-7 working days',
      tasks: [
        'Initial screening',
        'Detailed review',
        'Committee evaluation',
        'Final decision'
      ]
    }
  ];

  const resources = [
    {
      title: 'Grant Writing Guide',
      type: 'PDF',
      description: 'Comprehensive guide to writing successful grant proposals',
      downloadLink: '/resources/grant-writing-guide.pdf'
    },
    {
      title: 'Budget Template',
      type: 'Excel',
      description: 'Standardized budget template for grant applications',
      downloadLink: '/resources/budget-template.xlsx'
    },
    {
      title: 'Application Checklist',
      type: 'PDF',
      description: 'Complete checklist of required documents and steps',
      downloadLink: '/resources/application-checklist.pdf'
    }
  ];

  const faqs = [
    {
      question: 'What is the typical grant application timeline?',
      answer: 'The typical grant application process takes 1-7 working days from initial submission to final decision. This includes documentation preparation, review periods, and potential revisions.'
    },
    {
      question: 'How are grant applications evaluated?',
      answer: 'Applications are evaluated based on project merit, feasibility, budget appropriateness, and alignment with grant objectives. A committee of experts reviews each application using standardized criteria.'
    },
    {
      question: 'Can I apply for multiple grants simultaneously?',
      answer: 'Yes, you can apply for multiple grants simultaneously. However, ensure you can fulfill all requirements and commitments if awarded multiple grants.'
    }
  ];

  const renderOverviewSection = () => (
    <div className="info010-overview-section">
      <div className="info010-welcome-banner">
        <h2>Welcome to Federal Grants Portal</h2>
        <div className="info010-progress-tracker">
          <div className="info010-progress-bar" style={{ width: `${progress}%` }}>
            <span>{progress}% Complete</span>
          </div>
        </div>
      </div>
      
      <div className="info010-quick-stats">
        <div className="info010-stat-card">
          <span className="info010-stat-number">5B+</span>
          <span className="info010-stat-label">Annual Applications</span>
        </div>
        <div className="info010-stat-card">
          <span className="info010-stat-number">$800B</span>
          <span className="info010-stat-label">Total Funding</span>
        </div>
        <div className="info010-stat-card">
          <span className="info010-stat-number">106</span>
          <span className="info010-stat-label">Federal Agencies</span>
        </div>
      </div>

      <div className="info010-featured-grants">
        <h3>Featured Grant Opportunities</h3>
        <div className="info010-grant-carousel">
          {grantTypes.map((grant, index) => (
            <div key={index} className="info010-grant-card">
              <h4>{grant.title}</h4>
              <p className="info010-grant-amount">{grant.amount}</p>
              <p className="info010-grant-deadline">Deadline: {grant.deadline}</p>
              <p>{grant.description}</p>
              <button 
                onClick={() => handleApply(grant.title)}
                className="info010-apply-button"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEligibilitySection = () => (
    <div className="info010-eligibility-section">
      <div className="info010-category-filter">
        <h3>Grant Categories</h3>
        <div className="info010-category-buttons">
          <button 
            className={`info010-category-button ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Categories
          </button>
          {categories.map((category, index) => (
            <button
              key={index}
              className={`info010-category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="info010-eligibility-grid">
        {grantTypes
          .filter(grant => selectedCategory === 'all' || grant.category === selectedCategory)
          .map((grant, index) => (
            <div key={index} className="info010-eligibility-card">
              <h4>{grant.title}</h4>
              <div className="info010-eligibility-details">
                <p><strong>Category:</strong> {grant.category}</p>
                <p><strong>Amount:</strong> {grant.amount}</p>
                <p><strong>Deadline:</strong> {grant.deadline}</p>
                <p>{grant.description}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderApplicationProcess = () => (
    <div className="info010-process-section" ref={timelineRef}>
      <div className="info010-process-header">
        <h3>Application Timeline</h3>
        <p>Estimated total duration: 2-4 weeks</p>
      </div>

      <div className="info010-timeline-enhanced">
        {applicationSteps.map((step, index) => (
          <div key={index} className="info010-timeline-item-enhanced">
            <div className="info010-timeline-content">
              <div className="info010-timeline-header">
                <h4>{step.title}</h4>
                <span className="info010-duration">{step.duration}</span>
              </div>
              <div className="info010-timeline-tasks">
                {step.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="info010-task-item">
                    <span className="info010-task-checkbox"></span>
                    <span className="info010-task-text">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResourcesSection = () => (
    <div className="info010-resources-section">
      <h3>Grant Resources</h3>
      <div className="info010-resources-grid">
        {resources.map((resource, index) => (
          <div key={index} className="info010-resource-card">
            <div className="info010-resource-header">
              <h4>{resource.title}</h4>
              <span className="info010-resource-type">{resource.type}</span>
            </div>
            <p>{resource.description}</p>
            <button 
              className="info010-download-button"
              onClick={() => showNotification('Download started!')}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHelpSection = () => (
    <div className="info010-help-section">
      <h3>Frequently Asked Questions</h3>
      <div className="info010-faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="info010-faq-item">
            <button
              className={`info010-faq-question ${expandedFaqs[index] ? 'active' : ''}`}
              onClick={() => setExpandedFaqs(prev => ({...prev, [index]: !prev[index]}))}
            >
              {faq.question}
            </button>
            {expandedFaqs[index] && (
              <div className="info010-faq-answer">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="info010-help-contact">
        <h4>Need Additional Help?</h4>
        <p>Our support team is available 24/7 to assist you with any questions.</p>
        <button 
          className="info010-contact-support-button"
          onClick={() => showNotification('Support team will contact you shortly!')}
        >
          Contact Support
        </button>
      </div>
    </div>
  );

  const renderSearchBar = () => (
    <div className="info010-search-section">
      <div className="info010-search-container">
        <input
          type="text"
          placeholder="Search grants, requirements, or documentation..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsSearching(true);
          }}
          className="info010-search-input"
        />
        {isSearching && (
          <div className="info010-search-results">
            <div className="info010-search-result">
              <h4>Grant Writing Tips</h4>
              <p>Expert advice on crafting successful applications...</p>
            </div>
            <div className="info010-search-result">
              <h4>Documentation Guide</h4>
              <p>Complete list of required documents and formats...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="info010-enhanced-container">
      {notification && (
        <div className="info010-notification">
          {notification}
        </div>
      )}

      {renderSearchBar()}

      <nav className="info010-enhanced-nav">
        {['overview', 'eligibility', 'process', 'resources', 'help'].map((tab) => (
          <button
            key={tab}
            className={`info010-nav-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <main className="info010-enhanced-main">
        {activeTab === 'overview' && renderOverviewSection()}
        {activeTab === 'eligibility' && renderEligibilitySection()}
        {activeTab === 'process' && renderApplicationProcess()}
        {activeTab === 'resources' && renderResourcesSection()}
        {activeTab === 'help' && renderHelpSection()}
      </main>

      
    </div>
  );
};

export default InfoSectionPage;