import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  return (
    <section className="about-us section-reveal" id="about">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('about.title')}</h2>
          <p className="section-subtitle">{t('about.subtitle')}</p>
        </div>
      </div>
    </section>
  );
};

export default About;