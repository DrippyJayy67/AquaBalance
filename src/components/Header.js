import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

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

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header className="header">
      <nav className="nav-container">
        <div className="logo-section">
          <div className="logo">
            <img src="/assets/A.png" alt="City of Tshwane Logo" />
          </div>
          <div>
            <div className="portal-title">Aqua Balance</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              Water Regulation & Support Portal
            </div>
          </div>
        </div>
        <ul className="nav-menu">
          <li>
            <Link to="/" onClick={(e) => handleSmoothScroll(e, 'home')}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/signup">Register Your Car Wash</Link>
          </li>
          <li>
            <Link to="/login">Sign In</Link>
          </li>
          <li>
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')}>
              Contact Us
            </a>
          </li>
        </ul>
        <div className="language-toggle">
          <select>
            <option>English</option>
            <option>Sepedi</option>
            <option>isiZulu</option>
          </select>
        </div>
      </nav>
    </header>
  );
};

export default Header;