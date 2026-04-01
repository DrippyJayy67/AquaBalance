import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Features = () => {
  const { t } = useLanguage();
  const features = [
    {
      icon: 'fas fa-map-marked-alt',
      title: t('feature.1.title'),
      description: t('feature.1.desc')
    },
    {
      icon: 'fas fa-water',
      title: t('feature.2.title'),
      description: t('feature.2.desc')
    },
    {
      icon: 'fas fa-shield-alt',
      title: t('feature.3.title'),
      description: t('feature.3.desc')
    },
    {
      icon: 'fas fa-graduation-cap',
      title: t('feature.4.title'),
      description: t('feature.4.desc')
    },
    {
      icon: 'fas fa-money-bill-wave',
      title: t('feature.5.title'),
      description: t('feature.5.desc')
    },
    {
      icon: 'fas fa-chart-bar',
      title: t('feature.6.title'),
      description: t('feature.6.desc')
    }
  ];

  return (
    <section className="features section-reveal" id="features">
      <div className="container">
        <h2 className="section-title">{t('features.title')}</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <i className={`${feature.icon} feature-icon`}></i>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;