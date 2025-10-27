import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import adminApi from '../api/adminApi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

// Dummy dataset
const DUMMY_BUSINESSES = [
  {
    id: 1,
    businessName: 'Tshwane Wash Central',
    ownerName: 'John Mokoena',
    ownerContact: '+27 82 555 0001',
    type: 'formal',
    registered: true,
    region: 'Tshwane North',
    waterUsage: [
      { month: '2025-06', liters: 1200 },
      { month: '2025-07', liters: 1500 },
      { month: '2025-08', liters: 900 }
    ],
    payments: [
      { month: '2025-06', amount: 150 },
      { month: '2025-07', amount: 200 }
    ],
    savedLitersThisMonth: 200,
    leakAlerts: ['2025-08-02']
  },
  {
    id: 2,
    businessName: 'Soshanguve Car Care',
    ownerName: 'Sibusiso Dlamini',
    ownerContact: '+27 82 555 0002',
    type: 'informal',
    registered: false,
    region: 'Soshanguve',
    waterUsage: [
      { month: '2025-06', liters: 600 },
      { month: '2025-07', liters: 800 },
      { month: '2025-08', liters: 700 }
    ],
    payments: [],
    savedLitersThisMonth: 80,
    leakAlerts: []
  },
  {
    id: 3,
    businessName: 'Ga-Rankuwa Cleaners',
    ownerName: 'Lindiwe Nkosi',
    ownerContact: '+27 82 555 0003',
    type: 'informal',
    registered: true,
    region: 'Ga-Rankuwa',
    waterUsage: [
      { month: '2025-06', liters: 400 },
      { month: '2025-07', liters: 500 },
      { month: '2025-08', liters: 450 }
    ],
    payments: [
      { month: '2025-07', amount: 50 }
    ],
    savedLitersThisMonth: 30,
    leakAlerts: ['2025-07-15', '2025-08-01']
  }
];

function formatCSV(rows) {
  const keys = Object.keys(rows[0] || {});
  const header = keys.join(',');
  const lines = rows.map(r => keys.map(k => `"${(r[k] ?? '')}"`).join(','));
  return [header].concat(lines).join('\n');
}

const AdminDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // make businesses stateful so management actions (approve/deactivate) persist in UI
  const [businesses, setBusinesses] = useState(() => DUMMY_BUSINESSES.map(b => ({ ...b })));
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [timeRange, setTimeRange] = useState('6'); // '3','6','12','all'

  const filtered = businesses.filter(b => {
    const q = query.toLowerCase();
    return (
      b.businessName.toLowerCase().includes(q) ||
      b.ownerName.toLowerCase().includes(q) ||
      b.ownerContact.toLowerCase().includes(q)
    );
  });

  // Filters for Car Wash Management
  const [filterLocation, setFilterLocation] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterEfficiency, setFilterEfficiency] = useState('');

  const managementFiltered = filtered.filter(b => {
    if (filterLocation && b.region !== filterLocation) return false;
    if (filterType && b.type !== filterType) return false;
    if (filterEfficiency) {
      // simple efficiency classification based on monthly average
      const avg = b.waterUsage.reduce((s, x) => s + x.liters, 0) / b.waterUsage.length;
      if (filterEfficiency === 'high') return avg > 1000;
      if (filterEfficiency === 'medium') return avg <= 1000 && avg >= 500;
      if (filterEfficiency === 'low') return avg < 500;
      return false;
    }
    return true;
  });

  // Announcements state (CRUD)
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Water Saving Workshop', desc: 'Workshop on 10 Nov', priority: 'info' }
  ]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', desc: '', priority: 'info' });
  const [editingId, setEditingId] = useState(null);

  // System health state
  const [systemStatus, setSystemStatus] = useState({ lastSync: '2025-10-24 14:32', syncOk: true, delayedFeeds: 0 });

  // Reports
  const monthlyTotals = useMemo(() => {
    const map = {};
    businesses.forEach(b => b.waterUsage.forEach(u => { map[u.month] = (map[u.month] || 0) + u.liters; }));
    return Object.entries(map).map(([month, liters]) => ({ month, liters }));
  }, [businesses]);

  // prepare time-series months sorted ascending
  const monthsList = useMemo(() => {
    const set = new Set();
    businesses.forEach(b => b.waterUsage.forEach(u => set.add(u.month)));
    const arr = Array.from(set).sort(); // 'YYYY-MM' sorts lexicographically
    return arr;
  }, [businesses]);

  const selectedMonths = useMemo(() => {
    if (timeRange === 'all') return monthsList;
    const n = parseInt(timeRange, 10) || 6;
    return monthsList.slice(-n);
  }, [monthsList, timeRange]);

  const lineData = useMemo(() => {
    // use monthlyTotals but filter to selectedMonths and sort ascending
    const map = {};
    monthlyTotals.forEach(m => { map[m.month] = m.liters; });
    return selectedMonths.map(month => ({ month, liters: map[month] || 0 }));
  }, [monthlyTotals, selectedMonths]);

  const stackedData = useMemo(() => {
    // per month, compute formal and informal liters
    const data = selectedMonths.map(month => ({ month, formal: 0, informal: 0 }));
    const idx = Object.fromEntries(selectedMonths.map((m, i) => [m, i]));
    businesses.forEach(b => {
      b.waterUsage.forEach(u => {
        if (u.month in idx) {
          const i = idx[u.month];
          data[i][b.type] = (data[i][b.type] || 0) + u.liters;
        }
      });
    });
    return data;
  }, [businesses, selectedMonths]);

  const topBusinesses = useMemo(() => {
    // total liters per business in selectedMonths
    const totals = businesses.map(b => {
      const liters = b.waterUsage.filter(u => selectedMonths.includes(u.month)).reduce((s, u) => s + u.liters, 0);
      return { name: b.businessName, liters };
    }).sort((a, b) => b.liters - a.liters).slice(0, 5);
    return totals;
  }, [businesses, selectedMonths]);

  const regionalShare = useMemo(() => {
    const map = {};
    businesses.forEach(b => {
      const liters = b.waterUsage.filter(u => selectedMonths.includes(u.month)).reduce((s, u) => s + u.liters, 0);
      map[b.region] = (map[b.region] || 0) + liters;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [businesses, selectedMonths]);

  // totalsByType removed (not used) — keep computation lightweight

  const totalSavedThisMonth = useMemo(() => businesses.reduce((s, b) => s + (b.savedLitersThisMonth || 0), 0), [businesses]);
  const leakAlerts = useMemo(() => businesses.flatMap(b => (b.leakAlerts || []).map(d => ({ business: b.businessName, date: d }))), [businesses]);

  const financials = useMemo(() => {
    const levies = businesses.flatMap(b => b.payments || []).reduce((s, p) => s + p.amount, 0);
    const discounts = 0; // dummy
    return { levies, discounts };
  }, [businesses]);

  const regions = useMemo(() => {
    const map = {};
    businesses.forEach(b => {
      const total = b.waterUsage.reduce((s, x) => s + x.liters, 0);
      map[b.region] = (map[b.region] || 0) + total;
    });
    return Object.entries(map).map(([region, liters]) => ({ region, liters })).sort((a,b)=>b.liters-a.liters);
  }, [businesses]);

  const learning = useMemo(() => ({ accessed: 120, completions: 80, popular: [ { lesson: 'Water Saving 101', views: 80 }, { lesson: 'Greener Wash', views: 40 } ] }), []);

  const compliance = useMemo(() => ({ totalFormal: businesses.filter(b=>b.type==='formal').length, totalInformal: businesses.filter(b=>b.type==='informal').length, newlyRegisteredThisMonth: 1, inactiveUsers: 0 }), [businesses]);

  // Top-level stats to match Dashboard styling
  const topStats = useMemo(() => {
    const totalRegistered = businesses.length;
    const totalLitersMonthly = monthlyTotals.reduce((s, m) => s + (m.liters || 0), 0);
    const compliantCount = Math.round((businesses.filter(b => (b.savedLitersThisMonth || 0) > 0).length / (businesses.length || 1)) * 100);
    const formalizedThisYear = businesses.filter(b => b.type === 'informal' && b.registered).length;

    return [
      { icon: 'fas fa-building', number: totalRegistered.toLocaleString(), label: t('Total Registered Car Washes') || 'Total Registered Car Washes' },
      { icon: 'fas fa-tint', number: `${(totalLitersMonthly/1000).toFixed(1)}k`, label: t('Liters Monthly Water Use') || 'Liters Monthly Water Use' },
      { icon: 'fas fa-check-circle', number: `${compliantCount}%`, label: t('Compliant with Wastewater Disposal') || 'Compliant with Wastewater Disposal' },
      { icon: 'fas fa-chart-line', number: formalizedThisYear.toString(), label: t('Informal Car Washes Formalized This Year') || 'Informal Car Washes Formalized This Year' }
    ];
  }, [businesses, monthlyTotals, t]);

  // Export CSV for a given dataset
  const exportCsv = (rows, filename = 'export.csv') => {
    if (!rows || rows.length === 0) return;
    const csv = formatCSV(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/');
  };

  // If navigation included a desired tab (from header notifications), open it
  useEffect(() => {
    try {
      const openTab = location && location.state && location.state.openTab;
      if (openTab) {
        setActiveTab(openTab);
        // remove openTab from history state to avoid reopening on back/refresh
        if (window && window.history && window.history.replaceState) {
          const newState = { ...window.history.state };
          if (newState && newState.state) delete newState.state.openTab;
          window.history.replaceState(newState, document.title);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [location]);

  // load persisted businesses & announcements if available
  useEffect(() => {
    let mounted = true;
    adminApi.fetchBusinesses().then(b => {
      if (mounted && b && Array.isArray(b) && b.length > 0) setBusinesses(b.map(x => ({ ...x })));
    }).catch(() => {});

    adminApi.fetchAnnouncements().then(a => {
      if (mounted && a && Array.isArray(a)) setAnnouncements(a);
    }).catch(() => {});

    return () => { mounted = false; };
  }, []);

  const handleApprove = async (id) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, registered: true } : b));
    const biz = businesses.find(b => b.id === id);
    if (biz) {
      try { await adminApi.saveBusiness({ ...biz, registered: true }); } catch (e) { /* ignore */ }
    }
  };

  const handleDeactivate = async (id) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, registered: false } : b));
    if (selectedBusiness && selectedBusiness.id === id) setSelectedBusiness(prev => ({ ...prev, registered: false }));
    const biz = businesses.find(b => b.id === id);
    if (biz) {
      try { await adminApi.saveBusiness({ ...biz, registered: false }); } catch (e) { /* ignore */ }
    }
  };

  const handleBulkApprove = async () => {
    if (!selectedIds.length) return;
    setBusinesses(prev => prev.map(b => selectedIds.includes(b.id) ? { ...b, registered: true } : b));
    try { await adminApi.bulkUpdateBusinesses({ ids: selectedIds, changes: { registered: true } }); } catch (e) {}
    setSelectedIds([]);
  };

  const handleBulkExport = () => {
    if (!selectedIds.length) return;
    const rows = businesses.filter(b => selectedIds.includes(b.id)).map(b => ({ id: b.id, businessName: b.businessName, owner: b.ownerName, type: b.type, region: b.region }));
    exportCsv(rows, 'selected-businesses.csv');
  };

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title) return;
    if (editingId) {
      const updated = { id: editingId, ...newAnnouncement };
      setAnnouncements(prev => prev.map(a => a.id === editingId ? updated : a));
      adminApi.updateAnnouncement(updated).catch(() => {});
      setEditingId(null);
    } else {
      const id = Date.now();
      const created = { id, ...newAnnouncement };
      setAnnouncements(prev => [created, ...prev]);
      adminApi.createAnnouncement(created).catch(() => {});
    }
    setNewAnnouncement({ title: '', desc: '', priority: 'info' });
  };

  const handleEditAnnouncement = (id) => {
    const a = announcements.find(x => x.id === id);
    if (a) {
      setNewAnnouncement({ title: a.title, desc: a.desc, priority: a.priority || 'info' });
      setEditingId(id);
    }
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    adminApi.deleteAnnouncement(id).catch(() => {});
  };

  const handleResync = () => {
    setSystemStatus({ lastSync: new Date().toISOString().slice(0, 16).replace('T', ' '), syncOk: true, delayedFeeds: 0 });
  };

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-sidebar">
        <ul className="sidebar-menu">
          <li>
            <button className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard Overview</span>
            </button>
          </li>
          <li>
            <button className={`sidebar-item ${activeTab === 'management' ? 'active' : ''}`} onClick={() => setActiveTab('management')}>
              <i className="fas fa-th-list"></i>
              <span>Car Wash Management</span>
            </button>
          </li>
          <li>
            <button className={`sidebar-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
              <i className="fas fa-chart-bar"></i>
              <span>Water Usage Analytics</span>
            </button>
          </li>
          <li>
            <button className={`sidebar-item ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}>
              <i className="fas fa-bullhorn"></i>
              <span>Announcements & Notifications</span>
            </button>
          </li>
          <li>
            <button className={`sidebar-item ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>
              <i className="fas fa-server"></i>
              <span>System Health & Data Integrity</span>
            </button>
          </li>
        </ul>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout">
            <i className="fas fa-sign-out-alt"></i>
            <span>{t('Logout') || 'Logout'}</span>
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="card" style={{ padding: 16 }}>
          {/* Admin page header styled like Dashboard.js */}
          <div className="dashboard-header" style={{ marginBottom: 12 }}>
            <div className="header-content container">
              <div className="logo-section">
                <img src="/assets/A.png" alt="Aqua Balance" className="dashboard-logo" />
                <div>
                  <h1>{t('Admin Dashboard') || 'Admin Dashboard'}</h1>
                  <p style={{ margin: 0 }}>{t('Admin Dashboard Overview') || "Administrative control panel and reports"}</p>
                </div>
              </div>

              <div className="header-actions">
                {/* Notification icon inside Admin header (links to Announcements tab) */}
                <button
                  className="btn btn-outline"
                  title={`Announcements (${announcements.length})`}
                  onClick={() => setActiveTab('announcements')}
                  aria-label="Open announcements"
                >
                  <i className="fas fa-bell"></i>
                  <span className="notification-badge">{announcements.length}</span>
                </button>

                {/* Profile trigger */}
                <div className="header-profile">
                  <button className="profile-trigger" onClick={() => { /* placeholder: could open profile menu */ }}>
                    <img src="/assets/A.png" alt="Admin Avatar" className="profile-avatar-small" />
                    <div className="profile-details">
                      <div className="profile-name">Administrator</div>
                      <div className="profile-business">ID: admin</div>
                    </div>
                    <i className="fas fa-chevron-down profile-arrow"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            {/* Overview panel */}
            {activeTab === 'overview' && (
              <div>
                <section className="dashboard section-reveal" id="admin-stats">
                  <div className="container">
                    <h2 className="section-title">{t('Admin Dashboard Overview') || 'Portal Statistics'}</h2>
                    <div className="stats-grid">
                      {topStats.map((stat, idx) => (
                        <div key={idx} className="stat-card">
                          <i className={`${stat.icon} stat-icon`}></i>
                          <div className="stat-number">{stat.number}</div>
                          <div className="stat-label">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4>Monthly Consumption Trend</h4>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <label style={{ fontSize: 13, opacity: 0.8 }}>Range</label>
                          <select value={timeRange} onChange={e => setTimeRange(e.target.value)}>
                            <option value="3">Last 3 months</option>
                            <option value="6">Last 6 months</option>
                            <option value="12">Last 12 months</option>
                            <option value="all">All</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ width: '100%', height: 220, marginTop: 8 }}>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="liters" stroke="#2b9cf3" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Car Wash Management */}
            {activeTab === 'management' && (
              <div style={{ paddingTop: 80 }}>
                <h2>Car Wash Management</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 140px 140px 120px', gap: 12, marginBottom: 12, alignItems: 'center' }}>
                  <input style={{ width: '100%' }} placeholder={t('admin.users.searchPlaceholder') || 'Search by business or owner...'} value={query} onChange={(e) => setQuery(e.target.value)} />
                  <select style={{ width: '100%' }} value={filterLocation} onChange={e => setFilterLocation(e.target.value)}>
                    <option value="">All Locations</option>
                    {Array.from(new Set(businesses.map(b => b.region))).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <select style={{ width: '100%' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="formal">Formal</option>
                    <option value="informal">Informal</option>
                  </select>
                  <select style={{ width: '100%' }} value={filterEfficiency} onChange={e => setFilterEfficiency(e.target.value)}>
                    <option value="">All Efficiency</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <div style={{ textAlign: 'right' }}>
                    <button onClick={() => exportCsv(managementFiltered.map(b => ({ id: b.id, businessName: b.businessName, owner: b.ownerName, type: b.type, region: b.region })), 'management.csv')}>Export CSV</button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                  <div style={{ width: 340, minWidth: 260 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <button onClick={handleBulkApprove} className="btn-primary">Approve Selected</button>
                      <button onClick={handleBulkExport} className="btn-secondary">Export Selected</button>
                    </div>
                    <ul className="list-plain" style={{ marginTop: 12 }}>
                      {(() => {
                        const start = (page - 1) * pageSize;
                        const paginated = managementFiltered.slice(start, start + pageSize);
                        return paginated.map(b => (
                          <li key={b.id} style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <input type="checkbox" checked={selectedIds.includes(b.id)} onChange={(e) => {
                                setSelectedIds(prev => e.target.checked ? [...prev, b.id] : prev.filter(x => x !== b.id));
                              }} aria-label={`select-${b.id}`} />
                              <button
                                className={`admin-list-btn ${selectedBusiness && selectedBusiness.id === b.id ? 'active' : ''} ${
                                  b.businessName === 'Tshwane Wash Central' ? 'btn-tshwane' :
                                  b.businessName === 'Soshanguve Car Care' ? 'btn-soshanguve' :
                                  b.businessName === 'Ga-Rankuwa Cleaners' ? 'btn-garankuwa' : ''
                                }`}
                                onClick={() => setSelectedBusiness(b)}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <div>
                                    <strong>{b.businessName}</strong>
                                    <div style={{ fontSize: 12, opacity: 0.8 }}>{b.ownerName}</div>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 12 }}>{b.registered ? 'Registered' : 'Unregistered'}</div>
                                    <div style={{ fontSize: 12, opacity: 0.8 }}>{b.region}</div>
                                  </div>
                                </div>
                              </button>
                            </div>
                          </li>
                        ));
                      })()}
                    </ul>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                      <div>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} className="btn-secondary">Prev</button>
                        <button onClick={() => setPage(p => p + 1)} className="btn-secondary" style={{ marginLeft: 8 }}>Next</button>
                      </div>
                      <div style={{ fontSize: 13, opacity: 0.8 }}>
                        Page {page} of {Math.max(1, Math.ceil(managementFiltered.length / pageSize))}
                      </div>
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    {selectedBusiness ? (
                      <div>
                        <h3>{selectedBusiness.businessName}</h3>
                        <p><strong>{t('admin.users.owner') || 'Owner'}:</strong> {selectedBusiness.ownerName} ({selectedBusiness.ownerContact})</p>
                        <p><strong>{t('admin.users.type') || 'Type'}:</strong> {selectedBusiness.type}</p>

                        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                          {!selectedBusiness.registered ? (
                            <button onClick={() => handleApprove(selectedBusiness.id)} className="btn-primary">Approve Registration</button>
                          ) : (
                            <button onClick={() => handleDeactivate(selectedBusiness.id)} className="btn-danger">Deactivate</button>
                          )}
                          <button onClick={() => exportCsv(selectedBusiness.waterUsage.map(u => ({ month: u.month, liters: u.liters })), `${selectedBusiness.businessName}-water.csv`)}>Export Water CSV</button>
                        </div>

                        <h4 style={{ marginTop: 12 }}>{t('admin.users.waterHistory') || 'Water Usage History'}</h4>
                        <table className="table">
                          <thead>
                            <tr><th>Month</th><th>Liters</th></tr>
                          </thead>
                          <tbody>
                            {selectedBusiness.waterUsage.map((w, i) => (
                              <tr key={i}><td>{w.month}</td><td>{w.liters}</td></tr>
                            ))}
                          </tbody>
                        </table>

                        {selectedBusiness.registered && (
                          <>
                            <h4>{t('admin.users.payments') || 'Payments'}</h4>
                            <table className="table">
                              <thead><tr><th>Month</th><th>Amount</th></tr></thead>
                              <tbody>
                                {selectedBusiness.payments.map((p, i) => <tr key={i}><td>{p.month}</td><td>{p.amount}</td></tr>)}
                              </tbody>
                            </table>
                          </>
                        )}
                      </div>
                    ) : (
                      <p>Select a business to view details</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Analytics: combine water/efficiency/finance/regional/learning/compliance */}
            {activeTab === 'analytics' && (
              <div style={{ paddingTop: 80 }}>
                <h2>Water Usage Analytics</h2>
                <p>Monthly totals and comparisons</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <h4>Monthly Totals (Formal vs Informal)</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={stackedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorFormal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorInformal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <CartesianGrid stroke="#f5f5f5" />
                        <Tooltip />
                        <Area type="monotone" dataKey="formal" stackId="1" stroke="#8884d8" fill="url(#colorFormal)" />
                        <Area type="monotone" dataKey="informal" stackId="1" stroke="#82ca9d" fill="url(#colorInformal)" />
                        <Legend />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4>Top 5 High-Usage Car Washes</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={topBusinesses} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Bar dataKey="liters" fill="#ff7f50" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
                  <div>
                    <h4>Regional Share</h4>
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie data={regionalShare} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8" label>
                          {regionalShare.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={["#8884d8","#82ca9d","#ffc658","#ff7f50"][index % 4]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4>Summary</h4>
                    <p><strong>Total water saved this month:</strong> {totalSavedThisMonth} liters</p>
                    <h5>Leak Alerts</h5>
                    <ul>
                      {leakAlerts.length ? leakAlerts.map((x, i) => (<li key={i}>{x.business} - {x.date}</li>)) : <li>No alerts</li>}
                    </ul>
                    <h5 style={{ marginTop: 8 }}>Financials</h5>
                    <p><strong>Total levies collected:</strong> R {financials.levies}</p>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <h4>Regional Rankings</h4>
                  <ol>
                    {regions.map(r => (<li key={r.region}>{r.region} - {r.liters} liters</li>))}
                  </ol>

                  <h4 style={{ marginTop: 12 }}>Learning & Awareness</h4>
                  <p>Accessed: {learning.accessed} — Completions: {learning.completions}</p>
                  <ul>
                    {learning.popular.map((l, i) => (<li key={i}>{l.lesson} - {l.views} views</li>))}
                  </ul>

                  <h4 style={{ marginTop: 12 }}>Compliance Summary</h4>
                  <p>Formal: {compliance.totalFormal} — Informal: {compliance.totalInformal}</p>
                  <p>New this month: {compliance.newlyRegisteredThisMonth} — Inactive: {compliance.inactiveUsers}</p>
                </div>
              </div>
            )}

            {/* Announcements CRUD */}
            {activeTab === 'announcements' && (
              <div className="announcements-panel" style={{ paddingTop: 80 }}>
                <h2>Announcements & Notifications</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <h4>Create / Edit Announcement</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: 4, fontSize: '0.9em', color: '#666' }}>Title</label>
                        <input 
                          className="announcement-input" 
                          placeholder="Enter announcement title" 
                          value={newAnnouncement.title} 
                          onChange={e => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))} 
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 4, fontSize: '0.9em', color: '#666' }}>Description</label>
                        <textarea 
                          className="announcement-input announcement-textarea" 
                          placeholder="Enter announcement description" 
                          value={newAnnouncement.desc} 
                          onChange={e => setNewAnnouncement(prev => ({ ...prev, desc: e.target.value }))}
                          style={{ width: '100%', minHeight: '100px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 4, fontSize: '0.9em', color: '#666' }}>Priority</label>
                        <select 
                          className="announcement-input" 
                          value={newAnnouncement.priority} 
                          onChange={e => setNewAnnouncement(prev => ({ ...prev, priority: e.target.value }))}
                          style={{ width: '100%' }}
                        >
                          <option value="info">Info</option>
                          <option value="warning">Warning</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <button onClick={handleCreateAnnouncement} className="btn-primary">{editingId ? 'Save' : 'Create'}</button>
                        {editingId && <button onClick={() => { setEditingId(null); setNewAnnouncement({ title: '', desc: '', priority: 'info' }); }} className="btn-secondary" style={{ marginLeft: 8 }}>Cancel</button>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4>Existing Announcements</h4>
                    <ul className="list-plain">
                      {announcements.map(a => (
                        <li key={a.id} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                              <strong>{a.title}</strong>
                              <div style={{ fontSize: 12 }}>{a.desc}</div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={() => handleEditAnnouncement(a.id)} className="btn-secondary">Edit</button>
                              <button onClick={() => handleDeleteAnnouncement(a.id)} className="btn-danger">Delete</button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* System Health */}
            {activeTab === 'system' && (
              <div style={{ paddingTop: 80 }}>
                <h2>System Health & Data Integrity</h2>
                <p><strong>Last Sync:</strong> {systemStatus.lastSync}</p>
                <p><strong>Feeds OK:</strong> {systemStatus.syncOk ? 'Yes' : 'No'}</p>
                <p><strong>Delayed Feeds:</strong> {systemStatus.delayedFeeds}</p>
                <div style={{ marginTop: 12 }}>
                  <button onClick={handleResync} className="btn-primary">Resync Now</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
