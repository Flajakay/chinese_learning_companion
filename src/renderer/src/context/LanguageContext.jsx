import React, { createContext, useContext, useState, useEffect } from 'react';
import electronAPI from '../services/electronAPI';
import { STORAGE_KEYS } from '../../../shared/constants';
import enTranslations from '../../../shared/languages/en';
import plTranslations from '../../../shared/languages/pl';

const LanguageContext = createContext();

const availableLanguages = [
  { code: 'en', name: 'English', translations: enTranslations, googleCode: 'en' },
  { code: 'pl', name: 'Polish', translations: plTranslations, googleCode: 'pl' }
];

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState(enTranslations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const result = await electronAPI.loadData(STORAGE_KEYS.INTERFACE_LANGUAGE);
        if (result.success && result.data) {
          const langCode = result.data;
          const lang = availableLanguages.find(l => l.code === langCode);
          if (lang) {
            setCurrentLanguage(langCode);
            setTranslations(lang.translations);
          }
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setLoading(false);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (languageCode) => {
    const lang = availableLanguages.find(l => l.code === languageCode);
    if (lang) {
      setCurrentLanguage(languageCode);
      setTranslations(lang.translations);
      await electronAPI.saveData(STORAGE_KEYS.INTERFACE_LANGUAGE, languageCode);
    }
  };

  const getGoogleLanguageCode = (code) => {
    const lang = availableLanguages.find(l => l.code === code);
    return lang?.googleCode || code;
  };

  const translateLevel = (levelValue) => {
    const levelMappings = translations.levelMappings || {};
    const translationKey = levelMappings[levelValue] || 'levels.beginner';
    return t(translationKey, {});
  };

  const t = (key, variables = {}) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        return key;
      }
    }
    
    if (typeof value === 'string' && Object.keys(variables).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, variableName) => {
        return variables[variableName] !== undefined ? variables[variableName] : match;
      });
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      availableLanguages,
      changeLanguage,
      getGoogleLanguageCode,
      translateLevel,
      loading,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
