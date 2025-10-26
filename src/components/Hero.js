import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Hero = () => {
  // removed unused navigate and smooth-scroll helper to satisfy linter

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

  const { t } = useLanguage();

  return (
    <section className="hero" id="home">
      <div className="hero-parallax">
        <img src="/assets/tlogo.png" alt="Tshwane Logo" className="parallax-logo" />
      </div>
      <div className="hero-content">
        <h1>{t('hero.h1')}</h1>
        <p className="hero-subtitle">{t('hero.subtitle')}</p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn btn-secondary">
            <i className="fas fa-edit"></i> {t('hero.registerBtn')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;