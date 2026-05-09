import { Language } from "@/i18n";
import { useSettingsStore } from "@/stores";

function useDisplaySettings() {
  const weekStartDay = useSettingsStore((state) => state.display.weekStartDay);
  const isDarkMode = useSettingsStore((state) => state.display.isDarkMode);
  const language = useSettingsStore((state) => state.display.language);
  const handleSetWeekStartDay = useSettingsStore((state) => state.handleSetWeekStartDay);
  const handleSetDarkMode = useSettingsStore((state) => state.handleSetDarkMode);
  const handleSetLanguage = useSettingsStore((state) => state.handleSetLanguage);

  const handleChangeWeekStartDay = (nextDay: "sun" | "mon") => {
    handleSetWeekStartDay(nextDay);
  };

  const handleToggleDarkMode = (next: boolean) => {
    handleSetDarkMode(next);
  };

  const handleChangeLanguage = (nextLanguage: Language) => {
    handleSetLanguage(nextLanguage);
  };

  return {
    weekStartDay,
    isDarkMode,
    language,
    handleChangeWeekStartDay,
    handleToggleDarkMode,
    handleChangeLanguage,
  };
}

export default useDisplaySettings;
