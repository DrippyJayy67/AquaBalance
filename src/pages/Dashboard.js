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
    { id: 'profile', icon: 'fas fa-user', label: 'Profile' },
    { id: 'support', icon: 'fas fa-life-ring', label: 'Support' }
  ];

  // Sample water usage data for the past 30 days
  const waterUsageData = [
    { date: 'Aug 24', usage: 85, day: 'Mon' },
    { date: 'Aug 25', usage: 92, day: 'Tue' },
    { date: 'Aug 26', usage: 78, day: 'Wed' },
    { date: 'Aug 27', usage: 89, day: 'Thu' },
    { date: 'Aug 28', usage: 95, day: 'Fri' },
    { date: 'Aug 29', usage: 110, day: 'Sat' },
    { date: 'Aug 30', usage: 105, day: 'Sun' },
    { date: 'Aug 31', usage: 88, day: 'Mon' },
    { date: 'Sep 01', usage: 82, day: 'Tue' },
    { date: 'Sep 02', usage: 76, day: 'Wed' },
    { date: 'Sep 03', usage: 91, day: 'Thu' },
    { date: 'Sep 04', usage: 87, day: 'Fri' },
    { date: 'Sep 05', usage: 103, day: 'Sat' },
    { date: 'Sep 06', usage: 98, day: 'Sun' },
    { date: 'Sep 07', usage: 79, day: 'Mon' },
    { date: 'Sep 08', usage: 84, day: 'Tue' },
    { date: 'Sep 09', usage: 77, day: 'Wed' },
    { date: 'Sep 10', usage: 93, day: 'Thu' },
    { date: 'Sep 11', usage: 89, day: 'Fri' },
    { date: 'Sep 12', usage: 106, day: 'Sat' },
    { date: 'Sep 13', usage: 112, day: 'Sun' },
    { date: 'Sep 14', usage: 86, day: 'Mon' },
    { date: 'Sep 15', usage: 81, day: 'Tue' },
    { date: 'Sep 16', usage: 75, day: 'Wed' },
    { date: 'Sep 17', usage: 90, day: 'Thu' },
    { date: 'Sep 18', usage: 85, day: 'Fri' },
    { date: 'Sep 19', usage: 99, day: 'Sat' },
    { date: 'Sep 20', usage: 78, day: 'Sun' },
    { date: 'Sep 21', usage: 92, day: 'Mon' },
    { date: 'Sep 22', usage: 85, day: 'Tue' }
  ];

  // Line chart component
  const WaterUsageChart = () => {
    const chartWidth = 600;
    const chartHeight = 250;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    const maxUsage = Math.max(...waterUsageData.map(d => d.usage));
    const minUsage = Math.min(...waterUsageData.map(d => d.usage));
    const usageRange = maxUsage - minUsage;

    // Create SVG path for the line
    const createPath = () => {
      return waterUsageData.map((point, index) => {
        const x = (index / (waterUsageData.length - 1)) * innerWidth;
        const y = innerHeight - ((point.usage - minUsage) / usageRange) * innerHeight;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ');
    };

    // Create gradient area path
    const createAreaPath = () => {
      const linePath = waterUsageData.map((point, index) => {
        const x = (index / (waterUsageData.length - 1)) * innerWidth;
        const y = innerHeight - ((point.usage - minUsage) / usageRange) * innerHeight;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ');
      
      return `${linePath} L ${innerWidth} ${innerHeight} L 0 ${innerHeight} Z`;
    };

    return (
      <div className="water-usage-chart">
        <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Define gradient */}
          <defs>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#2e7d4f', stopOpacity: 0.35}} />
              <stop offset="100%" style={{stopColor: '#2e7d4f', stopOpacity: 0.06}} />
            </linearGradient>
          </defs>

          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((percent) => {
              const y = innerHeight - (percent / 100) * innerHeight;
              return (
                <g key={percent}>
                  <line
                    x1={0}
                    y1={y}
                    x2={innerWidth}
                    y2={y}
                    stroke="#e9ecef"
                    strokeWidth={1}
                    strokeDasharray="2,2"
                  />
                  <text
                    x={-10}
                    y={y + 5}
                    textAnchor="end"
                    fontSize={10}
                    fill="#666"
                  >
                    {Math.round(minUsage + (percent / 100) * usageRange)}L
                  </text>
                </g>
              );
            })}

            {/* Area fill */}
            <path
              d={createAreaPath()}
              fill="url(#waterGradient)"
            />

            {/* Line */}
            <path
              d={createPath()}
              fill="none"
              stroke="#2e7d4f"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {waterUsageData.map((point, index) => {
              const x = (index / (waterUsageData.length - 1)) * innerWidth;
              const y = innerHeight - ((point.usage - minUsage) / usageRange) * innerHeight;
              
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r={4}
                    fill="#2e7d4f"
                    stroke="white"
                    strokeWidth={2}
                    className="chart-point"
                  />
                  {/* Tooltip on hover */}
                  <circle
                    cx={x}
                    cy={y}
                    r={8}
                    fill="transparent"
                    className="chart-hover-area"
                    data-date={point.date}
                    data-usage={point.usage}
                    data-day={point.day}
                  />
                </g>
              );
            })}

            {/* X-axis labels (show every 5th day) */}
            {waterUsageData.map((point, index) => {
              if (index % 5 === 0 || index === waterUsageData.length - 1) {
                const x = (index / (waterUsageData.length - 1)) * innerWidth;
                return (
                  <text
                    key={index}
                    x={x}
                    y={innerHeight + 20}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#666"
                  >
                    {point.date.split(' ')[1]}
                  </text>
                );
              }
              return null;
            })}

            {/* Trend line */}
            <line
              x1={0}
              y1={innerHeight * 0.6}
              x2={innerWidth}
              y2={innerHeight * 0.4}
              stroke="#4caf50"
              strokeWidth={2}
              strokeDasharray="5,5"
              opacity={0.7}
            />
          </g>
        </svg>

        {/* Chart statistics */}
        <div className="chart-stats">
          <div className="chart-stat">
            <div className="stat-icon primary">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">-8%</span>
              <span className="stat-label">vs last month</span>
            </div>
          </div>
          <div className="chart-stat">
            <div className="stat-icon success">
              <i className="fas fa-arrow-down"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">87L</span>
              <span className="stat-label">avg daily</span>
            </div>
          </div>
          <div className="chart-stat">
            <div className="stat-icon warning">
              <i className="fas fa-calendar-week"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">30</span>
              <span className="stat-label">days tracked</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          <div className="chart-header">
            <h3><i className="fas fa-tint"></i> Water Usage Trend</h3>
            <div className="chart-controls">
              <button className="chart-control-btn active">30D</button>
              <button className="chart-control-btn">7D</button>
              <button className="chart-control-btn">1D</button>
            </div>
          </div>
          <p className="chart-description">Daily water consumption for the past 30 days showing efficiency improvements</p>
          <WaterUsageChart />
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
        <p>Monitor and track your daily water consumption with detailed analytics.</p>
      </div>

      {/* Water Usage Stats Cards */}
      <div className="stats-row">
        <div className="stat-card primary">
          <div className="stat-icon">
            <i className="fas fa-tint"></i>
          </div>
          <div className="stat-content">
            <h3>2,340 L</h3>
            <p>Total Usage This Month</p>
            <span className="stat-change positive">-12% from last month</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>75.5 L</h3>
            <p>Daily Average</p>
            <span className="stat-change positive">Efficient usage</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="fas fa-car-side"></i>
          </div>
          <div className="stat-content">
            <h3>15.0 L</h3>
            <p>Per Vehicle Average</p>
            <span className="stat-change positive">Good efficiency</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <i className="fas fa-recycle"></i>
          </div>
          <div className="stat-content">
            <h3>18%</h3>
            <p>Recycled Water Usage</p>
            <span className="stat-change positive">+5% this month</span>
          </div>
        </div>
      </div>

      {/* Water Source Breakdown */}
      <div className="dashboard-grid">
        <div className="chart-card">
          <h3><i className="fas fa-pie-chart"></i> Water Source Breakdown</h3>
          <div className="source-breakdown">
            <div className="source-item">
              <div className="source-info">
                <div className="source-icon primary">
                  <i className="fas fa-building"></i>
                </div>
                <div className="source-details">
                  <h4>Municipal Water</h4>
                  <p>1,872 L (80%)</p>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill primary" style={{width: '80%'}}></div>
              </div>
            </div>
            
            <div className="source-item">
              <div className="source-info">
                <div className="source-icon success">
                  <i className="fas fa-well-water-pump"></i>
                </div>
                <div className="source-details">
                  <h4>Borehole Water</h4>
                  <p>234 L (10%)</p>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill success" style={{width: '10%'}}></div>
              </div>
            </div>
            
            <div className="source-item">
              <div className="source-info">
                <div className="source-icon info">
                  <i className="fas fa-recycle"></i>
                </div>
                <div className="source-details">
                  <h4>Recycled Water</h4>
                  <p>234 L (10%)</p>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill info" style={{width: '10%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="usage-controls">
          <div className="usage-input">
            <h3><i className="fas fa-plus-circle"></i> Log Today's Usage</h3>
            <div className="input-group">
              <div className="input-field">
                <label>Liters Used</label>
                <input type="number" placeholder="Enter amount" />
              </div>
              <div className="input-field">
                <label>Water Source</label>
                <select>
                  <option>Municipal Water</option>
                  <option>Borehole Water</option>
                  <option>Recycled Water</option>
                </select>
              </div>
              <div className="input-field">
                <label>Vehicles Washed</label>
                <input type="number" placeholder="Number of vehicles" />
              </div>
              <button className="btn btn-primary">
                <i className="fas fa-save"></i> Log Usage
              </button>
            </div>
          </div>
          <div className="usage-payments">
            <h3><i className="fas fa-credit-card"></i> Payments</h3>
            <div className="payment-card">
              <div className="payment-row">
                <div>
                  <small>Last Payment</small>
                  <div className="payment-amount">R 1,200.00</div>
                </div>
                <div className="payment-date">Sept 10, 2025</div>
              </div>

              <div className="payment-row pending">
                <div>
                  <small>Pending Charges</small>
                  <div className="payment-amount">R 320.00</div>
                </div>
                <div className="payment-actions">
                  <button className="btn btn-outline btn-sm">View</button>
                </div>
              </div>

              <div className="payment-actions-footer">
                <button className="btn btn-success"><i className="fas fa-check"></i> Record Payment</button>
                <button className="btn btn-secondary"><i className="fas fa-file-invoice"></i> View Invoices</button>
              </div>
            </div>
            <p className="payment-note">Note: a 10% discount is applied automatically when you have 3 consecutive months of approved compliance reports (see Incentives).</p>
          </div>
        </div>
      </div>

      {/* Usage History with Enhanced Table */}
      <div className="usage-history">
        <div className="section-header-small">
          <h3><i className="fas fa-history"></i> Recent Usage History</h3>
        </div>
        <div className="enhanced-table">
          <table>
            <thead>
              <tr>
                <th><i className="fas fa-calendar"></i> Date</th>
                <th><i className="fas fa-tint"></i> Source</th>
                <th><i className="fas fa-flask"></i> Liters Used</th>
                <th><i className="fas fa-car"></i> Vehicles</th>
                <th><i className="fas fa-chart-bar"></i> Efficiency</th>
                <th><i className="fas fa-star"></i> Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sept 22, 2025</td>
                <td>
                  <span className="source-badge primary">Municipal</span>
                </td>
                <td><strong>85 L</strong></td>
                <td>6</td>
                <td>14.2 L/vehicle</td>
                <td>
                  <span className="efficiency-badge success">Excellent</span>
                </td>
              </tr>
              <tr>
                <td>Sept 21, 2025</td>
                <td>
                  <span className="source-badge primary">Municipal</span>
                </td>
                <td><strong>92 L</strong></td>
                <td>5</td>
                <td>18.4 L/vehicle</td>
                <td>
                  <span className="efficiency-badge warning">Good</span>
                </td>
              </tr>
              <tr>
                <td>Sept 20, 2025</td>
                <td>
                  <span className="source-badge success">Borehole</span>
                </td>
                <td><strong>78 L</strong></td>
                <td>7</td>
                <td>11.1 L/vehicle</td>
                <td>
                  <span className="efficiency-badge success">Excellent</span>
                </td>
              </tr>
              <tr>
                <td>Sept 19, 2025</td>
                <td>
                  <span className="source-badge info">Recycled</span>
                </td>
                <td><strong>45 L</strong></td>
                <td>4</td>
                <td>11.3 L/vehicle</td>
                <td>
                  <span className="efficiency-badge success">Excellent</span>
                </td>
              </tr>
              <tr>
                <td>Sept 18, 2025</td>
                <td>
                  <span className="source-badge primary">Municipal</span>
                </td>
                <td><strong>110 L</strong></td>
                <td>5</td>
                <td>22.0 L/vehicle</td>
                <td>
                  <span className="efficiency-badge warning">Average</span>
                </td>
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
        <p>Track your regulatory compliance and certifications with detailed monitoring.</p>
      </div>

      {/* Compliance Stats Cards */}
      <div className="stats-row">
        <div className="stat-card success">
          <div className="stat-icon">
            <i className="fas fa-check-shield"></i>
          </div>
          <div className="stat-content">
            <h3>98%</h3>
            <p>Overall Compliance Score</p>
            <span className="stat-change positive">+2% this month</span>
          </div>
        </div>

        <div className="stat-card primary">
          <div className="stat-icon">
            <i className="fas fa-file-check"></i>
          </div>
          <div className="stat-content">
            <h3>4/4</h3>
            <p>Reports Submitted</p>
            <span className="stat-change positive">All up to date</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <h3>1</h3>
            <p>Pending Actions</p>
            <span className="stat-change neutral">Due Sept 25</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <i className="fas fa-certificate"></i>
          </div>
          <div className="stat-content">
            <h3>3</h3>
            <p>Active Certifications</p>
            <span className="stat-change positive">All valid</span>
          </div>
        </div>
      </div>

      {/* Compliance Dashboard */}
      <div className="dashboard-grid">
        <div className="chart-card">
          <h3><i className="fas fa-chart-pie"></i> Compliance Breakdown</h3>
          <div className="compliance-breakdown">
            <div className="compliance-item">
              <div className="compliance-info">
                <div className="compliance-icon success">
                  <i className="fas fa-tint"></i>
                </div>
                <div className="compliance-details">
                  <h4>Water Usage Reporting</h4>
                  <p>Monthly reports and documentation</p>
                </div>
              </div>
              <div className="compliance-score-display">
                <div className="progress-bar">
                  <div className="progress-fill success" style={{width: '100%'}}></div>
                </div>
                <span className="score-text success">100%</span>
              </div>
            </div>

            <div className="compliance-item">
              <div className="compliance-info">
                <div className="compliance-icon warning">
                  <i className="fas fa-water"></i>
                </div>
                <div className="compliance-details">
                  <h4>Wastewater Management</h4>
                  <p>Disposal and treatment compliance</p>
                </div>
              </div>
              <div className="compliance-score-display">
                <div className="progress-bar">
                  <div className="progress-fill warning" style={{width: '95%'}}></div>
                </div>
                <span className="score-text warning">95%</span>
              </div>
            </div>

            <div className="compliance-item">
              <div className="compliance-info">
                <div className="compliance-icon primary">
                  <i className="fas fa-seedling"></i>
                </div>
                <div className="compliance-details">
                  <h4>Environmental Standards</h4>
                  <p>Eco-friendly practices and standards</p>
                </div>
              </div>
              <div className="compliance-score-display">
                <div className="progress-bar">
                  <div className="progress-fill primary" style={{width: '98%'}}></div>
                </div>
                <span className="score-text primary">98%</span>
              </div>
            </div>

            <div className="compliance-item">
              <div className="compliance-info">
                <div className="compliance-icon info">
                  <i className="fas fa-tools"></i>
                </div>
                <div className="compliance-details">
                  <h4>Equipment Maintenance</h4>
                  <p>Regular maintenance and safety checks</p>
                </div>
              </div>
              <div className="compliance-score-display">
                <div className="progress-bar">
                  <div className="progress-fill info" style={{width: '92%'}}></div>
                </div>
                <span className="score-text info">92%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="compliance-actions">
          <div className="action-card">
            <h3><i className="fas fa-tasks"></i> Quick Actions</h3>
            <div className="action-buttons-grid">
              <button className="action-btn success">
                <i className="fas fa-upload"></i>
                <span>Submit Report</span>
              </button>
              <button className="action-btn primary">
                <i className="fas fa-download"></i>
                <span>Download Forms</span>
              </button>
              <button className="action-btn warning">
                <i className="fas fa-calendar-check"></i>
                <span>Schedule Inspection</span>
              </button>
              <button className="action-btn info">
                <i className="fas fa-question-circle"></i>
                <span>Get Help</span>
              </button>
            </div>
          </div>

          <div className="compliance-score-card">
            <h3><i className="fas fa-trophy"></i> Overall Score</h3>
            <div className="score-circle-container">
              <div className="score-circle">
                <div className="score-value">98%</div>
                <div className="score-label">Excellent</div>
              </div>
              <div className="score-details">
                <div className="score-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Above industry average</span>
                </div>
                <div className="score-item">
                  <i className="fas fa-trend-up"></i>
                  <span>Improving trend</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="checklist-section">
        <div className="section-header-small">
          <h3><i className="fas fa-clipboard-check"></i> Compliance Checklist</h3>
          <button className="btn btn-secondary">
            <i className="fas fa-print"></i> Print Checklist
          </button>
        </div>

        <div className="enhanced-checklist">
          <div className="checklist-item completed">
            <div className="checklist-status success">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="checklist-content">
              <div className="checklist-header">
                <h4>Monthly water usage report submitted</h4>
                <span className="checklist-badge success">Completed</span>
              </div>
              <p>Due: Sept 30, 2025 | Completed: Sept 22, 2025</p>
              <div className="checklist-meta">
                <span><i className="fas fa-user"></i> Submitted by: Sipho Mthembu</span>
                <span><i className="fas fa-clock"></i> 8 days early</span>
              </div>
            </div>
            <div className="checklist-actions">
              <button className="btn btn-outline btn-sm">
                <i className="fas fa-eye"></i> View
              </button>
            </div>
          </div>

          <div className="checklist-item completed">
            <div className="checklist-status success">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="checklist-content">
              <div className="checklist-header">
                <h4>Wastewater disposal documentation</h4>
                <span className="checklist-badge success">Completed</span>
              </div>
              <p>Due: Quarterly | Completed: July 15, 2025</p>
              <div className="checklist-meta">
                <span><i className="fas fa-user"></i> Submitted by: Sipho Mthembu</span>
                <span><i className="fas fa-calendar"></i> Next due: Oct 15</span>
              </div>
            </div>
            <div className="checklist-actions">
              <button className="btn btn-outline btn-sm">
                <i className="fas fa-eye"></i> View
              </button>
            </div>
          </div>

          <div className="checklist-item pending">
            <div className="checklist-status warning">
              <i className="fas fa-clock"></i>
            </div>
            <div className="checklist-content">
              <div className="checklist-header">
                <h4>Equipment maintenance records</h4>
                <span className="checklist-badge warning">Pending</span>
              </div>
              <p>Due: Sept 25, 2025 | Status: In Progress</p>
              <div className="checklist-meta">
                <span><i className="fas fa-exclamation-triangle"></i> 3 days remaining</span>
                <span><i className="fas fa-tools"></i> Maintenance scheduled</span>
              </div>
            </div>
            <div className="checklist-actions">
              <button className="btn btn-warning btn-sm">
                <i className="fas fa-upload"></i> Submit
              </button>
            </div>
          </div>

          <div className="checklist-item upcoming">
            <div className="checklist-status primary">
              <i className="fas fa-calendar"></i>
            </div>
            <div className="checklist-content">
              <div className="checklist-header">
                <h4>Annual compliance inspection</h4>
                <span className="checklist-badge primary">Scheduled</span>
              </div>
              <p>Scheduled: Oct 15, 2025 | Inspector: Environmental Agency</p>
              <div className="checklist-meta">
                <span><i className="fas fa-calendar-plus"></i> 23 days away</span>
                <span><i className="fas fa-user-tie"></i> Inspector: J. van der Merwe</span>
              </div>
            </div>
            <div className="checklist-actions">
              <button className="btn btn-primary btn-sm">
                <i className="fas fa-calendar-alt"></i> Prepare
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTraining = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2><i className="fas fa-graduation-cap"></i> Training & Certification</h2>
        <p>Enhance your skills and stay updated with best practices in water management.</p>
      </div>

      {/* Training Stats Cards */}
      <div className="stats-row">
        <div className="stat-card success">
          <div className="stat-icon">
            <i className="fas fa-certificate"></i>
          </div>
          <div className="stat-content">
            <h3>7/12</h3>
            <p>Courses Completed</p>
            <span className="stat-change positive">58% completion rate</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <i className="fas fa-award"></i>
          </div>
          <div className="stat-content">
            <h3>3</h3>
            <p>Certificates Earned</p>
            <span className="stat-change positive">Latest: Sept 15</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>24.5</h3>
            <p>Training Hours</p>
            <span className="stat-change positive">+8 hours this month</span>
          </div>
        </div>

        <div className="stat-card primary">
          <div className="stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <h3>85%</h3>
            <p>Average Score</p>
            <span className="stat-change positive">Excellent performance</span>
          </div>
        </div>
      </div>

      {/* Learning Path & Quick Actions */}
      <div className="dashboard-grid">
        <div className="chart-card">
          <h3><i className="fas fa-route"></i> Your Learning Path</h3>
          <div className="learning-path">
            <div className="path-item completed">
              <div className="path-icon success">
                <i className="fas fa-check"></i>
              </div>
              <div className="path-content">
                <h4>Water Conservation Basics</h4>
                <p>Completed Sept 15, 2025</p>
                <div className="path-progress">
                  <div className="progress-bar">
                    <div className="progress-fill success" style={{width: '100%'}}></div>
                  </div>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="path-item current">
              <div className="path-icon warning">
                <i className="fas fa-play"></i>
              </div>
              <div className="path-content">
                <h4>Water Recycling Systems</h4>
                <p>In Progress - Started Sept 18</p>
                <div className="path-progress">
                  <div className="progress-bar">
                    <div className="progress-fill warning" style={{width: '60%'}}></div>
                  </div>
                  <span>60%</span>
                </div>
                <button className="btn btn-primary btn-sm">
                  <i className="fas fa-play"></i> Continue
                </button>
              </div>
            </div>

            <div className="path-item upcoming">
              <div className="path-icon primary">
                <i className="fas fa-lock"></i>
              </div>
              <div className="path-content">
                <h4>Environmental Compliance</h4>
                <p>Unlocks after current completion</p>
                <div className="path-progress">
                  <div className="progress-bar">
                    <div className="progress-fill primary" style={{width: '0%'}}></div>
                  </div>
                  <span>0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="training-actions">
          <div className="action-card">
            <h3><i className="fas fa-rocket"></i> Quick Actions</h3>
            <div className="action-buttons-grid">
              <button className="action-btn primary">
                <i className="fas fa-play"></i>
                <span>Continue Current Course</span>
              </button>
              <button className="action-btn success">
                <i className="fas fa-download"></i>
                <span>Download Certificates</span>
              </button>
              <button className="action-btn info">
                <i className="fas fa-calendar"></i>
                <span>Schedule Training</span>
              </button>
              <button className="action-btn warning">
                <i className="fas fa-trophy"></i>
                <span>View Achievements</span>
              </button>
            </div>
          </div>

          <div className="action-card">
            <h3><i className="fas fa-chart-line"></i> Learning Analytics</h3>
            <div className="analytics-grid">
              <div className="analytics-item">
                <div className="analytics-icon primary">
                  <i className="fas fa-brain"></i>
                </div>
                <div className="analytics-content">
                  <h4>Learning Streak</h4>
                  <p>5 days</p>
                </div>
              </div>
              <div className="analytics-item">
                <div className="analytics-icon success">
                  <i className="fas fa-target"></i>
                </div>
                <div className="analytics-content">
                  <h4>Next Milestone</h4>
                  <p>10 courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Courses */}
      <div className="courses-section">
        <div className="section-header-small">
          <h3><i className="fas fa-book-open"></i> Available Courses</h3>
          <button className="btn btn-secondary">
            <i className="fas fa-filter"></i> Filter Courses
          </button>
        </div>

        <div className="enhanced-courses-grid">
          <div className="enhanced-course-card completed">
            <div className="course-badge success">
              <i className="fas fa-check-circle"></i> Completed
            </div>
            <div className="course-icon-large success">
              <i className="fas fa-tint"></i>
            </div>
            <div className="course-content">
              <h4>Water Conservation Basics</h4>
              <p>Learn fundamental water-saving techniques for car wash operations and sustainable practices.</p>
              <div className="course-details">
                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  <span>2 hours</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-star"></i>
                  <span>4.8/5 rating</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-users"></i>
                  <span>1,234 learners</span>
                </div>
              </div>
              <div className="course-actions">
                <button className="btn btn-success">
                  <i className="fas fa-certificate"></i> View Certificate
                </button>
                <button className="btn btn-secondary">
                  <i className="fas fa-redo"></i> Retake
                </button>
              </div>
            </div>
          </div>

          <div className="enhanced-course-card current">
            <div className="course-badge warning">
              <i className="fas fa-play-circle"></i> In Progress
            </div>
            <div className="course-icon-large warning">
              <i className="fas fa-recycle"></i>
            </div>
            <div className="course-content">
              <h4>Water Recycling Systems</h4>
              <p>Advanced techniques for implementing water recycling in your business operations.</p>
              <div className="course-progress-bar">
                <div className="progress-bar">
                  <div className="progress-fill warning" style={{width: '60%'}}></div>
                </div>
                <span>60% Complete</span>
              </div>
              <div className="course-details">
                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  <span>4 hours</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-star"></i>
                  <span>4.9/5 rating</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-users"></i>
                  <span>856 learners</span>
                </div>
              </div>
              <div className="course-actions">
                <button className="btn btn-primary">
                  <i className="fas fa-play"></i> Continue Learning
                </button>
              </div>
            </div>
          </div>

          <div className="enhanced-course-card available">
            <div className="course-badge primary">
              <i className="fas fa-star"></i> Recommended
            </div>
            <div className="course-icon-large primary">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="course-content">
              <h4>Environmental Compliance</h4>
              <p>Understanding regulations and maintaining compliance standards for sustainable operations.</p>
              <div className="course-details">
                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  <span>3 hours</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-star"></i>
                  <span>4.7/5 rating</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-users"></i>
                  <span>2,145 learners</span>
                </div>
              </div>
              <div className="course-actions">
                <button className="btn btn-primary">
                  <i className="fas fa-play"></i> Start Course
                </button>
                <button className="btn btn-secondary">
                  <i className="fas fa-bookmark"></i> Save for Later
                </button>
              </div>
            </div>
          </div>

          <div className="enhanced-course-card available">
            <div className="course-badge info">
              <i className="fas fa-lightbulb"></i> New
            </div>
            <div className="course-icon-large info">
              <i className="fas fa-leaf"></i>
            </div>
            <div className="course-content">
              <h4>Sustainable Business Practices</h4>
              <p>Comprehensive guide to implementing eco-friendly practices in car wash businesses.</p>
              <div className="course-details">
                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  <span>5 hours</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-star"></i>
                  <span>New course</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-users"></i>
                  <span>124 learners</span>
                </div>
              </div>
              <div className="course-actions">
                <button className="btn btn-primary">
                  <i className="fas fa-play"></i> Start Course
                </button>
                <button className="btn btn-secondary">
                  <i className="fas fa-info-circle"></i> Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="dashboard-section">
      <div className="section-header">
        <h2><i className="fas fa-user"></i> Business Profile</h2>
        <p>Manage your business information, account settings, and preferences.</p>
      </div>

      {/* Profile Stats Cards */}
      <div className="stats-row">
        <div className="stat-card success">
          <div className="stat-icon">
            <i className="fas fa-business-time"></i>
          </div>
          <div className="stat-content">
            <h3>8 months</h3>
            <p>Operating Duration</p>
            <span className="stat-change positive">Since January 2025</span>
          </div>
        </div>

        <div className="stat-card primary profile-verified-card">
          <div className="stat-icon">
            <i className="fas fa-check-shield"></i>
          </div>
          <div className="stat-content">
            <h3>
              Verified
              <span className="verified-badge" title="Verified">
                <i className="fas fa-check-circle"></i>
              </span>
            </h3>
            <p>Business Status</p>
            <span className="stat-change positive">Fully compliant</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="fas fa-bell"></i>
          </div>
          <div className="stat-content">
            <h3>3</h3>
            <p>Active Notifications</p>
            <span className="stat-change positive">All systems normal</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="stat-content">
            <h3>Premium</h3>
            <p>Account Type</p>
            <span className="stat-change positive">Full access</span>
          </div>
        </div>
      </div>

      {/* Business Information & Contact Details */}
      <div className="dashboard-grid">
        <div className="chart-card">
          <h3><i className="fas fa-building"></i> Business Information</h3>
          <div className="profile-details-grid">
            <div className="profile-detail-item">
              <div className="detail-icon primary">
                <i className="fas fa-store"></i>
              </div>
              <div className="detail-content">
                <label>Business Name</label>
                <span>Sipho's Quality Car Wash</span>
              </div>
              <button className="edit-btn primary">
                <i className="fas fa-edit"></i>
              </button>
            </div>

            <div className="profile-detail-item">
              <div className="detail-icon success">
                <i className="fas fa-id-card"></i>
              </div>
              <div className="detail-content">
                <label>Registration Number</label>
                <span>CW2025-MAM-001</span>
              </div>
              <button className="edit-btn success">
                <i className="fas fa-edit"></i>
              </button>
            </div>

            <div className="profile-detail-item">
              <div className="detail-icon warning">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="detail-content">
                <label>Location</label>
                <span>Mamelodi, Tshwane</span>
              </div>
              <button className="edit-btn warning">
                <i className="fas fa-edit"></i>
              </button>
            </div>

            <div className="profile-detail-item">
              <div className="detail-icon info">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="detail-content">
                <label>Operating Since</label>
                <span>January 2025</span>
              </div>
              <button className="edit-btn info">
                <i className="fas fa-edit"></i>
              </button>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn-primary">
              <i className="fas fa-edit"></i> Edit Business Info
            </button>
            <button className="btn btn-secondary">
              <i className="fas fa-download"></i> Export Profile
            </button>
          </div>
        </div>

        <div className="profile-sidebar">
          <div className="contact-card">
            <h3><i className="fas fa-address-book"></i> Contact Details</h3>
            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-icon primary">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-content">
                  <label>Email Address</label>
                  <span>sipho@example.com</span>
                </div>
                <button className="contact-edit primary">
                  <i className="fas fa-edit"></i>
                </button>
              </div>

              <div className="contact-item">
                <div className="contact-icon success">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-content">
                  <label>Phone Number</label>
                  <span>+27 12 345 6789</span>
                </div>
                <button className="contact-edit success">
                  <i className="fas fa-edit"></i>
                </button>
              </div>

              <div className="contact-item">
                <div className="contact-icon warning">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div className="contact-content">
                  <label>WhatsApp</label>
                  <span>+27 12 345 6789</span>
                </div>
                <button className="contact-edit warning">
                  <i className="fas fa-edit"></i>
                </button>
              </div>
            </div>

            <button className="btn btn-primary btn-full">
              <i className="fas fa-sync"></i> Update Contact Details
            </button>
          </div>

          <div className="profile-avatar-card">
            <h3><i className="fas fa-user-circle"></i> Profile Picture</h3>
            <div className="avatar-section">
              <div className="current-avatar">
                <img src="/assets/A.png" alt="Profile Avatar" />
              </div>
              <div className="avatar-actions">
                <button className="btn btn-secondary btn-sm">
                  <i className="fas fa-camera"></i> Change Photo
                </button>
                <button className="btn btn-outline btn-sm">
                  <i className="fas fa-trash"></i> Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings & Preferences */}
      <div className="settings-section">
        <div className="section-header-small">
          <h3><i className="fas fa-cog"></i> Account Settings & Preferences</h3>
          <button className="btn btn-secondary">
            <i className="fas fa-save"></i> Save All Changes
          </button>
        </div>

        <div className="settings-grid">
          <div className="settings-category">
            <h4><i className="fas fa-bell"></i> Notification Preferences</h4>
            <div className="enhanced-settings">
              <div className="setting-item">
                <div className="setting-icon success">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="setting-content">
                  <div className="setting-header">
                    <strong>Email Notifications</strong>
                    <span className="setting-status active">Active</span>
                  </div>
                  <p>Receive compliance reminders and updates via email</p>
                </div>
                <label className="enhanced-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-icon warning">
                  <i className="fas fa-sms"></i>
                </div>
                <div className="setting-content">
                  <div className="setting-header">
                    <strong>SMS Alerts</strong>
                    <span className="setting-status active">Active</span>
                  </div>
                  <p>Get important alerts and reminders via SMS</p>
                </div>
                <label className="enhanced-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-icon primary">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="setting-content">
                  <div className="setting-header">
                    <strong>Training Reminders</strong>
                    <span className="setting-status active">Active</span>
                  </div>
                  <p>Reminders for upcoming training sessions and courses</p>
                </div>
                <label className="enhanced-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="switch-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-category">
            <h4><i className="fas fa-shield-alt"></i> Security & Privacy</h4>
            <div className="enhanced-settings">
              <div className="setting-item">
                <div className="setting-icon info">
                  <i className="fas fa-lock"></i>
                </div>
                <div className="setting-content">
                  <div className="setting-header">
                    <strong>Two-Factor Authentication</strong>
                    <span className="setting-status inactive">Inactive</span>
                  </div>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button className="btn btn-primary btn-sm">
                  <i className="fas fa-plus"></i> Enable
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-icon success">
                  <i className="fas fa-eye"></i>
                </div>
                <div className="setting-content">
                  <div className="setting-header">
                    <strong>Profile Visibility</strong>
                    <span className="setting-status active">Public</span>
                  </div>
                  <p>Control who can see your business profile</p>
                </div>
                <select className="setting-select">
                  <option>Public</option>
                  <option>Private</option>
                  <option>Business Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-category">
            <h4><i className="fas fa-palette"></i> Dashboard Preferences</h4>
            <div className="enhanced-settings">
              <div className="setting-item">
                <div className="setting-icon warning">
                  <i className="fas fa-moon"></i>
                </div>
                <div className="setting-content">
                  <div className="setting-header">
                    <strong>Dark Mode</strong>
                    <span className="setting-status inactive">Disabled</span>
                  </div>
                  <p>Switch to dark theme for better viewing experience</p>
                </div>
                <label className="enhanced-switch">
                  <input type="checkbox" />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-icon primary">
                  <i className="fas fa-language"></i>
                </div>
                <div className="setting-content">
                  <div className="setting-header">
                    <strong>Language</strong>
                    <span className="setting-status active">English</span>
                  </div>
                  <p>Choose your preferred language for the dashboard</p>
                </div>
                <select className="setting-select">
                  <option>English</option>
                  <option>Afrikaans</option>
                  <option>Zulu</option>
                  <option>Sesotho</option>
                </select>
              </div>
            </div>
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
            <div className="incentives-info">
              <p>
                Businesses that maintain full compliance for <strong>3 consecutive months</strong> are eligible for a <strong>10% discount</strong> on service fees and selected permit payments. The discount is applied automatically once three qualifying monthly compliance reports are approved.
              </p>

              <div className="incentive-cards">
                <div className="incentive-card">
                  <i className="fas fa-percent"></i>
                  <h4>10% Discount</h4>
                  <p>Applied after 3 months of continuous compliance.</p>
                </div>
                <div className="incentive-card">
                  <i className="fas fa-file-invoice-dollar"></i>
                  <h4>Discount Application</h4>
                  <p>No application needed — discount is automatic when eligibility is met.</p>
                </div>
              </div>
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