import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import zhTranslations from './locales/zh.json';
import deTranslations from './locales/de.json';
import frTranslations from './locales/fr.json';
import arTranslations from './locales/ar.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      zh: { translation: zhTranslations },
      de: { translation: deTranslations },
      fr: { translation: frTranslations },
      ar: { translation: arTranslations }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already safes from xss
    }
  });

export default i18n;
