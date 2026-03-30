import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import ar from './locales/ar.json';

const SUPPORTED_LANGUAGES = ['en', 'ar'] as const;
const RTL_LANGUAGES = ['ar'];

function applyDirection(lng: string) {
  const isRtl = RTL_LANGUAGES.includes(lng);
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lng);
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    supportedLngs: [...SUPPORTED_LANGUAGES],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Apply direction on init
applyDirection(i18n.language?.startsWith('ar') ? 'ar' : 'en');

// Apply direction on language change
i18n.on('languageChanged', (lng) => {
  applyDirection(lng);
});
