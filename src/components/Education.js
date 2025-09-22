import React from 'react';

const Education = () => {
  const educationCards = [
    {
      icon: 'fas fa-recycle',
      title: 'Water Recycling & Reuse',
      description: 'Implement smart recycling systems to dramatically reduce water consumption',
      tips: [
        'Install Water Reclaim Systems: Capture and treat rinse water for reuse in pre-wash cycles',
        'Use Multi-Stage Filtration: Filter water through sediment, carbon, and reverse osmosis stages',
        'Separate Grey Water: Collect soap water separately from clean rinse water for different reuse purposes',
        'Rain Water Harvesting: Install gutters and tanks to collect rainwater for non-drinking uses',
        'Monitor Water Quality: Test recycled water regularly to ensure it meets safety standards'
      ]
    },
    {
      icon: 'fas fa-tint',
      title: 'Efficient Equipment & Techniques',
      description: 'Optimize your washing process with water-saving equipment and methods',
      tips: [
        'High-Pressure, Low-Volume Nozzles: Use specialized nozzles that clean effectively with 50% less water',
        'Automatic Shut-off Triggers: Install trigger guns that stop water flow when not actively washing',
        'Pre-Rinse with Minimal Water: Use misting systems or pressure washers for initial dirt removal',
        'Microfiber Technology: Switch to microfiber cloths that require less water and cleaning solution',
        'Waterless Wash Products: Offer waterless or steam cleaning options for lightly soiled vehicles'
      ]
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Smart Monitoring & Management',
      description: 'Track and optimize your water usage with modern monitoring technologies',
      tips: [
        'Install Smart Water Meters: Monitor real-time usage and identify leaks immediately',
        'Set Daily Water Budgets: Establish limits and alerts to prevent excessive consumption',
        'Track Usage Per Vehicle: Calculate water efficiency ratios and set improvement targets',
        'Regular Leak Detection: Conduct weekly inspections of hoses, connections, and storage tanks',
        'Staff Training Programs: Educate employees on water conservation techniques and best practices'
      ]
    }
  ];

  return (
    <section className="education section-reveal transparent" id="education">
      <div className="container">
        <h2 className="section-title">Education & Awareness</h2>
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '3rem', 
          fontSize: '1.1em', 
          color: '#000000' 
        }}>
          Empowering car wash businesses with knowledge and tools for sustainable water management
        </p>
        
        <div className="education-content">
          {educationCards.map((card, index) => (
            <div key={index} className="education-card">
              <h3>
                <i className={card.icon}></i> {card.title}
              </h3>
              <p>{card.description}</p>
              <ul className="education-links">
                {card.tips.map((tip, tipIndex) => (
                  <li key={tipIndex}>
                    <strong>{tip.split(':')[0]}:</strong> {tip.split(':')[1]}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;