import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations as translationData } from '../data/translations';

const LanguageContext = createContext(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to 'en'
    return localStorage.getItem('language') || 'en';
  });

  const [translations, setTranslations] = useState(() => {
    // Initialize with default language translations
    const initialLanguage = localStorage.getItem('language') || 'en';
    return translationData[initialLanguage] || {};
  });

  useEffect(() => {
    // Load translations directly
    console.log('Loading translations for language:', language);
    console.log('Available languages:', Object.keys(translationData));
    console.log('Translation data for', language, ':', translationData[language]);
    setTranslations(translationData[language] || {});
    
    // Save language preference to localStorage
    const languageString = typeof language === 'string' ? language : String(language || 'en');
    localStorage.setItem('language', languageString);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const t = (key) => {
    if (!key || typeof key !== 'string') {
      return key || '';
    }
    
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Only log warning if it's not a common pattern (like _heading, _description)
        // These might be optional translation keys
        if (!key.includes('_heading') && !key.includes('_description') && !key.includes('_title')) {
          console.warn(`Translation key "${key}" not found`);
        }
        return key;
      }
    }
    
    // Return the value, or the key if value is undefined/null
    return value !== undefined && value !== null ? value : key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
