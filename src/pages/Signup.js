import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ChatBot from '../components/ChatBot';
import Toast from '../components/Toast';
import { registerUser } from '../api/authApi';

const Signup = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'informal',
    registrationNumber: '',
    operatingAddress: '',
    township: '',
    contactPerson: '',
    email: '',
    phone: '',
    whatsapp: '',
    waterSource: 'municipal',
    estimatedDailyUsage: '',
    hasWastewaterTreatment: false,
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const townships = [
    'Mamelodi', 'Soshanguve', 'Hammanskraal', 'Ga-Rankuwa', 'Mabopane',
    'Winterveld', 'Temba', 'Akasia', 'Pretoria North', 'Centurion', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
    
    // If it was a success toast, navigate to login after closing
    if (toast.type === 'success' && toast.show) {
      setTimeout(() => {
        navigate('/login');
      }, 300); // Small delay for smooth transition
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.businessName.trim()) {
      newErrors.businessName = t('validation.businessName.required') || 'Business name is required';
    }
    if (!formData.businessType) {
      newErrors.businessType = t('validation.businessType.required') || 'Business type is required';
    }
    if (!formData.operatingAddress.trim()) {
      newErrors.operatingAddress = t('validation.operatingAddress.required') || 'Operating address is required';
    }
    if (!formData.township) {
      newErrors.township = t('validation.township.required') || 'Township is required';
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = t('validation.contactPerson.required') || 'Contact person is required';
    }
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email.trim()) {
      newErrors.email = t('validation.email.required') || 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t('validation.email.invalid') || 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('validation.phone.required') || 'Phone number is required';
    }
    
    return newErrors;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.waterSource) {
      newErrors.waterSource = t('validation.waterSource.required') || 'Water source is required';
    }
    if (!formData.estimatedDailyUsage) {
      newErrors.estimatedDailyUsage = t('validation.estimatedDailyUsage.required') || 'Estimated daily usage is required';
    }
    return newErrors;
  };

  const validateStep4 = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = t('validation.password.required') || 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = t('validation.password.minLength') || 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('validation.confirmPassword.required') || 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('validation.password.match') || 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t('validation.agreeToTerms') || 'You must agree to the Terms of Service and Privacy Policy';
    }

    return newErrors;
  };

  const handleNext = () => {
    let stepErrors = {};
    
    switch (currentStep) {
      case 1:
        stepErrors = validateStep1();
        break;
      case 2:
        stepErrors = validateStep2();
        break;
      case 3:
        stepErrors = validateStep3();
        break;
      case 4:
        stepErrors = validateStep4();
        break;
      default:
        break;
    }
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    const formErrors = validateStep4();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerUser(formData);
      
      if (result.success) {
        console.log('Registration successful:', result.data);
        
        // Show success toast with confirmation button
        showToast(t('Registration successful! You can now login.') || 'Registration successful! You can now login.', 'success');
      } else {
        // Handle API errors
        if (result.status === 400 && result.data) {
          // Handle validation errors from API
          const apiErrors = {};
          
          if (typeof result.data === 'object' && result.data.errors) {
            // Handle ASP.NET Core model validation errors
            Object.keys(result.data.errors).forEach(field => {
              const errorMessages = result.data.errors[field];
              if (Array.isArray(errorMessages) && errorMessages.length > 0) {
                // Map API field names to form field names
                const fieldMap = {
                  'Username': 'email',
                  'Email': 'email',
                  'Password': 'password',
                  'BusinessName': 'businessName',
                  'BusinessType': 'businessType',
                  'OperationalAddress': 'operatingAddress',
                  'TownShip': 'township',
                  'PrimaryContactPerson': 'contactPerson',
                  'PhoneNumber': 'phone',
                  'WhatappNumber': 'whatsapp'
                };
                
                const formField = fieldMap[field] || field.toLowerCase();
                apiErrors[formField] = errorMessages[0];
              }
            });
          } else if (typeof result.data === 'string') {
            apiErrors.general = result.data;
          } else {
            apiErrors.general = result.error || 'Registration failed. Please try again.';
          }
          
          setErrors(apiErrors);
        } else {
          // Handle other types of errors
          const errorMessage = result.error || 'Registration failed. Please check your connection and try again.';
          setErrors({
            general: errorMessage
          });
          showToast(errorMessage, 'error');
        }
      }
    } catch (error) {
      console.error('Unexpected error during registration:', error);
      const errorMessage = t('signup.error.unexpected') || 'An unexpected error occurred. Please try again.';
      setErrors({
        general: errorMessage
      });
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="form-step">
      <h3><i className="fas fa-building"></i> {t('signup.step.business')}</h3>

      <div className="form-group">
        <label htmlFor="businessName">{t('form.businessName.label')}</label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          value={formData.businessName}
          onChange={handleInputChange}
          required
          placeholder={t('form.businessName.placeholder')}
        />
        {errors.businessName && <div className="error-message">{errors.businessName}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="businessType">{t('form.businessType.label')}</label>
        <select id="businessType" name="businessType" value={formData.businessType} onChange={handleInputChange} required>
          <option value="informal">{t('form.businessType.option.informal')}</option>
          <option value="formal">{t('form.businessType.option.formal')}</option>
          <option value="cooperative">{t('form.businessType.option.cooperative')}</option>
        </select>
        {errors.businessType && <div className="error-message">{errors.businessType}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="registrationNumber">{t('Registration Number (if applicable)') || 'Registration Number (if applicable)'}</label>
        <input type="text" id="registrationNumber" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} placeholder={t('Company registration or cooperative number') || 'Company registration or cooperative number'} />
        {errors.registrationNumber && <div className="error-message">{errors.registrationNumber}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="operatingAddress">{t('form.operatingAddress.label') || 'Operating Address *'}</label>
        <textarea id="operatingAddress" name="operatingAddress" value={formData.operatingAddress} onChange={handleInputChange} required placeholder={t('Full address where car wash operates') || 'Full address where car wash operates'} rows="3" />
        {errors.operatingAddress && <div className="error-message">{errors.operatingAddress}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="township">{t('form.township.label') || 'Township/Area *'}</label>
        <select id="township" name="township" value={formData.township} onChange={handleInputChange} required>
          <option value="">{t('Select Township') || 'Select Township'}</option>
          {townships.map(town => (<option key={town} value={town}>{town}</option>))}
        </select>
        {errors.township && <div className="error-message">{errors.township}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="contactPerson">{t('form.contactPerson.label')}</label>
        <input type="text" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} required placeholder={t('Full name of business owner/manager') || 'Full name of business owner/manager'} />
        {errors.contactPerson && <div className="error-message">{errors.contactPerson}</div>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h3><i className="fas fa-phone"></i> {t('signup.step.contact')}</h3>

      <div className="form-group">
        <label htmlFor="email">{t('form.email.label')}</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder={t('form.email.placeholder')} />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">{t('form.phone.label')}</label>
        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder={t('form.phone.placeholder')} />
        {errors.phone && <div className="error-message">{errors.phone}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="whatsapp">{t('form.whatsapp.label')}</label>
        <input type="tel" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder={t('+27 XX XXX XXXX (if different from phone)') || '+27 XX XXX XXXX (if different from phone)'} />
        {errors.whatsapp && <div className="error-message">{errors.whatsapp}</div>}
      </div>

      <div className="info-box">
        <i className="fas fa-info-circle"></i>
        <p>{t('info.signup')}</p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <h3><i className="fas fa-tint"></i> {t('signup.step.water')}</h3>

      <div className="form-group">
        <label htmlFor="waterSource">{t('form.waterSource.label')}</label>
        <select id="waterSource" name="waterSource" value={formData.waterSource} onChange={handleInputChange} required>
          <option value="municipal">{t('form.waterSource.option.municipal')}</option>
          <option value="borehole">{t('form.waterSource.option.borehole')}</option>
          <option value="both">{t('form.waterSource.option.both')}</option>
          <option value="other">{t('form.waterSource.option.other')}</option>
        </select>
        {errors.waterSource && <div className="error-message">{errors.waterSource}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="estimatedDailyUsage">{t('form.estimatedDailyUsage.label')}</label>
        <select id="estimatedDailyUsage" name="estimatedDailyUsage" value={formData.estimatedDailyUsage} onChange={handleInputChange} required>
          <option value="">{t('Select usage range') || 'Select usage range'}</option>
          <option value="0-500">0-500 liters</option>
          <option value="501-1000">501-1,000 liters</option>
          <option value="1001-2000">1,001-2,000 liters</option>
          <option value="2001-5000">2,001-5,000 liters</option>
          <option value="5000+">More than 5,000 liters</option>
        </select>
        {errors.estimatedDailyUsage && <div className="error-message">{errors.estimatedDailyUsage}</div>}
      </div>

      <div className="form-group checkbox">
        <label>
          <input type="checkbox" name="hasWastewaterTreatment" checked={formData.hasWastewaterTreatment} onChange={handleInputChange} />
          {t('I have a wastewater treatment system in place') || 'I have a wastewater treatment system in place'}
        </label>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="form-step">
      <h3><i className="fas fa-user-lock"></i> {t('signup.step.account')}</h3>

      <div className="form-group">
        <label htmlFor="password">{t('form.password.label')}</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required placeholder={t('Enter a password') || 'Enter a password'} />
        {errors.password && <div className="error-message">{errors.password}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">{t('form.confirmPassword.label')}</label>
        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required placeholder={t('Confirm your password') || 'Confirm your password'} />
        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
      </div>

      <div className="form-group checkbox">
        <label>
          <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange} />
          {t('I agree to the Terms of Service and Privacy Policy') || 'I agree to the Terms of Service and Privacy Policy'}
        </label>
        {errors.agreeToTerms && <div className="error-message">{errors.agreeToTerms}</div>}
      </div>
    </div>
  );

  return (
    <div className="signup-page container">
      <h2>{t('signup.title') || 'Register your Car Wash'}</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="steps-indicator">{t('Signup step')} {currentStep}/4</div>

        {errors.general && (
          <div className="error-message general-error">
            <i className="fas fa-exclamation-triangle"></i>
            {errors.general}
          </div>
        )}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        <div className="form-actions">
          {currentStep > 1 && <button type="button" className="btn btn-secondary" onClick={handlePrevious}>{t('Previous') || 'Previous'}</button>}
          {currentStep < 4 && <button type="button" className="btn btn-primary" onClick={handleNext}>{t('Next') || 'Next'}</button>}
          {currentStep === 4 && <button type="submit" className="btn btn-success" disabled={isLoading}>{isLoading ? t('Submitting...') || 'Submitting...' : t('Submit') || 'Submit'}</button>}
        </div>

        <div className="form-footer">
          <p>{t('Already have an account?') || 'Already have an account?'} <Link to="/login">{t('Sign in') || 'Sign in'}</Link></p>
        </div>
      </form>
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

export default Signup;