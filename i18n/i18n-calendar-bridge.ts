import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import i18n, { Language, handleApplyCalendarLocale } from "@/i18n";

export function useI18nCalendarBridge(language: Language) {
  const { i18n: reactI18n } = useTranslation();

  useEffect(() => {
    if (reactI18n.language !== language) {
      reactI18n.changeLanguage(language);
    }

    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }

    handleApplyCalendarLocale(language);
  }, [language, reactI18n]);
}
