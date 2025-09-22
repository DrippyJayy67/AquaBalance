import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Business Information
    businessName: '',
    businessType: 'informal',
    registrationNumber: '',
    operatingAddress: '',
    township: '',
    contactPerson: '',
    
    // Contact Information
    email: '',
    phone: '',
    whatsapp: '',
    
    // Water Information
    waterSource: 'municipal',
    estimatedDailyUsage: '',
    hasWastewaterTreatment: false,
    
    // Account Information
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep4 = () => {
    const newErrors = {};

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password !== 'demo1234') {
      newErrors.password = 'Password must be exactly "demo1234"';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    return newErrors;
  };

  const handleNext = () => {
    if (currentStep === 4) {
      // Validate step 4 before proceeding
      const stepErrors = validateStep4();
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Clear previous errors
    setErrors({});

    // Validate step 4 before submission
    const formErrors = validateStep4();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    // Simulate registration process
    setTimeout(() => {
      console.log('Registration successful:', formData);
      navigate('/dashboard');
      setIsLoading(false);
    }, 2000);
  };

  const townships = [
    'Mamelodi', 'Soshanguve', 'Hammanskraal', 'Ga-Rankuwa', 'Mabopane',
    'Winterveld', 'Temba', 'Akasia', 'Pretoria North', 'Centurion', 'Other'
  ];

  const renderStep1 = () => (
    <div className="form-step">
      <h3><i className="fas fa-building"></i> Business Information</h3>
      
      <div className="form-group">
        <label htmlFor="businessName">Business/Car Wash Name *</label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          value={formData.businessName}
          onChange={handleInputChange}
          required
          placeholder="e.g., Sipho's Car Wash"
        />
      </div>

      <div className="form-group">
        <label htmlFor="businessType">Business Type *</label>
        <select
          id="businessType"
          name="businessType"
          value={formData.businessType}
          onChange={handleInputChange}
          required
        >
          <option value="informal">Informal Car Wash</option>
          <option value="formal">Formal Business</option>
          <option value="cooperative">Community Cooperative</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="registrationNumber">Registration Number (if applicable)</label>
        <input
          type="text"
          id="registrationNumber"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={handleInputChange}
          placeholder="Company registration or cooperative number"
        />
      </div>

      <div className="form-group">
        <label htmlFor="operatingAddress">Operating Address *</label>
        <textarea
          id="operatingAddress"
          name="operatingAddress"
          value={formData.operatingAddress}
          onChange={handleInputChange}
          required
          placeholder="Full address where car wash operates"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="township">Township/Area *</label>
        <select
          id="township"
          name="township"
          value={formData.township}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Township</option>
          {townships.map(township => (
            <option key={township} value={township}>{township}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="contactPerson">Primary Contact Person *</label>
        <input
          type="text"
          id="contactPerson"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleInputChange}
          required
          placeholder="Full name of business owner/manager"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h3><i className="fas fa-phone"></i> Contact Information</h3>
      
      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          placeholder="your.email@example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          placeholder="+27 XX XXX XXXX"
        />
      </div>

      <div className="form-group">
        <label htmlFor="whatsapp">WhatsApp Number</label>
        <input
          type="tel"
          id="whatsapp"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleInputChange}
          placeholder="+27 XX XXX XXXX (if different from phone)"
        />
      </div>

      <div className="info-box">
        <i className="fas fa-info-circle"></i>
        <p>We'll use this information to send you compliance updates, training notifications, and important announcements about the Aqua Balance program.</p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <h3><i className="fas fa-tint"></i> Water Usage Information</h3>
      
      <div className="form-group">
        <label htmlFor="waterSource">Primary Water Source *</label>
        <select
          id="waterSource"
          name="waterSource"
          value={formData.waterSource}
          onChange={handleInputChange}
          required
        >
          <option value="municipal">Municipal Water Supply</option>
          <option value="borehole">Private Borehole</option>
          <option value="both">Both Municipal and Borehole</option>
          <option value="other">Other Source</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="estimatedDailyUsage">Estimated Daily Water Usage (Liters) *</label>
        <select
          id="estimatedDailyUsage"
          name="estimatedDailyUsage"
          value={formData.estimatedDailyUsage}
          onChange={handleInputChange}
          required
        >
          <option value="">Select usage range</option>
          <option value="0-500">0-500 liters</option>
          <option value="501-1000">501-1,000 liters</option>
          <option value="1001-2000">1,001-2,000 liters</option>
          <option value="2001-5000">2,001-5,000 liters</option>
          <option value="5000+">More than 5,000 liters</option>
        </select>
      </div>

      <div className="form-group">
        <label className="checkbox-container">
          <input
            type="checkbox"
            name="hasWastewaterTreatment"
            checked={formData.hasWastewaterTreatment}
            onChange={handleInputChange}
          />
          <span className="checkmark"></span>
          Do you have wastewater treatment facilities?
        </label>
      </div>

      <div className="info-box">
        <i className="fas fa-lightbulb"></i>
        <p>Don't worry if you don't have wastewater treatment yet. Our program provides training and support to help you implement proper water management systems.</p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="form-step">
      <h3><i className="fas fa-user-shield"></i> Account Setup</h3>
      
      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          placeholder="Enter: demo1234"
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
        <small className="password-hint">Required password: demo1234</small>
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          placeholder="Confirm password"
          className={errors.confirmPassword ? 'error' : ''}
        />
        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
      </div>

      <div className="form-group">
        <label className="checkbox-container">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            required
          />
          <span className="checkmark"></span>
          I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
        </label>
        {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
      </div>

      <div className="benefits-box">
        <h4>What you'll get:</h4>
        <ul>
          <li><i className="fas fa-check"></i> Personal dashboard to track water usage</li>
          <li><i className="fas fa-check"></i> Compliance monitoring and alerts</li>
          <li><i className="fas fa-check"></i> Access to training programs</li>
          <li><i className="fas fa-check"></i> Eligibility for incentives and grants</li>
          <li><i className="fas fa-check"></i> Technical support for water conservation</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="parallax-layer"></div>
      </div>
      
      <div className="signup-content">
        <div className="signup-card">
          <div className="auth-header">
            <div className="logo">
              <img src="/assets/A.png" alt="City of Tshwane Logo" />
            </div>
            <h1>Register Your Car Wash</h1>
            <p>Join the Aqua Balance Tshwane community</p>
          </div>

          <div className="progress-bar">
            <div className="progress-steps">
              {[1, 2, 3, 4].map(step => (
                <div
                  key={step}
                  className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                >
                  <div className="step-number">{step}</div>
                  <div className="step-label">
                    {step === 1 && 'Business'}
                    {step === 2 && 'Contact'}
                    {step === 3 && 'Water Info'}
                    {step === 4 && 'Account'}
                  </div>
                </div>
              ))}
            </div>
            <div className="progress-line">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <div className="form-navigation">
              {currentStep > 1 && (
                <button type="button" onClick={handlePrevious} className="btn btn-secondary">
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
              )}
              
              {currentStep < 4 ? (
                <button type="button" onClick={handleNext} className="btn btn-primary">
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus"></i> Complete Registration
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
            <p><Link to="/">← Back to Home</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;