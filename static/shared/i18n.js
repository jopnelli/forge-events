import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';

// the translations
const resources = {
	en: {
		translation: translationEN,
	},
	de: {
		translation: translationDE,
	}
};

i18n
		.use(LanguageDetector)
		.use(initReactI18next)
		.init({
			fallbackLng: 'en',
			resources,
			interpolation: {
				escapeValue: false, // not needed for react as it escapes by default
			}
		});

export default i18n;
