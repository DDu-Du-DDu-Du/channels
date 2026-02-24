import { useSettingsStore } from "@/stores";

function useCalendarFirstDay() {
  const weekStartDay = useSettingsStore((state) => state.display.weekStartDay);

  return weekStartDay === "sun" ? 0 : 1;
}

export default useCalendarFirstDay;
