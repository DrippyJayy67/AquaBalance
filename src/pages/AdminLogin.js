import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ChatBot from '../components/ChatBot';

const AdminLogin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = t('Username is required') || 'Username is required';
    if (!formData.password) newErrors.password = t('Password is required') || 'Password is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    // Dummy auth: admin / admin123
    setTimeout(() => {
      if (formData.username === 'admin' && formData.password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        navigate('/admin/dashboard');
      } else {
        setErrors({ form: t('admin.login.invalid') || 'Invalid credentials' });
      }
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="parallax-layer"></div>
      </div>
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo">
              <img src="/assets/A.png" alt="City of Tshwane Logo" />
            </div>
            <h1>{t('Admin Sign In') || 'Administrator Sign In'}</h1>
            <p>{t('Access Admin dashboard') || 'Sign in to manage the system and view reports'}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username"><i className="fas fa-user-shield"></i>{t('Email Address') || 'Username'}</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder={t('Enter admin username') || 'Enter admin username'}
                className={errors.username || errors.form ? 'error' : ''}
                required
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password"><i className="fas fa-lock"></i>{t('form.password.label') || 'Password'}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t('Enter your password') || 'Enter your password'}
                className={errors.password || errors.form ? 'error' : ''}
                required
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" name="remember" checked={formData.remember} onChange={handleInputChange} />
                <span className="checkmark"></span>
                {t('Remember me') || 'Remember me'}
              </label>
              <a href="#forgot" className="forgot-link">{t('Forgot password?') || 'Forgot password?'}</a>
            </div>

            {errors.form && <div className="error-message" style={{ color: 'red', marginBottom: 8 }}>{errors.form}</div>}

            <button type="submit" className="btn btn-primary auth-btn" disabled={isLoading}>
              {isLoading ? (
                <><i className="fas fa-spinner fa-spin"></i> {t('Signing In...') || 'Signing In...'} </>
              ) : (
                <><i className="fas fa-sign-in-alt"></i> {t('Sign In') || 'Sign In'}</>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p> <Link to="/">{t('← Back to Home') || 'Back to Home'}</Link></p>
          </div>
        </div>

        <div className="auth-info">
          <h3>{t('Welcome to Aqua Balance Tshwane') || 'Welcome, Administrator'}</h3>
          <ul>
            <li><i className="fas fa-check"></i> {t('Monitor water usage and reports') || 'Monitor water usage and reports'}</li>
            <li><i className="fas fa-check"></i> {t('Manage users and registrations') || 'Manage users and registrations'}</li>
            <li><i className="fas fa-check"></i> {t('Export reports (CSV/PDF)') || 'Export reports (CSV/PDF)'}</li>
          </ul>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default AdminLogin;
