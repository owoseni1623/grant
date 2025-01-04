import React, { useState, useEffect } from 'react';
import './LatestNewsPage.css';

const LatestNewsPage = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [newsItems, setNewsItems] = useState([
        {
          id: 1,
          title: "Federal Grant Funding Increases for Small Businesses",
          date: "November 15, 2024",
          category: "small-business",
          summary: "The government announces a significant boost in grant funding for innovative small business initiatives across various sectors.",
          fullArticleLink: "#",
          imageUrl: "/Images/grannt3.webp",
          tags: ["Funding", "Small Business", "Innovation"],
          fullContent: `
            <h2>Empowering Small Businesses: A Comprehensive Grant Funding Initiative</h2>
            
            <p>In a groundbreaking move, the federal government has announced a substantial increase in grant funding specifically designed to support and accelerate small business growth across the United States. This initiative aims to provide critical financial support to innovative entrepreneurs and emerging businesses that are driving economic transformation.</p>
            
            <h3>Key Highlights of the Grant Program</h3>
            
            <ul>
              <li><strong>Total Funding Pool:</strong> $500 million allocated for small business grants</li>
              <li><strong>Target Sectors:</strong> Technology, Green Energy, Healthcare, Agriculture, and Digital Innovation</li>
              <li><strong>Grant Ranges:</strong> From $50,000 to $250,000 per qualifying business</li>
            </ul>
            
            <h3>Eligibility Criteria</h3>
            
            <p>To be considered for these grants, businesses must demonstrate:</p>
            
            <ol>
              <li>Innovative business models with potential for significant market impact</li>
              <li>Clear technological or service-based innovation</li>
              <li>Scalability and potential for job creation</li>
              <li>Commitment to sustainable business practices</li>
            </ol>
            
            <h3>Application Process</h3>
            
            <p>The application process will be streamlined and transparent, with key milestones including:</p>
            
            <ul>
              <li>Online application submission through the official government grants portal</li>
              <li>Initial screening based on preliminary documentation</li>
              <li>Detailed business plan and innovation pitch review</li>
              <li>Final selection by a panel of industry experts and government representatives</li>
            </ul>
            
            <h3>Impact and Future Outlook</h3>
            
            <p>This grant initiative is more than just financial support; it represents a strategic investment in the future of American innovation. By supporting small businesses, the government aims to:</p>
            
            <ol>
              <li>Stimulate economic growth and job creation</li>
              <li>Encourage technological advancement</li>
              <li>Support entrepreneurial ecosystems across diverse regions</li>
              <li>Position the United States as a global leader in innovation</li>
            </ol>
            
            <p>Applications will open on December 1, 2024, with a deadline of January 31, 2025. Interested small businesses are encouraged to prepare their documentation and innovative proposals.</p>
          `
        },
        {
          id: 2,
          title: "Breakthrough Research Grants Announced for Climate Solutions",
          date: "October 22, 2024",
          category: "research",
          summary: "Major funding allocated to groundbreaking research projects addressing climate change and environmental sustainability.",
          fullArticleLink: "#",
          imageUrl: "/Images/grannt.jpeg",
          tags: ["Research", "Climate", "Sustainability"],
          fullContent: `
            <h2>Climate Innovation: A New Era of Research Funding</h2>
            
            <p>In an unprecedented commitment to addressing global climate challenges, a comprehensive research grant program has been launched to fund groundbreaking scientific initiatives focused on environmental sustainability and climate solutions.</p>
            
            <h3>Program Overview</h3>
            
            <ul>
              <li><strong>Total Investment:</strong> $750 million in research grants</li>
              <li><strong>Focus Areas:</strong> Renewable Energy, Carbon Capture, Sustainable Agriculture, Ocean Conservation</li>
              <li><strong>Grant Ranges:</strong> $100,000 to $5 million per research project</li>
            </ul>
            
            <h3>Research Priority Domains</h3>
            
            <ol>
              <li>Advanced Renewable Energy Technologies</li>
              <li>Carbon Sequestration and Negative Emissions</li>
              <li>Climate Adaptation Strategies</li>
              <li>Sustainable Urban and Agricultural Systems</li>
            </ol>
            
            <h3>Evaluation Criteria</h3>
            
            <p>Research proposals will be rigorously evaluated based on:</p>
            
            <ul>
              <li>Scientific innovation and potential global impact</li>
              <li>Feasibility of implementation</li>
              <li>Potential for scalable solutions</li>
              <li>Interdisciplinary approach</li>
            </ul>
            
            <h3>Expected Outcomes</h3>
            
            <p>The government anticipates that these grants will:</p>
            
            <ol>
              <li>Accelerate breakthrough climate technologies</li>
              <li>Create new job opportunities in green sectors</li>
              <li>Develop sustainable solutions for global environmental challenges</li>
              <li>Position the United States as a leader in climate innovation</li>
            </ol>
            
            <p>Application period opens November 15, 2024, with submissions accepted until February 28, 2025. Researchers and institutions are encouraged to prepare comprehensive and innovative proposals.</p>
          `
        },
        {
          id: 3,
          title: "Nonprofit Sector Receives Unprecedented Support",
          date: "September 5, 2024",
          category: "nonprofit",
          summary: "New grant programs aim to strengthen nonprofit organizations' capabilities and community impact.",
          fullArticleLink: "#",
          imageUrl: "/Images/grannt0.png",
          tags: ["Nonprofit", "Community", "Funding"],
          fullContent: `
            <h2>Empowering Nonprofits: A Comprehensive Support Initiative</h2>
            
            <p>The federal government has unveiled an extraordinary grant program designed to revitalize and strengthen the nonprofit sector, recognizing its crucial role in community development and social progress.</p>
            
            <h3>Program Highlights</h3>
            
            <ul>
              <li><strong>Total Funding Allocation:</strong> $400 million</li>
              <li><strong>Target Areas:</strong> Community Development, Social Services, Education, Healthcare, Environmental Conservation</li>
              <li><strong>Grant Ranges:</strong> $25,000 to $500,000 per organization</li>
            </ul>
            
            <h3>Key Objectives</h3>
            
            <ol>
              <li>Enhance organizational capacity</li>
              <li>Support innovative community programs</li>
              <li>Improve operational efficiency</li>
              <li>Expand impact and reach</li>
            </ol>
            
            <h3>Eligibility and Focus</h3>
            
            <p>Nonprofits will be evaluated based on:</p>
            
            <ul>
              <li>Clear mission and community impact</li>
              <li>Demonstrated effectiveness</li>
              <li>Innovative approach to solving social challenges</li>
              <li>Potential for scalable solutions</li>
            </ul>
            
            <h3>Application Process</h3>
            
            <p>The streamlined application process includes:</p>
            
            <ol>
              <li>Online application submission</li>
              <li>Comprehensive organizational review</li>
              <li>Impact assessment</li>
              <li>Final selection by expert panel</li>
            </ol>
            
            <p>Applications open October 1, 2024, with a submission deadline of December 15, 2024. Nonprofits are encouraged to prepare detailed proposals highlighting their unique contributions.</p>
          `
        },
        {
          id: 4,
          title: "Tech Innovation Grants Expanding Digital Frontier",
          date: "August 18, 2024",
          category: "technology",
          summary: "Government launches comprehensive grant program to support cutting-edge technological innovations.",
          fullArticleLink: "#",
          imageUrl: "/Images/grannt1.avif",
          tags: ["Technology", "Innovation", "Digital"],
          fullContent: `
            <h2>Digital Transformation: Powering Technological Innovation</h2>
            
            <p>In a bold move to accelerate technological advancement, the government has launched a comprehensive grant program targeting emerging digital technologies and innovative tech solutions.</p>
            
            <h3>Program Framework</h3>
            
            <ul>
              <li><strong>Total Investment:</strong> $600 million</li>
              <li><strong>Focus Domains:</strong> AI, Quantum Computing, Cybersecurity, Biotechnology, Advanced Robotics</li>
              <li><strong>Grant Ranges:</strong> $100,000 to $2 million per project</li>
            </ul>
            
            <h3>Innovation Priority Areas</h3>
            
            <ol>
              <li>Artificial Intelligence and Machine Learning</li>
              <li>Quantum Computing Breakthroughs</li>
              <li>Next-Generation Cybersecurity</li>
              <li>Biotechnological Innovations</li>
            </ol>
            
            <h3>Selection Criteria</h3>
            
            <p>Technological proposals will be evaluated on:</p>
            
            <ul>
              <li>Technological novelty</li>
              <li>Potential market disruption</li>
              <li>Scalability</li>
              <li>Societal and economic impact</li>
            </ul>
            
            <h3>Anticipated Outcomes</h3>
            
            <p>The government expects these grants to:</p>
            
            <ol>
              <li>Drive technological innovation</li>
              <li>Create high-value tech jobs</li>
              <li>Maintain global technological leadership</li>
              <li>Foster entrepreneurial ecosystems</li>
            </ol>
            
            <p>Application period begins September 1, 2024, with submissions accepted until November 30, 2024. Tech innovators and startups are invited to submit groundbreaking proposals.</p>
          `
        },
        {
          id: 5,
          title: "Agricultural Sustainability Grants Revolutionize Farming",
          date: "July 30, 2024",
          category: "agriculture",
          summary: "New grant initiatives focus on supporting sustainable agricultural practices and technological advancements.",
          fullArticleLink: "#",
          imageUrl: "/Images/grannt2.jpg",
          tags: ["Agriculture", "Sustainability", "Technology"],
          fullContent: `
            <h2>Agricultural Revolution: Sustainable Farming Innovations</h2>
            
            <p>A groundbreaking grant initiative aims to transform agricultural practices through sustainable technologies and innovative farming methodologies, addressing critical challenges in food production and environmental conservation.</p>
            
            <h3>Program Composition</h3>
            
            <ul>
              <li><strong>Total Funding Allocation:</strong> $450 million</li>
              <li><strong>Focus Areas:</strong> Sustainable Farming, Precision Agriculture, Climate-Resilient Crops, AgriTech</li>
              <li><strong>Grant Ranges:</strong> $75,000 to $750,000 per project</li>
            </ul>
            
            <h3>Strategic Innovation Domains</h3>
            
            <ol>
              <li>Sustainable Crop Management</li>
              <li>Water-Efficient Agricultural Technologies</li>
              <li>Climate-Adaptive Farming Techniques</li>
              <li>Regenerative Agricultural Practices</li>
            </ol>
            
            <h3>Evaluation Parameters</h3>
            
            <p>Project proposals will be assessed based on:</p>
            
            <ul>
              <li>Environmental sustainability</li>
              <li>Technological innovation</li>
              <li>Potential for food security improvement</li>
              <li>Scalability of solutions</li>
            </ul>
            
            <h3>Transformative Goals</h3>
            
            <p>The initiative aims to:</p>
            
            <ol>
              <li>Enhance agricultural productivity</li>
              <li>Reduce environmental footprint</li>
              <li>Support small and medium-scale farmers</li>
              <li>Develop climate-resilient agricultural systems</li>
            </ol>
            
            <p>Applications open August 15, 2024, with a submission deadline of October 31, 2024. Farmers, researchers, and agricultural innovators are encouraged to apply.</p>
          `
        }
    ]);

  const [featuredNews, setFeaturedNews] = useState(newsItems[0]);
  const [trendingTags, setTrendingTags] = useState([
    "Funding", "Innovation", "Research", 
    "Sustainability", "Technology", "Nonprofit"
  ]);

  const newsCategories = [
    'all', 'small-business', 'research', 
    'nonprofit', 'technology', 'agriculture'
  ];

  const filteredNews = newsItems.filter(news => 
    (activeCategory === 'all' || news.category === activeCategory) &&
    news.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTagClick = (tag) => {
    setSearchTerm(tag.toLowerCase());
  };

  const openArticleModal = (article) => {
    setSelectedArticle(article);
  };

  const closeArticleModal = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="lat022-news-container">
      <header className="lat022-news-hero">
        <div className="lat022-hero-content">
          <h1>Latest grant.GOV News</h1>
          <p>Stay Informed About Funding Opportunities and Innovations</p>
        </div>
      </header>

      <section className="lat022-search-section">
        <input 
          type="text" 
          placeholder="Search news articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="lat022-search-input"
        />
      </section>

      <div className="lat022-news-layout">
        <section className="lat022-main-content">
          <div className="lat022-category-navigation">
            {newsCategories.map(category => (
              <button
                key={category}
                className={`lat022-category-btn ${activeCategory === category ? 'lat022-active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category.replace('-', ' ')}
              </button>
            ))}
          </div>

          <section className="lat022-featured-news">
            <div className="lat022-featured-card">
              <img src={featuredNews.imageUrl} alt={featuredNews.title} className="lat022-featured-image" />
              <div className="lat022-featured-content">
                <span className="lat022-featured-tag">Featured</span>
                <h2>{featuredNews.title}</h2>
                <p>{featuredNews.summary}</p>
                <div className="lat022-featured-meta">
                  <span>{featuredNews.date}</span>
                  <button 
                    onClick={() => openArticleModal(featuredNews)} 
                    className="lat022-read-more"
                  >
                    Read Full Article
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="lat022-news-grid">
            {filteredNews.map(news => (
              <div key={news.id} className="lat022-news-card">
                <img src={news.imageUrl} alt={news.title} className="lat022-news-image" />
                <div className="lat022-news-content">
                  <h3>{news.title}</h3>
                  <p>{news.summary}</p>
                  <div className="lat022-news-meta">
                    <span>{news.date}</span>
                    <button 
                      onClick={() => openArticleModal(news)} 
                      className="lat022-read-more"
                    >
                      Read More
                    </button>
                  </div>
                  <div className="lat022-news-tags">
                    {news.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="lat022-tag"
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </section>

        <aside className="lat022-sidebar">
          <section className="lat022-trending-tags">
            <h3>Trending Topics</h3>
            <div className="lat022-tags-container">
              {trendingTags.map(tag => (
                <span 
                  key={tag} 
                  className="lat022-sidebar-tag"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section className="lat022-newsletter-signup">
            <h3>Stay Updated</h3>
            <p>Subscribe to our newsletter for the latest grant news</p>
            <form className="lat022-newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="lat022-email-input"
              />
              <button type="submit" className="lat022-subscribe-btn">Subscribe</button>
            </form>
          </section>
        </aside>
      </div>

      {selectedArticle && (
        <div className="lat022-article-modal" onClick={closeArticleModal}>
          <div 
            className="lat022-article-modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lat022-modal-close" onClick={closeArticleModal}>×</button>
            <div className="lat022-modal-header">
              <h2>{selectedArticle.title}</h2>
              <span>{selectedArticle.date}</span>
            </div>
            <img 
              src={selectedArticle.imageUrl} 
              alt={selectedArticle.title} 
              className="lat022-modal-image" 
            />
            <div 
              className="lat022-modal-body"
              dangerouslySetInnerHTML={{ __html: selectedArticle.fullContent }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestNewsPage;