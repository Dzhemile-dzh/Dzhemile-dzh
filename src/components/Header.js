import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const { language, changeLanguage, t } = useLanguage();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isGalleryActive = () => {
    return location.pathname.startsWith('/gallery/');
  };

  const getActiveYear = () => {
    const match = location.pathname.match(/^\/gallery\/(\d{4})/);
    return match ? match[1] : null;
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
    setActiveSubItem(null);
  };

  const handleSubItemClick = (dropdownName, subItem) => {
    setActiveSubItem(subItem);
    setIsMenuOpen(false);
    closeDropdowns();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    closeDropdowns();
  };

  const handleLanguageChange = (newLang) => {
    changeLanguage(newLang);
    setIsMenuOpen(false);
    closeDropdowns();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-dropdown')) {
        closeDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="modern-header">
      <nav className="modern-nav">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo" aria-label="Doarti Art Gallery - Home">
            <img 
              src="/images/logo-doarti.png" 
              alt="Dzhemile Ahmed - Doarti Art Gallery Logo" 
              className="logo-img"
              style={{ maxWidth: '120px', maxHeight: '80px', width: 'auto', height: 'auto' }}
            />
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          {/* Navigation Menu */}
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <ul className="nav-list">
              {/* Home */}
              <li className="nav-item">
                <Link 
                  to="/" 
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.home')}
                </Link>
              </li>

              {/* About */}
              <li className="nav-item">
                <Link 
                  to="/about" 
                  className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.about')}
                </Link>
              </li>

              {/* Paintings Dropdown */}
              <li className="nav-item nav-dropdown">
                <button 
                  className={`nav-link dropdown-btn ${isGalleryActive() ? 'sub-active' : ''} ${activeDropdown === 'paintings' ? 'active' : ''}`}
                  onClick={() => toggleDropdown('paintings')}
                >
                  {t('header.paintings')}
                  <span className="dropdown-arrow">▼</span>
                </button>
                <div className={`dropdown-menu ${activeDropdown === 'paintings' ? 'show' : ''}`}>
                  {(() => {
                    const yearsData = t('header.years');
                    if (yearsData && typeof yearsData === 'object' && !Array.isArray(yearsData)) {
                      return Object.entries(yearsData).reverse().map(([year, label]) => (
                        <Link 
                          key={year}
                          to={`/gallery/${year}`}
                          className={`dropdown-item ${getActiveYear() === year ? 'active' : ''}`}
                          onClick={() => handleSubItemClick('paintings', `paintings-${year}`)}
                        >
                          {String(label)}
                        </Link>
                      ));
                    }
                    return null;
                  })()}
                </div>
              </li>

              {/* Language Dropdown */}
              <li className="nav-item nav-dropdown">
                <button 
                  className={`nav-link dropdown-btn ${activeDropdown === 'language' ? 'active' : ''} ${activeSubItem && activeSubItem.startsWith('language-') ? 'sub-active' : ''}`}
                  onClick={() => toggleDropdown('language')}
                >
                  {language.toUpperCase()}
                  <span className="dropdown-arrow">▼</span>
                </button>
                <div className={`dropdown-menu ${activeDropdown === 'language' ? 'show' : ''}`}>
                  <button 
                    className={`dropdown-item ${activeSubItem === 'language-en' ? 'active' : ''}`}
                    onClick={() => {
                      handleLanguageChange('en');
                      setActiveSubItem('language-en');
                    }}
                  >
                    EN
                  </button>
                  <button 
                    className={`dropdown-item ${activeSubItem === 'language-bg' ? 'active' : ''}`}
                    onClick={() => {
                      handleLanguageChange('bg');
                      setActiveSubItem('language-bg');
                    }}
                  >
                    BG
                  </button>
                </div>
              </li>

              {/* Contact Button */}
              <li className="nav-item">
                <Link 
                  to="/contact" 
                  className="nav-link contact-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;