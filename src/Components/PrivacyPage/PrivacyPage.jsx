import React, { useState } from 'react';
import './PrivacyPage.css';

const PrivacyPage = () => {
  const [activeSection, setActiveSection] = useState(null);

  const privacySections = [
    {
      title: 'Information Collection',
      content: 'At grant.GOV, we meticulously collect personal information essential for comprehensive grant application processing. Our collection encompasses a wide range of data elements, including but not limited to: full legal name, contact information (email, phone, mailing address), academic credentials, professional background, research proposals, financial documentation, and organizational affiliations. We are committed to collecting only the information necessary to evaluate and process grant applications effectively, ensuring transparency and minimal intrusion into applicants\' personal lives.'
    },
    {
      title: 'Data Usage',
      content: 'The information collected through grant.GOV is utilized with the utmost precision and ethical consideration. Our primary objectives include thorough grant evaluation, administrative management, communication with applicants, and ensuring the integrity of the federal grant allocation process. We employ advanced data analysis techniques to assess application merit while maintaining strict confidentiality. Your data serves multiple critical functions: verifying eligibility, conducting comprehensive reviews, facilitating communication, and maintaining comprehensive records for potential future reference and audit purposes.'
    },
    {
      title: 'Information Security',
      content: 'grant.GOV implements state-of-the-art cybersecurity protocols designed to provide unparalleled protection of your personal and professional information. Our multi-layered security infrastructure includes advanced 256-bit encryption, secure cloud storage with continuous monitoring, multi-factor authentication, regular comprehensive security audits, intrusion detection systems, and compliance with the most stringent federal cybersecurity standards. We continuously update our security measures to defend against emerging digital threats, ensuring that your sensitive information remains protected throughout the entire grant application lifecycle.'
    },
    {
      title: 'User Rights',
      content: 'We recognize and staunchly protect your fundamental data rights. As an applicant, you possess comprehensive control over your personal information, including the right to: access all collected data, request detailed explanations about data usage, correct any inaccuracies, request partial or complete deletion of your information, and obtain a complete record of your interactions with grant.GOV. Our dedicated privacy officer is available to address any inquiries, provide transparent guidance, and facilitate the exercise of your data rights with efficiency and respect.'
    },
    {
      title: 'Compliance',
      content: 'grant.GOV operates under a rigorous framework of legal and ethical compliance. Our privacy practices meticulously adhere to multiple federal regulations, including but not limited to the Privacy Act of 1974, the Paperwork Reduction Act, Federal Information Security Management Act (FISMA), and emerging digital privacy standards. We maintain comprehensive documentation demonstrating our commitment to transparent, lawful, and ethical data handling practices, ensuring that every interaction meets or exceeds governmental privacy protection requirements.'
    },
    {
      title: 'Third-Party Sharing',
      content: 'We maintain an unwavering commitment to protecting your data from unauthorized sharing. grant.GOV strictly prohibits selling or renting personal information to commercial entities. Information may be shared exclusively with authorized government agencies for official purposes, always executed in full compliance with legal requirements, interagency data-sharing protocols, and stringent data protection standards. Any data sharing undergoes rigorous review to ensure absolute necessity and minimal exposure.'
    },
    {
      title: 'Data Retention',
      content: 'Personal information is retained through a carefully managed lifecycle aligned with legal and administrative requirements. Grant applications and associated data are preserved for a defined period necessary to complete processing, conduct potential reviews, and satisfy federal record-keeping mandates. After the requisite retention period, all personal data is securely deleted or anonymized using advanced data destruction methodologies that guarantee complete and irretrievable removal.'
    },
    {
      title: 'Cookies and Tracking',
      content: 'grant.GOV employs essential cookies exclusively designed to enhance user experience and platform functionality. These cookies are strictly limited to session management, performance monitoring, and maintaining application continuity. We do not utilize tracking technologies for personal profiling or marketing purposes. All cookie usage is transparent, with clear opt-out mechanisms available to users who prefer minimal digital tracking.'
    },
    {
      title: 'International Data Transfers',
      content: 'Recognizing the global nature of research and innovation, grant.GOV ensures meticulous compliance with international data protection regulations for applicants worldwide. Our data transfer protocols adhere to frameworks like the EU-US Privacy Shield principles, maintaining consistent high standards of security, privacy, and legal compliance regardless of the applicant\'s geographical location. We implement robust safeguards to protect cross-border data exchanges.'
    },
    {
      title: 'Children\'s Privacy',
      content: 'grant.GOV is an adult-oriented platform exclusively designed for professional and academic grant applications. We do not knowingly collect, process, or store personal information from individuals under 18 years of age. In the rare event that such information is inadvertently collected, it will be immediately and permanently deleted upon discovery, with additional safeguards implemented to prevent future occurrences.'
    },
    {
      title: 'Privacy Policy Updates',
      content: 'The digital landscape and regulatory environment are continuously evolving, and so is our privacy policy. grant.GOV reserves the right to periodically update our privacy practices to reflect technological advancements, regulatory changes, and enhanced protection mechanisms. Users will receive comprehensive notifications about significant policy modifications through multiple communication channels, including direct email, prominent website notifications, and explicit consent requirements for substantial changes.'
    },
    {
      title: 'Data Breach Notification',
      content: 'In the extremely unlikely scenario of a data security incident, grant.GOV is committed to a transparent, rapid, and comprehensive response. We pledge to promptly notify affected individuals and relevant authorities within legally mandated timeframes. Our incident response plan includes immediate investigation, potential mitigation strategies, detailed communication, and comprehensive support to minimize any potential negative impacts on our users.'
    },
    {
      title: 'Consent Withdrawal',
      content: 'We respect your autonomy in managing personal data. You may withdraw consent for data processing at any time through our secure user portal. However, it is crucial to understand that withdrawing consent may impact your ability to maintain an active grant application or receive critical communications. Our team provides clear guidance to help you make informed decisions about your data preferences.'
    },
    {
      title: 'Accessibility of Privacy Information',
      content: 'grant.GOV is committed to making our privacy policy comprehensible and accessible to all users. We provide multiple formats and support channels to ensure that every applicant can fully understand our data practices. Our privacy team offers personalized assistance, language translation services, and adaptive communication methods to accommodate diverse user needs and ensure transparent, inclusive communication.'
    }
  ];

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };

  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <h1>grant.GOV Privacy Policy</h1>
        <p>Comprehensive Protection of Your Personal Information</p>
      </header>

      <section className="privacy-overview">
        <h2>Our Commitment to Privacy</h2>
        <p>At grant.GOV, we are dedicated to maintaining the highest standards of privacy and data protection for all applicants, ensuring transparency, security, and respect for your personal and professional information. Our comprehensive approach goes beyond mere compliance, embedding privacy as a fundamental principle in every aspect of our platform.</p>
      </section>

      <section className="privacy-details">
        <div className="privacy-accordion">
          {privacySections.map((section, index) => (
            <div 
              key={index} 
              className={`privacy-section ${activeSection === index ? 'active' : ''}`}
            >
              <div 
                className="section-header" 
                onClick={() => toggleSection(index)}
              >
                <h3>{section.title}</h3>
                <span className="toggle-icon">
                  {activeSection === index ? '−' : '+'}
                </span>
              </div>
              {activeSection === index && (
                <div className="section-content">
                  <p>{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="privacy-contact">
        <h2>Contact Our Privacy Team</h2>
        <div className="contact-details">
          <p>Email: privacy@grant.gov</p>
          <p>Phone: 1-800-GRANTS</p>
          <p>Toll-Free Privacy Helpline: 1-855-PRIVACY</p>
          <p>Address: Federal Grant Privacy Office, 123 Government Plaza, Washington, DC 20500</p>
          <p>Office Hours: Monday-Friday, 8 AM - 6 PM EST</p>
          <p>Emergency Support: 24/7 Digital Security Incident Response</p>
        </div>
      </section>

      <section className="privacy-consent">
        <h2>Your Consent and Control</h2>
        <p>By utilizing grant.GOV, you acknowledge and consent to the comprehensive terms outlined in this privacy policy. We are committed to providing you unparalleled control, transparency, and security over your personal information. Our approach ensures that you remain the primary stakeholder in managing your data throughout the grant application process.</p>
      </section>
    </div>
  );
};

export default PrivacyPage;