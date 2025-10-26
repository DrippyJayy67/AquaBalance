import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Signup = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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

  const validateStep4 = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = t('validation.password.required') || 'Password is required';
    else if (formData.password !== 'demo1234') newErrors.password = t('validation.password.exact') || 'Password must be exactly "demo1234"';

    if (!formData.confirmPassword) newErrors.confirmPassword = t('validation.confirmPassword.required') || 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('validation.password.match') || 'Passwords do not match';

    if (!formData.agreeToTerms) newErrors.agreeToTerms = t('validation.agreeToTerms') || 'You must agree to the Terms of Service and Privacy Policy';

    return newErrors;
  };

  const handleNext = () => {
    if (currentStep === 4) {
      const stepErrors = validateStep4();
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    const formErrors = validateStep4();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API request
    setTimeout(() => {
      console.log('Registration successful:', formData);
      navigate('/dashboard');
      setIsLoading(false);
    }, 800);
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
      </div>

      <div className="form-group">
        <label htmlFor="businessType">{t('form.businessType.label')}</label>
        <select id="businessType" name="businessType" value={formData.businessType} onChange={handleInputChange} required>
          <option value="informal">{t('form.businessType.option.informal')}</option>
          <option value="formal">{t('form.businessType.option.formal')}</option>
          <option value="cooperative">{t('form.businessType.option.cooperative')}</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="registrationNumber">{t('form.registrationNumber.label') || 'Registration Number (if applicable)'}</label>
        <input type="text" id="registrationNumber" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} placeholder={t('form.registrationNumber.placeholder') || 'Company registration or cooperative number'} />
      </div>

      <div className="form-group">
        <label htmlFor="operatingAddress">{t('form.operatingAddress.label') || 'Operating Address *'}</label>
        <textarea id="operatingAddress" name="operatingAddress" value={formData.operatingAddress} onChange={handleInputChange} required placeholder={t('form.operatingAddress.placeholder') || 'Full address where car wash operates'} rows="3" />
      </div>

      <div className="form-group">
        <label htmlFor="township">{t('form.township.label') || 'Township/Area *'}</label>
        <select id="township" name="township" value={formData.township} onChange={handleInputChange} required>
          <option value="">{t('form.township.select') || 'Select Township'}</option>
          {townships.map(town => (<option key={town} value={town}>{town}</option>))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="contactPerson">{t('form.contactPerson.label')}</label>
        <input type="text" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} required placeholder={t('form.contactPerson.placeholder') || 'Full name of business owner/manager'} />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h3><i className="fas fa-phone"></i> {t('signup.step.contact')}</h3>

      <div className="form-group">
        <label htmlFor="email">{t('form.email.label')}</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder={t('form.email.placeholder')} />
      </div>

      <div className="form-group">
        <label htmlFor="phone">{t('form.phone.label')}</label>
        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder={t('form.phone.placeholder')} />
      </div>

      <div className="form-group">
        <label htmlFor="whatsapp">{t('form.whatsapp.label')}</label>
        <input type="tel" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder={t('form.whatsapp.placeholder') || '+27 XX XXX XXXX (if different from phone)'} />
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
      </div>

      <div className="form-group">
        <label htmlFor="estimatedDailyUsage">{t('form.estimatedDailyUsage.label')}</label>
        <select id="estimatedDailyUsage" name="estimatedDailyUsage" value={formData.estimatedDailyUsage} onChange={handleInputChange} required>
          <option value="">{t('form.estimatedDailyUsage.select') || 'Select usage range'}</option>
          <option value="0-500">0-500 liters</option>
          <option value="501-1000">501-1,000 liters</option>
          <option value="1001-2000">1,001-2,000 liters</option>
          <option value="2001-5000">2,001-5,000 liters</option>
          <option value="5000+">More than 5,000 liters</option>
        </select>
      </div>

      <div className="form-group checkbox">
        <label>
          <input type="checkbox" name="hasWastewaterTreatment" checked={formData.hasWastewaterTreatment} onChange={handleInputChange} />
          {t('form.hasWastewaterTreatment.label') || 'I have a wastewater treatment system in place'}
        </label>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="form-step">
      <h3><i className="fas fa-user-lock"></i> {t('signup.step.account')}</h3>

      <div className="form-group">
        <label htmlFor="password">{t('form.password.label')}</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required placeholder={t('form.password.placeholder') || 'Enter a password'} />
        {errors.password && <div className="error">{errors.password}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">{t('form.confirmPassword.label')}</label>
        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required placeholder={t('form.confirmPassword.placeholder') || 'Confirm your password'} />
        {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
      </div>

      <div className="form-group checkbox">
        <label>
          <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange} />
          {t('form.agreeToTerms.label') || 'I agree to the Terms of Service and Privacy Policy'}
        </label>
        {errors.agreeToTerms && <div className="error">{errors.agreeToTerms}</div>}
      </div>
    </div>
  );

  return (
    <div className="signup-page container">
      <h2>{t('signup.title') || 'Register your Car Wash'}</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="steps-indicator">{t('signup.step')} {currentStep}/4</div>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        <div className="form-actions">
          {currentStep > 1 && <button type="button" className="btn btn-secondary" onClick={handlePrevious}>{t('signup.prev') || 'Previous'}</button>}
          {currentStep < 4 && <button type="button" className="btn btn-primary" onClick={handleNext}>{t('signup.next') || 'Next'}</button>}
          {currentStep === 4 && <button type="submit" className="btn btn-success" disabled={isLoading}>{isLoading ? t('signup.submitting') || 'Submitting...' : t('signup.submit') || 'Submit'}</button>}
        </div>

        <div className="form-footer">
          <p>{t('signup.haveAccount') || 'Already have an account?'} <Link to="/login">{t('signup.signIn') || 'Sign in'}</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Signup;