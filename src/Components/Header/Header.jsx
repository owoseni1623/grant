import React, { useState, useEffect } from 'react';
import { useGrantsContext } from '../../Context/GrantsContext';
import { FaUser, FaBell, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { state, actions } = useGrantsContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    const backdrop = document.querySelector('.mobile-menu-backdrop');
    backdrop?.classList.toggle('active');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    const backdrop = document.querySelector('.mobile-menu-backdrop');
    backdrop?.classList.remove('active');
  };

  const handleLogin = () => {
    navigate('/login');
    closeMenu();
  };

  const handleRegister = () => {
    navigate('/register');
    closeMenu();
  };

  const renderUserSection = () => {
    if (state.isAuthenticated) {
      return (
        <div className="user-section">
          <div className="notifications">
            <FaBell className="notification-icon" />
            {state.notifications.length > 0 && (
              <span className="notification-badge">
                {state.notifications.length}
              </span>
            )}
          </div>
          <div className="user-profile">
            <img
              src={state.user.avatar || '/default-avatar.png'}
              alt="User Profile"
              className="profile-image"
            />
            <span className="user-name">{state.user.name}</span>
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              actions.logout();
              closeMenu();
            }}
            aria-label="Logout"
          >
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      );
    }
    return (
      <div className="auth-buttons">
        <Link to="/login" className="login-btn" onClick={handleLogin}>
          Login
        </Link>
        <Link to="/register" className="register-btn" onClick={handleRegister}>
          Register
        </Link>
      </div>
    );
  };

  const renderSearchBar = () => (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search grants..."
        value={state.searchQuery}
        onChange={(e) => actions.searchGrants(e.target.value)}
        className="search-input"
      />
      <FaSearch className="search-icon" />
    </div>
  );

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Find Grants', path: '/find-grants' },
    { name: 'Apply', path: '/apply' }
  ];

  return (
    <>
      <div className="mobile-menu-backdrop" onClick={closeMenu}></div>
      <header className={`grants-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="logo-section">
            <Link to="/" className="logo-link" onClick={closeMenu}>
              <img
                src="/Images/grant logo0.png"
                alt="Grants.gov Logo"
                className="header-logo"
              />
              <span className="site-title">grant.GOV</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-navigation">
            <ul className="nav-links">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Header Actions */}
          <div className="header-actions desktop-only">
            {renderSearchBar()}
            {renderUserSection()}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`mobile-menu-toggle ${isMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Mobile Navigation */}
          <div className={`mobile-navigation ${isMenuOpen ? 'mobile-open' : ''}`}>
            <ul className="nav-links">
              {navigationItems.map((item, index) => (
                <li
                  key={item.name}
                  style={{ '--item-index': index }}
                >
                  <Link
                    to={item.path}
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            {renderSearchBar()}
            {renderUserSection()}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;