import { useSettingsStore } from "@/stores";

function useDisplaySettings() {
  const weekStartDay = useSettingsStore((state) => state.display.weekStartDay);
  const isDarkMode = useSettingsStore((state) => state.display.isDarkMode);
  const handleSetWeekStartDay = useSettingsStore((state) => state.handleSetWeekStartDay);
  const handleSetDarkMode = useSettingsStore((state) => state.handleSetDarkMode);

  const handleChangeWeekStartDay = (nextDay: "sun" | "mon") => {
    handleSetWeekStartDay(nextDay);
  };

  const handleToggleDarkMode = (next: boolean) => {
    handleSetDarkMode(next);
  };

  return {
    weekStartDay,
    isDarkMode,
    handleChangeWeekStartDay,
    handleToggleDarkMode,
  };
}

export default useDisplaySettings;
