import React, { useState, useRef, useEffect } from 'react';
import './SitemapPage.css';

const SitemapPage = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const sectionRefs = useRef({});

  // Update the date every month
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000 * 60 * 60 * 24); // Check daily for month changes

    return () => clearInterval(timer);
  }, []);

  // Format the date to show month and year
  const getFormattedDate = () => {
    const months = [
      'January', 'February', 'March', 'April', 
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    return `${month} ${year}`;
  };

  const sitemapStructure = [
    {
      category: 'Grants Overview',
      pages: [
        { 
          title: 'Home', 
          path: '/', 
          description: 'Comprehensive digital gateway for federal grant opportunities, providing intuitive navigation and immediate access to transformative funding resources for researchers, institutions, and innovators nationwide.'
        },
        { 
          title: 'About Grants', 
          path: '/about', 
          description: 'Detailed exploration of federal grant ecosystems, including historical context, strategic funding priorities, and comprehensive breakdown of national research and innovation support mechanisms.'
        },
        { 
          title: 'Grant Types', 
          path: '/grant-types', 
          description: 'Exhaustive catalog of grant categories spanning research, education, technology, healthcare, social sciences, and emerging interdisciplinary domains with precise eligibility criteria and application pathways.'
        }
      ]
    },
    {
      category: 'Application Process',
      pages: [
        { 
          title: 'Start Application', 
          path: '/apply', 
          description: 'Sophisticated, user-centric application portal with intelligent guidance, real-time validation, and adaptive workflows tailored to specific grant requirements and applicant profiles.'
        },
        { 
          title: 'Eligibility Checker', 
          path: '/eligibility', 
          description: 'Advanced algorithmic assessment tool cross-referencing applicant credentials, institutional affiliations, research proposals, and federal funding criteria to provide instant, comprehensive eligibility insights.'
        },
        { 
          title: 'Application Guidelines', 
          path: '/guidelines', 
          description: 'Meticulously crafted, regularly updated documentation providing transparent, step-by-step instructions, best practices, and strategic recommendations for successful grant applications.'
        },
        { 
          title: 'Document Submission', 
          path: '/documents', 
          description: 'Secure, blockchain-verified digital document management system supporting multiple file formats with advanced encryption, real-time validation, and comprehensive submission tracking mechanisms.'
        }
      ]
    },
    {
      category: 'User Account',
      pages: [
        { 
          title: 'Login', 
          path: '/login', 
          description: 'Multi-factor authentication portal with advanced security protocols, including biometric verification, geographic tracking, and adaptive risk assessment to protect user credentials.'
        },
        { 
          title: 'Registration', 
          path: '/register', 
          description: 'Comprehensive onboarding process capturing detailed professional profiles, research interests, institutional affiliations, and creating personalized grant opportunity recommendation engines.'
        },
        { 
          title: 'Profile Management', 
          path: '/profile', 
          description: 'Dynamic user dashboard enabling comprehensive profile customization, credential updates, publication tracking, and automatic synchronization with national research databases.'
        },
        { 
          title: 'Application History', 
          path: '/dashboard', 
          description: 'Intelligent tracking system providing real-time status updates, historical application analytics, performance insights, and personalized funding opportunity recommendations.'
        }
      ]
    },
    {
      category: 'Resources',
      pages: [
        { 
          title: 'FAQ', 
          path: '/faq', 
          description: 'Extensive, AI-powered knowledge base addressing complex queries, providing contextual guidance, and offering dynamic, continuously updated information about grant processes.'
        },
        { 
          title: 'Help Center', 
          path: '/help', 
          description: 'Comprehensive support ecosystem featuring live chat, expert consultation, video tutorials, webinars, and specialized assistance for diverse applicant backgrounds.'
        },
        { 
          title: 'Funding Opportunities', 
          path: '/opportunities', 
          description: 'Sophisticated discovery platform showcasing cutting-edge funding prospects, with advanced filtering, predictive matching algorithms, and personalized opportunity recommendations.'
        },
        { 
          title: 'Success Stories', 
          path: '/success', 
          description: 'Inspirational narrative collection highlighting groundbreaking research, transformative projects, and individual/institutional achievements enabled through federal grant support.'
        }
      ]
    },
    {
      category: 'Legal & Compliance',
      pages: [
        { 
          title: 'Privacy Policy', 
          path: '/privacy', 
          description: 'Comprehensive data protection framework ensuring absolute confidentiality, implementing quantum encryption, blockchain verification, and stringent federal privacy compliance protocols.'
        },
        { 
          title: 'Terms of Service', 
          path: '/terms', 
          description: 'Detailed legal framework defining platform engagement, user responsibilities, intellectual property guidelines, and comprehensive federal regulatory compliance mechanisms.'
        },
        { 
          title: 'Accessibility', 
          path: '/accessibility', 
          description: 'Commitment to universal digital access, implementing WCAG 2.1 standards, adaptive technologies, multilingual support, and inclusive design principles.'
        },
        { 
          title: 'Data Protection', 
          path: '/data-protection', 
          description: 'Advanced cybersecurity infrastructure with multi-layered protection, continuous threat monitoring, and comprehensive safeguards against potential digital vulnerabilities.'
        }
      ]
    }
  ];

  const handleCategoryToggle = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const filteredSitemap = sitemapStructure.map(category => ({
    ...category,
    pages: category.pages.filter(page => 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.pages.length > 0);

  const scrollToSection = (category) => {
    const ref = sectionRefs.current[category];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Get the version number based on the current date
  const getVersionNumber = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    return `${currentYear - 2020}.${currentMonth}`;
  };

  return (
    <div className="sit01-sitemap-page">
      <header className="sit01-sitemap-header">
        <h1>grant.GOV: Comprehensive Digital Navigation</h1>
        <p>Your Definitive Guide to Federal Funding Opportunities</p>
      </header>

      <section className="sit01-sitemap-search">
        <input 
          type="text" 
          placeholder="Search pages, sections, and opportunities..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search grant.GOV site map"
        />
      </section>

      <section className="sit01-sitemap-quick-nav">
        <div className="sit01-quick-nav-grid">
          {sitemapStructure.map((category, index) => (
            <button 
              key={index} 
              onClick={() => {
                handleCategoryToggle(category.category);
                scrollToSection(category.category);
              }}
              className={activeCategory === category.category ? 'active' : ''}
              aria-expanded={activeCategory === category.category}
            >
              {category.category}
            </button>
          ))}
        </div>
      </section>

      <section className="sit01-sitemap-content">
        {filteredSitemap.map((category, index) => (
          <div 
            key={index} 
            ref={el => sectionRefs.current[category.category] = el}
            className={`sit01-sitemap-category ${activeCategory === category.category ? 'expanded' : ''}`}
          >
            <h2 
              onClick={() => handleCategoryToggle(category.category)}
              className="sit01-category-header"
              tabIndex={0}
              role="button"
              aria-expanded={activeCategory === category.category}
            >
              {category.category}
              <span className="sit01-toggle-icon">
                {activeCategory === category.category ? '−' : '+'}
              </span>
            </h2>

            {(activeCategory === category.category || searchTerm) && (
              <div className="sit01-category-pages">
                {category.pages.map((page, pageIndex) => (
                  <div key={pageIndex} className="sit01-page-item">
                    <div className="sit01-page-title">{page.title}</div>
                    <div className="sit01-page-path">{page.path}</div>
                    <div className="sit01-page-description">{page.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="sit01-sitemap-summary">
        <h2>Platform Overview</h2>
        <div className="sit01-summary-stats">
          <div className="sit01-stat-item">
            <span className="sit01-stat-number">{sitemapStructure.length}</span>
            <span className="sit01-stat-label">Comprehensive Categories</span>
          </div>
          <div className="sit01-stat-item">
            <span className="sit01-stat-number">
              {sitemapStructure.reduce((total, category) => total + category.pages.length, 0)}
            </span>
            <span className="sit01-stat-label">Dedicated Resource Pages</span>
          </div>
        </div>
      </section>

      <footer className="sit01-sitemap-footer">
        <p>Last Updated: {getFormattedDate()} | Version {getVersionNumber()}</p>
        <div className="sit01-footer-links">
          <a href="#" aria-label="Report Site Issue">Report Site Issue</a>
          <a href="#" aria-label="Provide Feedback">Feedback</a>
          <a href="#" aria-label="XML Sitemap">Site Map XML</a>
        </div>
      </footer>
    </div>
  );
};

export default SitemapPage;