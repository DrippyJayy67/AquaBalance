import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ChatBot from '../components/ChatBot';
import Toast from '../components/Toast';
import { loginUser } from '../api/authApi';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
    
    // If it was a success toast, navigate to dashboard after closing
    if (toast.type === 'success' && toast.show) {
      setTimeout(() => {
        navigate('/dashboard');
      }, 300); // Small delay for smooth transition
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Clear previous errors
    setErrors({});

    // Validate form
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await loginUser(formData.email, formData.password);
      
      if (result.success) {
        console.log('Login successful:', result.data);
        console.log('Auth token after login:', localStorage.getItem('authToken'));
        console.log('User data after login:', localStorage.getItem('user'));
        
        // Show success toast
        showToast('Login successful!', 'success');
      } else {
        // Handle API errors
        if (result.status === 400 || result.status === 401) {
          // Handle authentication errors
          const errorMessage = result.error || 'Invalid email or password. Please try again.';
          setErrors({
            general: errorMessage
          });
          showToast(errorMessage, 'error');
        } else {
          // Handle other types of errors
          const errorMessage = result.error || 'Login failed. Please check your connection and try again.';
          setErrors({
            general: errorMessage
          });
          showToast(errorMessage, 'error');
        }
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setErrors({
        general: errorMessage
      });
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
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
            <h1>Sign In</h1>
            <p>Access your Aqua Balance dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && (
              <div className="error-message general-error">
                <i className="fas fa-exclamation-triangle"></i>
                {errors.general}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#forgot" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary auth-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Register here</Link></p>
            <p><Link to="/">← Back to Home</Link></p>
          </div>
        </div>

        <div className="auth-info">
          <h3>Welcome to Aqua Balance Tshwane</h3>
          <ul>
            <li><i className="fas fa-check"></i> Monitor your water usage in real-time</li>
            <li><i className="fas fa-check"></i> Track compliance status</li>
            <li><i className="fas fa-check"></i> Access training resources</li>
            <li><i className="fas fa-check"></i> Apply for incentives and grants</li>
          </ul>
        </div>
      </div>
      <ChatBot />
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={hideToast}
        duration={0}
        showConfirmButton={true}
      />
    </div>
  );
};

export default Login;