import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: targetId } });
      return;
    }
    
    // If we're on the home page, scroll to the element
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };


  const { locale, setLocale, t } = useLanguage();

  const [username, setUsername] = useState('Guest');

  useEffect(() => {
    const stored = localStorage.getItem('adminUser');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUsername(parsed.name || parsed.username || String(parsed));
      } catch (e) {
        setUsername(stored);
      }
    }
  }, []);

  const handleLanguageChange = (e) => {
    setLocale(e.target.value);
  };

  const isAdminDashboard = location.pathname === '/admin/dashboard';

  return (
    <header className="header">
      <nav className="nav-container">
        <div className="logo-section">
          <div className="logo">
            <img src="/assets/A.png" alt="City of Tshwane Logo" />
          </div>
          <div>
            <div className="portal-title">{t('portalTitle')}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              {t('portalSubtitle')}
            </div>
          </div>
        </div>
        {!isAdminDashboard && (
          <ul className="nav-menu">
            <li>
              <Link to="/" onClick={(e) => handleSmoothScroll(e, 'home')}>
                {t('home')}
              </Link>
            </li>
            <li>
              <Link to="/signup">{t('register')}</Link>
            </li>
            <li>
              <Link to="/login">{t('signin')}</Link>
            </li>
            <li>
              <Link to="/admin/login">Admin</Link>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')}>
                {t('contact')}
              </a>
            </li>
          </ul>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="language-toggle">
          <select value={locale} onChange={handleLanguageChange} aria-label="Select language">
            <option value="en">English</option>
            <option value="se">Sepedi</option>
            <option value="zu">isiZulu</option>
          </select>
          </div>

          {/* Only profile in global header; notification kept on Dashboard/AdminDashboard pages */}
          {username !== 'Guest' && (
            <div className="header-profile">
              <div className="profile-trigger" onClick={() => navigate('/admin/dashboard')}>
                <img src="/assets/A.png" alt="User Avatar" className="profile-avatar-small" />
                <div className="profile-details">
                  <span className="profile-name">{username}</span>
                </div>
                <i className="fas fa-chevron-down profile-arrow" />
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;