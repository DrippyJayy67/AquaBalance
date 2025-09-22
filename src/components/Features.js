import React from 'react';

const Features = () => {
  const features = [
    {
      icon: 'fas fa-map-marked-alt',
      title: 'Car Wash Locator',
      description: 'Interactive map of registered car washes with detailed information about water sources, compliance status, and contact details.'
    },
    {
      icon: 'fas fa-water',
      title: 'Water Source Tracker',
      description: 'Monitor and track municipal vs. borehole water usage across all registered car wash facilities in real-time.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Wastewater Compliance',
      description: 'Guidelines, inspection schedules, and compliance tracking for proper wastewater disposal and environmental protection.'
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Training & Certification',
      description: 'Free workshops and certification programs for informal operators to transition into formal micro-enterprises.'
    },
    {
      icon: 'fas fa-money-bill-wave',
      title: 'Discounts',
      description: 'Earn a 10% discount on your next registration renewal for maintaining compliance for 3 consecutive months!'
    },
    {
      icon: 'fas fa-chart-bar',
      title: 'Performance Dashboard',
      description: 'Track your water usage, compliance scores, and compare performance with best practices in the industry.'
    }
  ];

  return (
    <section className="features section-reveal" id="features">
      <div className="container">
        <h2 className="section-title">Key Features & Services</h2>
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