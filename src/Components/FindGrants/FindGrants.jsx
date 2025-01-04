import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import { useGrantsContext } from '../../Context/GrantsContext';
import './FindGrants.css'

const CATEGORIES = [
  { 
    id: 'business',
    title: 'Business Grants',
    icon: 'FaStore',
    description: 'Funding for startups and small businesses',
    color: '#4A90E2'
  },
  { 
    id: 'community',
    title: 'Community Support',
    icon: 'FaHandHoldingHeart',
    description: 'Empowering community development initiatives',
    color: '#50E3C2'
  },
  { 
    id: 'education',
    title: 'Education Funding',
    icon: 'FaGraduationCap',
    description: 'Scholarships and academic opportunities',
    color: '#F5A623'
  },
  { 
    id: 'homebuyers',
    title: 'Home Buyers Aid',
    icon: 'FaHouseUser',
    description: 'Support for first-time home buyers',
    color: '#7ED321'
  },
  { 
    id: 'repairs',
    title: 'Home Repairs',
    icon: 'FaTools',
    description: 'Funding for essential home improvements',
    color: '#B8E986'
  },
  { 
    id: 'innovation',
    title: 'Innovation Grants',
    icon: 'FaLightbulb',
    description: 'Support for inventors and innovations',
    color: '#F8E71C'
  },
  { 
    id: 'minorities',
    title: 'Minority Support',
    icon: 'FaUserFriends',
    description: 'Empowering underrepresented communities',
    color: '#BD10E0'
  },
  { 
    id: 'personal',
    title: 'Personal Grants',
    icon: 'FaUserPlus',
    description: 'Assistance for individual needs',
    color: '#9013FE'
  },
  { 
    id: 'nonprofit',
    title: 'Non-Profit',
    icon: 'FaHandHoldingUsd',
    description: 'Supporting non-profit organizations',
    color: '#D0021B'
  },
  { 
    id: 'realestate',
    title: 'Real Estate',
    icon: 'FaLandmark',
    description: 'Real estate investment opportunities',
    color: '#417505'
  },
  {
    id: 'healthcare',
    title: 'Healthcare Grants',
    icon: 'FaMedkit',
    description: 'Medical research and healthcare initiatives',
    color: '#FF6B6B'
  },
  {
    id: 'disability',
    title: 'Disability Support',
    icon: 'FaWheelchair',
    description: 'Assistance for individuals with disabilities',
    color: '#4ECDC4'
  },
  {
    id: 'arts',
    title: 'Arts & Culture',
    icon: 'FaPalette',
    description: 'Supporting artistic and cultural projects',
    color: '#FF9F1C'
  },
  {
    id: 'environment',
    title: 'Environmental',
    icon: 'FaLeaf',
    description: 'Environmental conservation projects',
    color: '#2ECC71'
  },
  {
    id: 'research',
    title: 'Research Grants',
    icon: 'FaFlask',
    description: 'Scientific research funding',
    color: '#3498DB'
  },
  {
    id: 'international',
    title: 'International Aid',
    icon: 'FaGlobe',
    description: 'Global development initiatives',
    color: '#9B59B6'
  },
  {
    id: 'performing-arts',
    title: 'Performing Arts',
    icon: 'FaTheaterMasks',
    description: 'Theater, dance, and performance funding',
    color: '#E74C3C'
  },
  {
    id: 'sports',
    title: 'Sports Programs',
    icon: 'FaBasketballBall',
    description: 'Athletic programs and facilities',
    color: '#F39C12'
  },
  {
    id: 'youth',
    title: 'Youth Programs',
    icon: 'FaBaby',
    description: 'Supporting youth development',
    color: '#16A085'
  },
  {
    id: 'agriculture',
    title: 'Agricultural Grants',
    icon: 'FaSeedling',
    description: 'Farming and agricultural initiatives',
    color: '#27AE60'
  },
  {
    id: 'emergency',
    title: 'Emergency Relief',
    icon: 'FaHeart',
    description: 'Disaster and emergency assistance',
    color: '#E84393'
  }
];

const FindGrants = () => {
  const navigate = useNavigate();
  const { state, actions } = useGrantsContext();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (actions.loadGrants) {
      actions.loadGrants(selectedCategory);
    }
  }, [selectedCategory, actions]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (actions.searchGrants) {
      actions.searchGrants(searchQuery);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate('/apply', { state: { categoryId } });
  };

  const getIconComponent = (iconName) => {
    return FaIcons[iconName];
  };

  return (
    <div className="find022-find-grants-page">
      <div className="find022-hero-section">
        <h1>Discover Your Perfect Grant</h1>
        <p>Choose from our wide range of grant categories and start your journey today</p>
        
        <div className="find022-search-section">
            <form onSubmit={handleSearch} className="find022-search-form">
                <div className="find022-search-input">
                <FaIcons.FaSearch className="find022-search-icon" />
                <input
                    type="text"
                    placeholder="Search for specific grants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
            </form>

          <div className="find022-filter-controls">
            <button 
              className="find022-filter-toggle"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FaIcons.FaFilter /> Filter Options
            </button>
            <div className="find022-sort-control">
              <FaIcons.FaSort />
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="find022-categories-grid">
        {CATEGORIES.map((category) => {
          const IconComponent = getIconComponent(category.icon);
          return (
            <div 
              key={category.id}
              className={`find022-category-card ${hoveredCard === category.id ? 'hovered' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={() => setHoveredCard(category.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{'--category-color': category.color}}
            >
              <div className="find022-category-icon">
                {IconComponent && <IconComponent />}
              </div>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <button 
                className="find022-apply-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryClick(category.id);
                }}
              >
                Apply Now
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FindGrants;