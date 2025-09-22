import React, { useEffect, useRef, useState } from 'react';

const Dashboard = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    {
      icon: 'fas fa-car',
      number: '1,247',
      label: 'Total Registered Car Washes'
    },
    {
      icon: 'fas fa-tint',
      number: '2.8M',
      label: 'Liters Monthly Water Use'
    },
    {
      icon: 'fas fa-check-circle',
      number: '73%',
      label: 'Compliant with Wastewater Disposal'
    },
    {
      icon: 'fas fa-chart-line',
      number: '342',
      label: 'Informal Car Washes Formalized This Year'
    }
  ];

  useEffect(() => {
    const animateCounters = () => {
      if (hasAnimated) return;
      
      const counters = document.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        const target = counter.innerText;
        const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
        let current = 0;
        const increment = numericTarget / 100;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= numericTarget) {
            counter.innerText = target;
            clearInterval(timer);
          } else {
            if (target.includes('M')) {
              counter.innerText = current.toFixed(1) + 'M';
            } else if (target.includes('%')) {
              counter.innerText = Math.floor(current) + '%';
            } else {
              counter.innerText = Math.floor(current).toLocaleString();
            }
          }
        }, 20);
      });
      
      setHasAnimated(true);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <section className="dashboard section-reveal" id="dashboard" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Live Portal Statistics</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <i className={`${stat.icon} stat-icon`}></i>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;