import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { TranslationType } from './types/i18n';

import translationEN from './locales/en.json';
import translationJA from './locales/ja.json';

const resources = {
  en: {
    translation: translationEN as TranslationType
  },
  ja: {
    translation: translationJA as TranslationType
  }
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language.split('-')[0], // ブラウザの言語設定を使用
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 