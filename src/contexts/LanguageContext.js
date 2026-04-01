import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    home: 'Home',
    register: 'Register Your Car Wash',
    signin: 'Sign In',
    contact: 'Contact Us',
    portalTitle: 'Aqua Balance',
    portalSubtitle: 'Water Regulation & Support Portal',

    // Hero
    'hero.h1': 'Regulating Water Use, Empowering Enterprise',
    'hero.subtitle': 'Balancing Opportunity with Sustainability—Join the movement to protect our water and grow your business.',
    'hero.registerBtn': 'Register Your Car Wash',

    // About
    'about.title': 'About Us',
    'about.subtitle': "We're a City of Tshwane initiative that helps car wash operators transition to sustainable, water-efficient businesses. Our platform provides regulatory support, training, and tools to ensure compliance while promoting economic growth in local communities.",

    // Features
    'features.title': 'Key Features & Services',
    'feature.1.title': 'Car Wash Locator',
    'feature.1.desc': 'Interactive map of registered car washes with detailed information about water sources, compliance status, and contact details.',
    'feature.2.title': 'Water Source Tracker',
    'feature.2.desc': 'Monitor and track municipal vs. borehole water usage across all registered car wash facilities in real-time.',
    'feature.3.title': 'Wastewater Compliance',
    'feature.3.desc': 'Guidelines, inspection schedules, and compliance tracking for proper wastewater disposal and environmental protection.',
    'feature.4.title': 'Training & Certification',
    'feature.4.desc': 'Free workshops and certification programs for informal operators to transition into formal micro-enterprises.',
    'feature.5.title': 'Discounts',
    'feature.5.desc': 'Earn a 10% discount on your next registration renewal for maintaining compliance for 3 consecutive months!',
    'feature.6.title': 'Performance Dashboard',
    'feature.6.desc': 'Track your water usage, compliance scores, and compare performance with best practices in the industry.',

    // Education
    'education.title': 'Education & Awareness',
    'education.subtitle': 'Empowering car wash businesses with knowledge and tools for sustainable water management',
    'edu.card1.title': 'Water Recycling & Reuse',
    'edu.card1.desc': 'Implement smart recycling systems to dramatically reduce water consumption',
    'edu.card2.title': 'Efficient Equipment & Techniques',
    'edu.card2.desc': 'Optimize your washing process with water-saving equipment and methods',
    'edu.card3.title': 'Smart Monitoring & Management',
    'edu.card3.desc': 'Track and optimize your water usage with modern monitoring technologies',

    // Signup / Auth
    'signup.title': 'Register Your Car Wash',
    'signup.subtitle': 'Join the Aqua Balance Tshwane community',
    'signup.step.business': 'Business',
    'signup.step.contact': 'Contact',
    'signup.step.water': 'Water Info',
    'signup.step.account': 'Account',
    'form.businessName.label': 'Business/Car Wash Name *',
    'form.businessName.placeholder': "e.g., Sipho's Car Wash",
    'form.businessType.label': 'Business Type *',
    'form.businessType.option.informal': 'Informal Car Wash',
    'form.businessType.option.formal': 'Formal Business',
    'form.businessType.option.cooperative': 'Community Cooperative',
    'form.operatingAddress.label': 'Operating Address *',
    'form.township.label': 'Township/Area *',
    'form.contactPerson.label': 'Primary Contact Person *',
    'form.email.label': 'Email Address *',
    'form.email.placeholder': 'your.email@example.com',
    'form.phone.label': 'Phone Number *',
    'form.phone.placeholder': '+27 XX XXX XXXX',
    'form.whatsapp.label': 'WhatsApp Number',
    'info.signup': "We'll use this information to send you compliance updates, training notifications, and important announcements about the Aqua Balance program.",
    'form.waterSource.label': 'Primary Water Source *',
    'form.waterSource.option.municipal': 'Municipal Water Supply',
    'form.waterSource.option.borehole': 'Private Borehole',
    'form.waterSource.option.both': 'Both Municipal and Borehole',
    'form.waterSource.option.other': 'Other Source',
    'form.estimatedDailyUsage.label': 'Estimated Daily Water Usage (Liters) *',
    'form.hasWastewater.label': 'Do you have wastewater treatment facilities?',
    'form.password.label': 'Password *',
    'form.password.placeholder': 'Enter: demo1234',
    'form.confirmPassword.label': 'Confirm Password *',
    'form.agreeToTerms': 'I agree to the Terms of Service and Privacy Policy',
    'btn.previous': 'Previous',
    'btn.next': 'Next',
    'btn.processing': 'Processing...',
    'btn.completeRegistration': 'Complete Registration',
    'signup.benefits.title': "What you'll get:",
    'benefit.1': 'Personal dashboard to track water usage',
    'benefit.2': 'Compliance monitoring and alerts',
    'benefit.3': 'Access to training programs',
    'benefit.4': 'Eligibility for incentives and grants',
    'benefit.5': 'Technical support for water conservation',
    'validation.password.required': 'Password is required',
    'validation.password.exact': 'Password must be exactly "demo1234"',
    'validation.confirmPassword.required': 'Please confirm your password',
    'validation.password.match': 'Passwords do not match',
    'validation.agreeToTerms': 'You must agree to the Terms of Service and Privacy Policy',

    // Login
    'login.title': 'Sign In',
    'login.subtitle': 'Access your Aqua Balance dashboard',
    'login.email.placeholder': 'Enter your email',
    'login.password.placeholder': 'Enter your password',
    'login.rememberMe': 'Remember me',
    'login.forgotPassword': 'Forgot password?',
    'login.signingIn': 'Signing In...',
    'login.signIn': 'Sign In',
    'login.registerHere': 'Register here',
    'welcome.heading': 'Welcome to Aqua Balance Tshwane',
    'welcome.li1': 'Monitor your water usage in real-time',
    'welcome.li2': 'Track compliance status',
    'welcome.li3': 'Access training resources',
    'welcome.li4': 'Apply for incentives and grants',

    // Footer
    'footer.contactTitle': 'Contact Information',
    'footer.whatsapp': 'WhatsApp: +27 12 358 7911',
    'footer.email': 'Email: aquabalance@tshwane.gov.za',
    'footer.address': 'Municipal Office: CNR WF Nkomo & Steve Biko, Tshwane',
    'footer.quickLinksTitle': 'Quick Links',
    'footer.register': 'Register Your Car Wash',
    'footer.dashboard': 'Dashboard',
    'footer.compliance': 'Compliance Guidelines',
    'footer.support': 'Apply for Incentives',
    'footer.tips': 'Water Efficiency Tips',
    'footer.legalTitle': 'Legal & Privacy',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.bylaw': 'Township Economy By-law',
    'footer.regulations': 'Water Use Regulations',
    'footer.partnersTitle': 'Department Partners',
    'footer.partner1': 'City of Tshwane',
    'footer.partner2': 'Department of Water and Sanitation',
    'footer.partner3': 'Environmental Health Services',
    'footer.partner4': 'Township Economy Development',
    'footer.copyright': '© 2025 City of Tshwane. All rights reserved. | Aqua Balance Tshwane - Water Conservation Initiative',

    // Community
    'community.title': 'Community Success Stories',

    // Dashboard
    'dashboard.sidebar.overview': 'Overview',
    'dashboard.sidebar.waterUsage': 'Water Usage',
    'dashboard.sidebar.compliance': 'Compliance',
    'dashboard.sidebar.training': 'Training',
    'dashboard.sidebar.incentives': 'Incentives',
    'dashboard.sidebar.profile': 'Profile',
    'dashboard.sidebar.support': 'Support',
    'dashboard.overview.title': 'Dashboard Overview',
    'dashboard.overview.welcome': "Welcome back! Here's your car wash performance summary.",
    'action.logUsage': 'Log Water Usage',
    'action.startTraining': 'Start Training',
    'action.checkCompliance': 'Check Compliance',
    'action.getSupport': 'Get Support',
    'chart.controls.30d': '30D',
    'chart.controls.7d': '7D',
    'chart.controls.1d': '1D'
  },
  se: {
    home: 'Legae',
    register: 'Ngodisa Fektheri ya Gari',
    signin: 'Tlogela ka gare',
    contact: 'Ikgokaganyo',
    portalTitle: 'Aqua Balance',
    portalSubtitle: 'Porethishene ya Tlhokomelo ya Meetse',

    // Minimal Sepedi translations (some left in English when appropriate)
    'hero.h1': 'Go Laola Tirišano ya Meetse, Go Matlafatša Kgwebo',
    'hero.subtitle': 'Go leka go lekalekanya menyetla le botsitso — ikopanye le lenaneo la go sireletša meetse le go godisa kgwebo.',
    'hero.registerBtn': 'Ngodisa Fektheri ya Gari',
    'about.title': 'Ka Rena',
    'about.subtitle': 'Re lenaneo la Motse wa Tshwane le le thušago bašomi ba di-car wash go fetoša go ya go bohlokwa mme ba šomiše meetse ka botse.',
    'features.title': 'Ditšhupetšo tše Bohle',
    'feature.1.title': 'Car Wash Locator',
    'feature.1.desc': 'Mapa wo o swanago wa di-car wash tše di ngwadilwego',
    'feature.2.title': 'Water Source Tracker',
    'feature.2.desc': 'Hlahloba tšhomišo ya meetse',
    'feature.3.title': 'Wastewater Compliance',
    'feature.3.desc': 'Melawana ya go tloša meetse a bolayago tikologo',
    'feature.4.title': 'Training & Certification',
    'feature.4.desc': 'Dithuto le dikramphe tša mahala bakeng sa bašomi',
    'feature.5.title': 'Discounts',
    'feature.5.desc': 'Earn a discount — (Sepedi untranslated)',
    'feature.6.title': 'Performance Dashboard',
    'feature.6.desc': 'Tlhahlo ya tšhomišo ya meetse le diphetho',
    'education.title': 'Thuto le Tsebo',
    'education.subtitle': 'Go ruta bašomi bja di-car wash ka ditsela tša go boloka meetse',
    'edu.card1.title': 'Water Recycling & Reuse',
    'edu.card1.desc': 'Dirisa ditsamaiso tša go pholaya meetse gore o fapane le tšhomišo',
    'edu.card2.title': 'Efficient Equipment & Techniques',
    'edu.card2.desc': 'Optimeisa tshepedišo ya gago ka didirišwa tša go boloka meetse',
    'edu.card3.title': 'Smart Monitoring & Management',
    'edu.card3.desc': 'Hlokomela tšhomišo ya meetse ka theknolotši ya go lekanyetša',
    'signup.title': 'Ngodisa Fektheri ya Gari',
    'signup.subtitle': 'Ikgopanye le setšhaba sa Aqua Balance Tshwane',
    'btn.previous': 'E kgale',
    'btn.next': 'E latelago',
    'btn.processing': 'Go šoma...',
    'btn.completeRegistration': 'Fetša Ngodiso',
    'login.title': 'Tlogela ka gare',
    'footer.contactTitle': 'Tshedimošo ya Ikgokaganyo',
    'community.title': 'Ditemo tša Katlego tša Setšhaba',
    'dashboard.sidebar.overview': 'Tatolo',
    'dashboard.sidebar.waterUsage': 'Tšhomišo ya Meetse',
    'dashboard.sidebar.compliance': 'Tlhompho',
    'dashboard.sidebar.training': 'Thuto',
    'action.logUsage': 'Rekota Tšhomišo ya Meetse',
    'action.startTraining': 'Thoma Thuto',
    'action.checkCompliance': 'Lekola Tlhompho',
    'action.getSupport': 'Hwetša Thekgo'
  },
  zu: {
    home: 'Ikhaya',
    register: 'Bhalisa Indawo Yokuwasha Izimoto',
    signin: 'Ngena',
    contact: 'Xhumana Nathi',
    portalTitle: 'Aqua Balance',
    portalSubtitle: 'Iphothali Yokulawula Nokweseka Amanzi',

    // isiZulu translations (basic)
    'hero.h1': 'UkuLawula Ukusetshenziswa Kwamanzi, Ukuqinisekisa Amathuba Ebhanoyi',
    'hero.subtitle': 'Silinganisa ithuba nobuhle bemvelo — Joyina uhlelo lokuvikela amanzi nokukhulisa ibhizinisi lakho.',
    'hero.registerBtn': 'Bhalisa Indawo Yokuwasha Izimoto',
    'about.title': 'Ngathi',
    'about.subtitle': 'Siyinhlelo kaMasipala waseTshwane esisiza abasebenza emishinini yokuwasha izimoto bahleleke futhi basebenzise amanzi ngempumelelo.',
    'features.title': 'Izici Eziyinhloko & Amasevisi',
    'feature.1.title': 'Car Wash Locator',
    'feature.1.desc': 'Imephu ebonisa ama-car wash abhalisiwe',
    'feature.2.title': 'Water Source Tracker',
    'feature.2.desc': 'Bheka futhi ulandele umthombo wamanzi',
    'feature.3.title': 'Wastewater Compliance',
    'feature.3.desc': 'Imihlahlandlela yokuphathwa kwamanzi angcolile',
    'feature.4.title': 'Training & Certification',
    'feature.4.desc': 'Izifundo zamahhala nezitifiketi',
    'education.title': 'Imfundo & Ukwazisa',
    'education.subtitle': 'Sifundisa amabhizinisi okugeza izimoto indlela yokonga amanzi',
    'signup.title': 'Bhalisa Indawo Yokuwasha Izimoto',
    'btn.previous': 'Emuva',
    'btn.next': 'Okulandelayo',
    'btn.processing': 'Ukucubungula...',
    'btn.completeRegistration': 'Qeda Ukubhalisa',
    'login.title': 'Ngena',
    'footer.contactTitle': 'Imininingwane Yokuxhumana',
    'community.title': 'Izindaba Zomphakathi',
    'dashboard.sidebar.overview': 'Okubalulekile',
    'dashboard.sidebar.waterUsage': 'Ukusetshenziswa Kwamanzi',
    'action.logUsage': 'Bika Ukusetshenziswa Kwamanzi',
    'action.startTraining': 'Qala Ukuqeqesha',
    'action.checkCompliance': 'Hlola Ukuhambisana',
    'action.getSupport': 'Thola Ukusekelwa'
  }
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    try {
      const saved = localStorage.getItem('locale');
      return saved || 'en';
    } catch (e) {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('locale', locale);
    } catch (e) {
      // ignore
    }
  }, [locale]);

  const t = (key) => {
    return (translations[locale] && translations[locale][key]) || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
