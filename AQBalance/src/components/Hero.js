import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Enhanced parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElement = document.querySelector('.hero-parallax');
      if (parallaxElement) {
        // More pronounced parallax effect
        const rate = scrolled * -0.3;
        const scale = 1.2 + (scrolled * 0.0002);
        const opacity = Math.max(0.05, 0.15 - (scrolled * 0.0003));
        
        parallaxElement.style.transform = `translateX(-50%) translateY(${rate}px) scale(${scale})`;
        parallaxElement.style.opacity = opacity;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-parallax">
        <img src="/assets/tlogo.png" alt="Tshwane Logo" className="parallax-logo" />
      </div>
      <div className="hero-content">
        <h1>Regulating Water Use, Empowering Enterprise</h1>
        <p className="hero-subtitle">
          Balancing Opportunity with Sustainability—Join the movement to protect our water and grow your business.
        </p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn btn-secondary">
            <i className="fas fa-edit"></i> Register Your Car Wash
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;