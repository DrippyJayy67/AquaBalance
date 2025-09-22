import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Update URL hash for section navigation
    window.history.pushState(null, null, `#${section}`);
  };

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    navigate('/');
  };

  const sidebarItems = [
    { id: 'overview', icon: 'fas fa-tachometer-alt', label: 'Overview' },
    { id: 'water-usage', icon: 'fas fa-tint', label: 'Water Usage' },
    { id: 'compliance', icon: 'fas fa-shield-alt', label: 'Compliance' },
    { id: 'training', icon: 'fas fa-graduation-cap', label: 'Training' },
    { id: 'incentives', icon: 'fas fa-gift', label: 'Incentives' },
    { id: 'reports', icon: 'fas fa-chart-bar', label: 'Reports' },
    { id: 'profile', icon: 'fas fa-user', label: 'Profile' },
    { id: 'support', icon: 'fas fa-life-ring', label: 'Support' }
  ];

  const renderOverview = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2><i className="fas fa-tachometer-alt"></i> Dashboard Overview</h2>
        <p>Welcome back! Here's your car wash performance summary.</p>
      </div>

      <div className="stats-row">
        <div className="stat-card primary">
          <div className="stat-icon">
            <i className="fas fa-tint"></i>
          </div>
          <div className="stat-content">
            <h3>2,340 L</h3>
            <p>Water Used This Month</p>
            <span className="stat-change positive">-12% from last month</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>98%</h3>
            <p>Compliance Score</p>
            <span className="stat-change positive">+5% this month</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="fas fa-car"></i>
          </div>
          <div className="stat-content">
            <h3>156</h3>
            <p>Vehicles Washed</p>
            <span className="stat-change positive">+23 this week</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <i className="fas fa-coins"></i>
          </div>
          <div className="stat-content">
            <h3>R 2,340</h3>
            <p>Revenue This Month</p>
            <span className="stat-change positive">+18% growth</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <h3>Water Usage Trend</h3>
          <div className="chart-placeholder">
            <i className="fas fa-chart-line"></i>
            <p>Chart showing daily water usage for the past 30 days</p>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button onClick={() => handleSectionChange('water-usage')} className="action-btn">
              <i className="fas fa-plus"></i> Log Water Usage
            </button>
            <button onClick={() => handleSectionChange('training')} className="action-btn">
              <i className="fas fa-play"></i> Start Training
            </button>
            <button onClick={() => handleSectionChange('compliance')} className="action-btn">
              <i className="fas fa-clipboard-check"></i> Check Compliance
            </button>
            <button onClick={() => handleSectionChange('support')} className="action-btn">
              <i className="fas fa-phone"></i> Get Support
            </button>
          </div>
        </div>
      </div>

      <div className="alerts-section">
        <h3>Recent Alerts & Notifications</h3>
        <div className="alert-item success">
          <i className="fas fa-check-circle"></i>
          <div>
            <strong>Compliance Check Passed</strong>
            <p>Your monthly compliance report has been approved. Great work!</p>
            <small>2 hours ago</small>
          </div>
        </div>
        <div className="alert-item warning">
          <i className="fas fa-exclamation-triangle"></i>
          <div>
            <strong>Training Reminder</strong>
            <p>Water Conservation Workshop scheduled for tomorrow at 10:00 AM</p>
            <small>1 day ago</small>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWaterUsage = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2><i className="fas fa-tint"></i> Water Usage Management</h2>
        <p>Monitor and track your daily water consumption.</p>
      </div>

      <div className="usage-controls">
        <div className="usage-input">
          <h3>Log Today's Usage</h3>
          <div className="input-group">
            <input type="number" placeholder="Liters used" />
            <select>
              <option>Municipal Water</option>
              <option>Borehole Water</option>
              <option>Recycled Water</option>
            </select>
            <button className="btn btn-primary">Log Usage</button>
          </div>
        </div>

        <div className="usage-summary">
          <h3>This Month's Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">Total Usage:</span>
              <span className="value">2,340 L</span>
            </div>
            <div className="summary-item">
              <span className="label">Daily Average:</span>
              <span className="value">75.5 L</span>
            </div>
            <div className="summary-item">
              <span className="label">Per Vehicle:</span>
              <span className="value">15 L</span>
            </div>
            <div className="summary-item">
              <span className="label">Efficiency Score:</span>
              <span className="value efficiency-good">Good</span>
            </div>
          </div>
        </div>
      </div>

      <div className="usage-history">
        <h3>Recent Usage History</h3>
        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Source</th>
                <th>Liters Used</th>
                <th>Vehicles</th>
                <th>Efficiency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sept 22, 2025</td>
                <td>Municipal</td>
                <td>85 L</td>
                <td>6</td>
                <td className="efficiency-good">14.2 L/vehicle</td>
              </tr>
              <tr>
                <td>Sept 21, 2025</td>
                <td>Municipal</td>
                <td>92 L</td>
                <td>5</td>
                <td className="efficiency-warning">18.4 L/vehicle</td>
              </tr>
              <tr>
                <td>Sept 20, 2025</td>
                <td>Borehole</td>
                <td>78 L</td>
                <td>7</td>
                <td className="efficiency-excellent">11.1 L/vehicle</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2><i className="fas fa-shield-alt"></i> Compliance Status</h2>
        <p>Track your regulatory compliance and certifications.</p>
      </div>

      <div className="compliance-score">
        <div className="score-circle">
          <div className="score-value">98%</div>
          <div className="score-label">Overall Score</div>
        </div>
        <div className="score-breakdown">
          <div className="breakdown-item">
            <span className="item-label">Water Usage Reporting</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '100%'}}></div>
            </div>
            <span className="item-score">100%</span>
          </div>
          <div className="breakdown-item">
            <span className="item-label">Wastewater Management</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '95%'}}></div>
            </div>
            <span className="item-score">95%</span>
          </div>
          <div className="breakdown-item">
            <span className="item-label">Environmental Standards</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '98%'}}></div>
            </div>
            <span className="item-score">98%</span>
          </div>
        </div>
      </div>

      <div className="compliance-checklist">
        <h3>Compliance Checklist</h3>
        <div className="checklist-items">
          <div className="checklist-item completed">
            <i className="fas fa-check-circle"></i>
            <span>Monthly water usage report submitted</span>
            <small>Due: Sept 30 | Completed: Sept 22</small>
          </div>
          <div className="checklist-item completed">
            <i className="fas fa-check-circle"></i>
            <span>Wastewater disposal documentation</span>
            <small>Due: Quarterly | Completed: July 15</small>
          </div>
          <div className="checklist-item pending">
            <i className="fas fa-clock"></i>
            <span>Equipment maintenance records</span>
            <small>Due: Sept 25 | Status: Pending</small>
          </div>
          <div className="checklist-item upcoming">
            <i className="fas fa-calendar"></i>
            <span>Annual compliance inspection</span>
            <small>Scheduled: Oct 15</small>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTraining = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2><i className="fas fa-graduation-cap"></i> Training & Certification</h2>
        <p>Enhance your skills and stay updated with best practices.</p>
      </div>

      <div className="training-progress">
        <h3>Your Learning Progress</h3>
        <div className="progress-summary">
          <div className="progress-item">
            <span className="label">Courses Completed:</span>
            <span className="value">7/12</span>
          </div>
          <div className="progress-item">
            <span className="label">Certificates Earned:</span>
            <span className="value">3</span>
          </div>
          <div className="progress-item">
            <span className="label">Training Hours:</span>
            <span className="value">24.5</span>
          </div>
        </div>
      </div>

      <div className="courses-grid">
        <div className="course-card completed">
          <div className="course-header">
            <i className="fas fa-tint"></i>
            <span className="status-badge">Completed</span>
          </div>
          <h4>Water Conservation Basics</h4>
          <p>Learn fundamental water-saving techniques for car wash operations.</p>
          <div className="course-meta">
            <span><i className="fas fa-clock"></i> 2 hours</span>
            <span><i className="fas fa-certificate"></i> Certified</span>
          </div>
        </div>

        <div className="course-card in-progress">
          <div className="course-header">
            <i className="fas fa-recycle"></i>
            <span className="status-badge">In Progress</span>
          </div>
          <h4>Water Recycling Systems</h4>
          <p>Advanced techniques for implementing water recycling in your business.</p>
          <div className="course-meta">
            <span><i className="fas fa-clock"></i> 4 hours</span>
            <span><i className="fas fa-chart-line"></i> 60% Complete</span>
          </div>
          <button className="btn btn-primary">Continue Learning</button>
        </div>

        <div className="course-card available">
          <div className="course-header">
            <i className="fas fa-shield-alt"></i>
            <span className="status-badge">Available</span>
          </div>
          <h4>Environmental Compliance</h4>
          <p>Understanding regulations and maintaining compliance standards.</p>
          <div className="course-meta">
            <span><i className="fas fa-clock"></i> 3 hours</span>
            <span><i className="fas fa-star"></i> Recommended</span>
          </div>
          <button className="btn btn-secondary">Start Course</button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2><i className="fas fa-user"></i> Business Profile</h2>
        <p>Manage your business information and account settings.</p>
      </div>

      <div className="profile-grid">
        <div className="profile-info">
          <h3>Business Information</h3>
          <div className="info-group">
            <label>Business Name:</label>
            <span>Sipho's Quality Car Wash</span>
          </div>
          <div className="info-group">
            <label>Registration Number:</label>
            <span>CW2025-MAM-001</span>
          </div>
          <div className="info-group">
            <label>Location:</label>
            <span>Mamelodi, Tshwane</span>
          </div>
          <div className="info-group">
            <label>Operating Since:</label>
            <span>January 2025</span>
          </div>
          <button className="btn btn-secondary">Edit Information</button>
        </div>

        <div className="contact-info">
          <h3>Contact Details</h3>
          <div className="info-group">
            <label>Email:</label>
            <span>sipho@example.com</span>
          </div>
          <div className="info-group">
            <label>Phone:</label>
            <span>+27 12 345 6789</span>
          </div>
          <div className="info-group">
            <label>WhatsApp:</label>
            <span>+27 12 345 6789</span>
          </div>
          <button className="btn btn-secondary">Update Contact</button>
        </div>
      </div>

      <div className="account-settings">
        <h3>Account Settings</h3>
        <div className="settings-options">
          <div className="setting-item">
            <div className="setting-info">
              <strong>Email Notifications</strong>
              <p>Receive compliance reminders and updates</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <strong>SMS Alerts</strong>
              <p>Get important alerts via SMS</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <strong>Training Reminders</strong>
              <p>Reminders for upcoming training sessions</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'water-usage': return renderWaterUsage();
      case 'compliance': return renderCompliance();
      case 'training': return renderTraining();
      case 'profile': return renderProfile();
      case 'incentives':
        return (
          <div className="dashboard-section">
            <h2><i className="fas fa-gift"></i> Incentives & Grants</h2>
            <p>Explore available incentives and track your applications.</p>
            <div className="coming-soon">
              <i className="fas fa-tools"></i>
              <h3>Coming Soon</h3>
              <p>This section is under development.</p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="dashboard-section">
            <h2><i className="fas fa-chart-bar"></i> Reports & Analytics</h2>
            <p>Generate detailed reports on your water usage and performance.</p>
            <div className="coming-soon">
              <i className="fas fa-tools"></i>
              <h3>Coming Soon</h3>
              <p>This section is under development.</p>
            </div>
          </div>
        );
      case 'support':
        return (
          <div className="dashboard-section">
            <h2><i className="fas fa-life-ring"></i> Support Center</h2>
            <p>Get help and contact our support team.</p>
            <div className="support-options">
              <div className="support-card">
                <i className="fab fa-whatsapp"></i>
                <h3>WhatsApp Support</h3>
                <p>Quick help via WhatsApp</p>
                <a href="https://wa.me/27123587911" className="btn btn-success">Chat Now</a>
              </div>
              <div className="support-card">
                <i className="fas fa-envelope"></i>
                <h3>Email Support</h3>
                <p>Send us a detailed inquiry</p>
                <a href="mailto:aquabalance@tshwane.gov.za" className="btn btn-primary">Send Email</a>
              </div>
            </div>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/assets/A.png" alt="Aqua Balance" className="dashboard-logo" />
            <div>
              <h1>Aqua Balance Dashboard</h1>
              <p>Sipho's Quality Car Wash</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline">
              <i className="fas fa-bell"></i>
              <span className="notification-badge">3</span>
            </button>
            
            {/* User Profile Dropdown */}
            <div className="header-profile">
              <div className="profile-trigger">
                <img src="/assets/A.png" alt="User Avatar" className="profile-avatar-small" />
                <div className="profile-details">
                  <span className="profile-name">Sipho Mthembu</span>
                  <span className="profile-business">Quality Car Wash</span>
                </div>
                <i className="fas fa-chevron-down profile-arrow"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-layout">
        <nav className="dashboard-sidebar">
          <ul className="sidebar-menu">
            {sidebarItems.map(item => (
              <li key={item.id}>
                <button
                  className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleSectionChange(item.id)}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="sidebar-logout">
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </nav>

        <main className="dashboard-main">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;