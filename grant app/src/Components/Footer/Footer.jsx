import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaUserCog
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if admin is authenticated when component mounts
  useEffect(() => {
    // Check for admin token in localStorage
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!adminToken); // Convert to boolean (true if token exists, false otherwise)
  }, []);

  return (
    <footer className="platform-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/find-grants">Find Grants</Link></li>
            <li><Link to="/apply">Apply</Link></li>
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/news">Latest News</Link></li>
            {isAdmin && (
              <li className="admin-link">
                <Link to="/admin">
                  <FaUserCog /> Admin Panel
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="contact-info">
            <p><FaEnvelope /> support@grantsplatform.com</p>
            <p><FaPhone /> +1 (555) 123-4567</p>
          </div>
          <div className="social-icons">
            <a 
              href="https://facebook.com/grantsplatform" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
            >
              <FaFacebook />
            </a>
            <a 
              href="https://twitter.com/grantsplatform" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Follow us on Twitter"
            >
              <FaTwitter />
            </a>
            <a 
              href="https://linkedin.com/company/grantsplatform" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Follow us on LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a 
              href="https://instagram.com/grantsplatform" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Grants Platform. All Rights Reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/sitemap">Sitemap</Link>
          {isAdmin && (
            <Link to="/admin" className="admin-link">Admin</Link>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;