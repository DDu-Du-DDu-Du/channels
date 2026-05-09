import { initReactI18next } from "react-i18next";
import { LocaleConfig } from "react-native-calendars";

import english from "./english.json";
import korean from "./korean.json";

import i18next from "i18next";

export type Language = "en" | "ko";

export const DEFAULT_LANGUAGE: Language = "ko";

const resources = {
  en: {
    translation: english,
  },
  ko: {
    translation: korean,
  },
};

export function handleNormalizeLanguage(language?: string | null): Language {
  return language === "en" || language === "EN" ? "en" : "ko";
}

export function handleApplyCalendarLocale(language: Language) {
  LocaleConfig.locales.ko = {
    monthNames: korean.calendar.months.long,
    monthNamesShort: korean.calendar.months.short,
    dayNames: korean.calendar.days.long,
    dayNamesShort: korean.calendar.days.short,
  };

  LocaleConfig.locales.en = {
    monthNames: english.calendar.months.long,
    monthNamesShort: english.calendar.months.short,
    dayNames: english.calendar.days.long,
    dayNamesShort: english.calendar.days.short,
  };

  LocaleConfig.defaultLocale = language;
}

handleApplyCalendarLocale(DEFAULT_LANGUAGE);

const i18nInstance = i18next;

if (!i18nInstance.isInitialized) {
  i18nInstance.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: "en",
    supportedLngs: ["en", "ko"],
    compatibilityJSON: "v4",
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18nInstance;
