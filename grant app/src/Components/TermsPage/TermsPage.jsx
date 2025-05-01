import React, { useState } from 'react';
import './TermsPage.css';

const TermsPage = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const termsSections = [
    {
      category: 'User Eligibility',
      sections: [
        {
          title: 'Citizenship Requirements',
          content: 'To apply for grants through grant.GOV, applicants must be U.S. citizens or permanent residents with valid immigration status. Our comprehensive verification process includes thorough background checks, cross-referencing with multiple federal databases to ensure absolute compliance. Citizenship verification extends beyond simple documentation, encompassing a holistic review of applicant credentials, legal standing, and national security protocols. Non-U.S. citizens may be considered in exceptional circumstances with specific research or innovation projects that demonstrate significant national interest.'
        },
        {
          title: 'Age and Legal Status',
          content: 'Strict eligibility criteria mandate that all grant applicants must be at least 18 years of age and possess a valid Social Security Number. This requirement ensures legal accountability and financial traceability. Individuals with current legal restrictions, pending investigations, or documented financial misconduct may be automatically disqualified. grant.GOV maintains a comprehensive screening process that evaluates not just age and identification, but also professional credibility, ethical standing, and potential contribution to national research and innovation objectives.'
        }
      ]
    },
    {
      category: 'Application Process',
      sections: [
        {
          title: 'Submission Guidelines',
          content: 'grant.GOV online platform represents the pinnacle of secure, streamlined grant application technology. All submissions must be completed through our encrypted digital interface, with zero tolerance for incomplete or fraudulent applications. Applicants bear complete responsibility for accuracy, comprehensiveness, and integrity of submitted information. Our advanced verification algorithms cross-check every submitted detail against multiple federal and academic databases, ensuring unprecedented levels of data validation. Applications deemed incomplete or suspicious will be immediately flagged, with potential long-term implications for future grant eligibility.'
        },
        {
          title: 'Documentation Requirements',
          content: 'Comprehensive documentation is the cornerstone of a successful grant application on grant.GOV. Mandatory submission materials include: meticulously verified proof of identity, authenticated academic credentials, detailed financial statements, exhaustive project proposals, and supporting research documentation. All documents must be current, professionally formatted, and submitted exclusively in approved digital formats – PDF, DOCX, and specific XML schemas. Our platform employs cutting-edge document verification technologies, including digital signatures, blockchain-verified credentials, and multi-stage authentication processes to guarantee document integrity and prevent fraudulent submissions.'
        }
      ]
    },
    {
      category: 'Financial Terms',
      sections: [
        {
          title: 'Grant Disbursement',
          content: 'Financial disbursement on grant.GOV follows a rigorous, milestone-driven approach. Approved grants are released in strategically predetermined installments, directly tied to verifiable project achievements. Recipients must provide comprehensive financial reports, including detailed expenditure breakdowns, progress documentation, and future projection analyses. Each financial milestone requires explicit approval from our dedicated review board. Failure to meet predetermined milestones, demonstrate fiscal responsibility, or adhere to strict expenditure guidelines can result in immediate grant termination, financial penalties, and potential exclusion from future funding opportunities.'
        },
        {
          title: 'Fund Usage Restrictions',
          content: 'Grant funds allocated through grant.GOV are subject to extraordinarily stringent usage restrictions. Funds must be utilized exclusively for the exact purposes outlined in the original, approved project proposal. Any deviation, regardless of intention, constitutes a severe breach of contractual terms and may trigger immediate legal recourse. Our advanced tracking mechanisms, including financial forensics and periodic comprehensive audits, ensure absolute compliance. Unauthorized fund usage can result in not only grant termination but potential federal investigations, permanent disqualification from future grants, and potential criminal proceedings for fraudulent misappropriation of government resources.'
        }
      ]
    },
    {
      category: 'Legal Obligations',
      sections: [
        {
          title: 'Compliance Requirements',
          content: 'grant.GOV mandates uncompromising legal compliance from all grant recipients. This encompasses a multi-layered obligation to adhere to federal regulations, maintain pristine financial record-keeping, and submit meticulously detailed periodic progress reports. Our compliance framework extends beyond mere documentation – it represents a comprehensive commitment to national research integrity. Non-compliance can trigger a cascading series of consequences: immediate financial penalties, suspension of current funding, long-term restrictions on future grant applications, potential referral to federal investigative agencies, and professional reputation damage within academic and research communities.'
        },
        {
          title: 'Intellectual Property',
          content: 'Intellectual property management on grant.GOV represents a nuanced balance between individual innovator rights and national public interest. While grant recipients retain primary intellectual property rights to their research and innovations, the U.S. government reserves a critical non-exclusive, royalty-free license. This provision allows potential utilization and dissemination of project outcomes for broader public benefit, national security, or technological advancement. Our IP framework ensures that groundbreaking research can potentially serve broader societal objectives while protecting the fundamental rights of individual researchers and institutional innovators.'
        }
      ]
    },
    {
      category: 'Privacy and Data Management',
      sections: [
        {
          title: 'Data Protection',
          content: 'grant.GOV implements an unparalleled, multi-layered data protection strategy that far exceeds standard federal privacy standards. All personal and project-related data undergo continuous protection through advanced quantum encryption, blockchain-verified security protocols, and real-time threat monitoring systems. Our cybersecurity infrastructure is designed to repel sophisticated digital threats, ensuring absolute confidentiality of sensitive applicant information. Continuous security audits, machine learning-powered anomaly detection, and partnerships with leading cybersecurity institutions guarantee that your data remains impenetrable and absolutely secure.'
        },
        {
          title: 'Information Sharing',
          content: 'Information sharing on grant.GOV occurs under extraordinarily strict, legally sanctioned protocols. Personal information may be selectively shared with authorized government agencies exclusively for critical purposes: comprehensive verification, strategic research coordination, and essential administrative functions. Every information transfer undergoes multiple layers of legal review, ensuring absolute compliance with the most stringent federal privacy regulations. Our information-sharing framework prioritizes minimal exposure, targeted communication, and absolute transparency, providing applicants with complete visibility into potential data interactions.'
        }
      ]
    }
  ];

  const toggleSection = (category, index) => {
    setExpandedSections(prev => ({
      ...prev,
      [`${category}-${index}`]: !prev[`${category}-${index}`]
    }));
  };

  return (
    <div className="terms-page">
      <header className="terms-header">
        <div className="header-content">
          <h1>grant.GOV Terms of Service</h1>
          <p>Comprehensive Guidelines for U.S. Grant Applicants</p>
        </div>
      </header>

      <section className="terms-overview">
        <h2>Welcome to grant.GOV</h2>
        <p>Our mission transcends mere grant allocation – we are a comprehensive platform dedicated to fostering innovation, supporting groundbreaking research, and empowering the most brilliant minds across the United States. These terms outline not just guidelines, but our commitment to transparency, fairness, and the highest standards of technological and academic excellence.</p>
      </section>

      <section className="terms-accordion">
        {termsSections.map((category, categoryIndex) => (
          <div key={categoryIndex} className="terms-category">
            <h2 className="category-title">{category.category}</h2>
            {category.sections.map((section, sectionIndex) => {
              const uniqueKey = `${category.category}-${sectionIndex}`;
              return (
                <div 
                  key={uniqueKey} 
                  className={`terms-section ${expandedSections[uniqueKey] ? 'expanded' : ''}`}
                >
                  <div 
                    className="section-header" 
                    onClick={() => toggleSection(category.category, sectionIndex)}
                  >
                    <h3>{section.title}</h3>
                    <span className="toggle-icon">
                      {expandedSections[uniqueKey] ? '−' : '+'}
                    </span>
                  </div>
                  {expandedSections[uniqueKey] && (
                    <div className="section-content">
                      <p>{section.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </section>

      <section className="terms-legal-notice">
        <h2>Legal Acknowledgment</h2>
        <p>By accessing and utilizing grant.GOV, you enter into a comprehensive digital agreement that transcends traditional terms of service. Your continued engagement represents a commitment to academic integrity, national innovation, and the highest standards of professional conduct. Each interaction with our platform is a pledge to uphold the principles of transparency, excellence, and collaborative progress.</p>
      </section>

      <section className="terms-contact">
        <h2>Questions or Concerns?</h2>
        <div className="contact-methods">
          <div className="contact-item">
            <h3>Legal Support</h3>
            <p>Email: legal@grant.gov</p>
            <p>Phone: 1-888-GRANT-LEGAL</p>
          </div>
          <div className="contact-item">
            <h3>Technical Support</h3>
            <p>Email: support@grant.gov</p>
            <p>Phone: 1-800-GRANT-HELP</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;