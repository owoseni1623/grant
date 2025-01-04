import React, { useState, useEffect } from 'react';
import './GrantResources.css';

const GrantResources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [animateSection, setAnimateSection] = useState(false);
  const [downloadError, setDownloadError] = useState({});

  useEffect(() => {
    setAnimateSection(true);
    return () => setAnimateSection(false);
  }, []);

  const resourceCategories = [
    'all',
    'education',
    'small-business',
    'research',
    'nonprofit',
    'agriculture',
    'technology'
  ];

  const resourceData = [
    {
      id: 1,
      title: "Comprehensive Grant Writing Toolkit",
      category: "education",
      description: "Detailed guide covering grant application strategies, proposal writing, and best practices.",
      difficulty: "Beginner",
      downloadLink: "/apply",
      icon: "📚",
      content: `# Comprehensive Grant Writing Toolkit

## Introduction to Grant Writing
Grant writing is a critical skill for securing funding for your projects, research, or organization.

## Key Components of a Successful Grant Proposal
1. Clear Project Description
2. Detailed Budget
3. Measurable Outcomes
4. Strong Organizational Background

## Best Practices
- Research the funding source thoroughly
- Follow application guidelines precisely
- Demonstrate project impact
- Proofread and edit carefully

## Common Mistakes to Avoid
- Vague project descriptions
- Unrealistic budget projections
- Lack of clear objectives
- Missed deadlines

## Recommended Timeline
- Initial research: 2-3 weeks
- Drafting proposal: 3-4 weeks
- Review and editing: 1-2 weeks
- Final submission: Minimum 1 week before deadline

© 2024 Grant Writing Resources Center`
    },
    {
      id: 2,
      title: "Small Business Innovation Grant Guide",
      category: "small-business",
      description: "Specialized resource for entrepreneurs seeking federal funding for innovative projects.",
      difficulty: "Intermediate",
      downloadLink: "/apply",
      icon: "🚀",
      content: `# Small Business Innovation Grant Guide

## Understanding Innovation Grants
Innovation grants provide crucial funding for promising business ideas and technological advancements.

## Types of Innovation Grants
1. Federal Grants
2. State-Level Grants
3. Private Sector Grants
4. Research and Development Grants

## Eligibility Criteria
- Innovative business concept
- Potential for economic impact
- Clear technological or scientific advancement
- Solid business plan

## Application Strategy
- Develop a compelling narrative
- Demonstrate market potential
- Provide detailed technical specifications
- Show team's expertise

## Funding Stages
- Seed Funding: Initial concept development
- Early-Stage Funding: Prototype development
- Scale-Up Funding: Market expansion

## Key Funding Sources
- Small Business Innovation Research (SBIR)
- Small Business Technology Transfer (STTR)
- Department of Energy Grants
- National Science Foundation Funding

© 2024 Small Business Innovation Resources`
    },
    {
      id: 3,
      title: "Research Funding Landscape Report",
      category: "research",
      description: "Comprehensive analysis of current federal research grant opportunities across disciplines.",
      difficulty: "Advanced",
      downloadLink: "/apply",
      icon: "🔬",
      content: `# Research Funding Landscape Report

## Current Funding Trends
Research funding is evolving with increased focus on interdisciplinary and innovative projects.

## Major Funding Categories
1. Scientific Research
2. Medical Research
3. Technology Innovation
4. Social Science Research

## Top Funding Agencies
- National Institutes of Health (NIH)
- National Science Foundation (NSF)
- Department of Defense (DoD)
- Department of Energy (DOE)

## Emerging Research Areas
- Artificial Intelligence
- Climate Change Solutions
- Biotechnology
- Quantum Computing

## Grant Application Tips
- Collaborate across disciplines
- Demonstrate societal impact
- Include comprehensive methodology
- Provide clear budget justification

## Funding Success Rates
- Medical Research: 18-22%
- Physical Sciences: 15-20%
- Social Sciences: 10-15%
- Technology Innovation: 12-18%

© 2024 Research Funding Insights`
    },
    {
      id: 4,
      title: "Nonprofit Sustainability Funding Playbook",
      category: "nonprofit",
      description: "Strategic guide to securing and maintaining grant funding for mission-driven organizations.",
      difficulty: "Intermediate",
      downloadLink: "/apply",
      icon: "🤝",
      content: `# Nonprofit Sustainability Funding Playbook

## Funding Landscape for Nonprofits
Sustainable funding is crucial for long-term organizational success.

## Funding Strategies
1. Diversified Revenue Streams
2. Grant Writing
3. Corporate Sponsorships
4. Individual Donations

## Grant Acquisition Techniques
- Develop a compelling mission statement
- Create impact-driven proposals
- Build strong community relationships
- Demonstrate financial responsibility

## Reporting and Accountability
- Detailed financial reporting
- Impact measurement
- Transparent communication
- Regular donor engagement

## Funding Sources
- Federal Grants
- Foundation Grants
- Corporate Giving Programs
- Community Foundations

## Sustainability Checklist
- Clear organizational goals
- Robust financial management
- Continuous donor cultivation
- Adaptable funding strategies

© 2024 Nonprofit Funding Resources`
    },
    {
      id: 5,
      title: "Agricultural Innovation Grant Navigator",
      category: "agriculture",
      description: "Specialized resource for agricultural researchers and innovators seeking federal funding.",
      difficulty: "Advanced",
      downloadLink: "/apply",
      icon: "🌾",
      content: `# Agricultural Innovation Grant Navigator

## Agricultural Funding Landscape
Innovative agricultural research is critical for global food security and sustainability.

## Grant Categories
1. Sustainable Farming Techniques
2. Crop Research
3. Agricultural Technology
4. Environmental Conservation

## Key Funding Agencies
- USDA Research Grants
- National Institute of Food and Agriculture
- Department of Energy
- Environmental Protection Agency

## Research Priority Areas
- Climate-Resilient Crops
- Precision Agriculture
- Sustainable Farming Practices
- Agricultural Biotechnology

## Application Strategies
- Demonstrate innovative approach
- Show potential environmental impact
- Provide detailed research methodology
- Highlight team's expertise

## Successful Grant Components
- Clear problem statement
- Innovative solution
- Measurable outcomes
- Budget transparency

© 2024 Agricultural Innovation Funding`
    },
    {
      id: 6,
      title: "Tech Startup Funding Masterclass",
      category: "technology",
      description: "Comprehensive guide to securing grants for technology and digital innovation projects.",
      difficulty: "Advanced",
      downloadLink: "/apply",
      icon: "💻",
      content: `# Tech Startup Funding Masterclass

## Technology Funding Ecosystem
Navigating the complex world of tech startup funding.

## Funding Stages
1. Seed Funding
2. Angel Investment
3. Venture Capital
4. Government Grants

## Grant Opportunities
- SBIR/STTR Programs
- NSF Innovation Grants
- Department of Energy Funding
- Defense Advanced Research Projects

## Pitch Preparation
- Compelling Narrative
- Technological Differentiation
- Market Potential
- Team Credibility

## Funding Success Factors
- Innovative Technology
- Scalable Business Model
- Strong Intellectual Property
- Clear Market Need

## Tech Grant Writing Tips
- Quantify Technological Impact
- Demonstrate Competitive Advantage
- Show Technical Feasibility
- Highlight Team's Expertise

© 2024 Tech Startup Funding Insights`
    }
  ];

  const webinars = [
    {
      id: 1,
      title: "Grant Application Fundamentals",
      date: "Upcoming: January 15, 2024",
      time: "2:00 PM EST",
      registrationLink: "/apply"
    },
    {
      id: 2,
      title: "Nonprofit Funding Strategies",
      date: "Upcoming: February 22, 2024",
      time: "3:30 PM EST",
      registrationLink: "/apply"
    },
    {
      id: 3,
      title: "Research Grant Success Secrets",
      date: "Upcoming: March 10, 2024",
      time: "1:00 PM EST",
      registrationLink: "/apply"
    }
  ];

  const filteredResources = resourceData.filter(resource => 
    (activeCategory === 'all' || resource.category === activeCategory) &&
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (fileContent, title) => {
    try {
      // Create a temporary file with the content
      const blob = new Blob([fileContent], { type: 'text/plain' });
      const fileName = `${title.replace(/\s+/g, '-').toLowerCase()}.txt`;
      
      // Create a temporary file URL
      const url = window.URL.createObjectURL(blob);
      
      // Create a hidden link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Attempt to open with default text editor
      window.open(url, '_blank');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again or contact support.');
    }
  };

  return (
    <div className="res004-resources-container">
      <header className="res004-resources-hero">
        <div className="res004-hero-content">
          <h1>grant.GOV Resources Center</h1>
          <p>Empowering Your Funding Journey with Comprehensive Tools and Insights</p>
        </div>
      </header>

      <section className="res004-search-section">
        <input 
          type="text" 
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="res004-search-input"
        />
      </section>

      <section className="res004-category-navigation">
        {resourceCategories.map(category => (
          <button
            key={category}
            className={`res004-category-btn ${activeCategory === category ? 'res004-active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category.replace('-', ' ')}
          </button>
        ))}
      </section>

      <section className="res004-resources-grid">
        {filteredResources.map(resource => (
          <div key={resource.id} className="res004-resource-card">
            <div className="res004-resource-icon">{resource.icon}</div>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <div className="res004-resource-meta">
              <span>Difficulty: {resource.difficulty}</span>
              <button 
                onClick={() => handleDownload(resource.fileContent, resource.title)} 
                className="res004-download-btn"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="res004-webinars-section">
        <h2>Upcoming Webinars</h2>
        <div className="res004-webinars-grid">
          {webinars.map(webinar => (
            <div key={webinar.id} className="res004-webinar-card">
              <h3>{webinar.title}</h3>
              <p>{webinar.date}</p>
              <p>{webinar.time}</p>
              <a href="/apply" className="res004-register-btn">Register Now</a>
            </div>
          ))}
        </div>
      </section>

      <section className="res004-expert-support">
        <h2>Need Expert Guidance?</h2>
        <div className="res004-support-grid">
          <div className="res004-support-card">
            <h3>1:1 Consultation</h3>
            <p>Personal guidance from grant experts</p>
            <a href="/apply" className="res004-book-btn">Book Session</a>
          </div>
          <div className="res004-support-card">
            <h3>Community Forum</h3>
            <p>Connect with fellow grant applicants</p>
            <a href="/apply" className="res004-join-btn">Join Forum</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GrantResources;