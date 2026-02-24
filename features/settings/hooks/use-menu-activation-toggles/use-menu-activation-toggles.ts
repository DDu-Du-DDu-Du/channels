import { useSettingsStore } from "@/stores";

interface MenuActivationToggleState {
  isToggle: boolean;
  handleValueChange: (next: boolean) => void;
}

interface UseMenuActivationTogglesReturn {
  calendar: MenuActivationToggleState;
  dashboard: MenuActivationToggleState;
  stats: MenuActivationToggleState;
}

function useMenuActivationToggles(): UseMenuActivationTogglesReturn {
  const calendar = useSettingsStore((state) => state.menuActivation.calendar);
  const dashboard = useSettingsStore((state) => state.menuActivation.dashboard);
  const stats = useSettingsStore((state) => state.menuActivation.stats);
  const handleSetMenuActivation = useSettingsStore((state) => state.handleSetMenuActivation);

  const handleChangeCalendar = (next: boolean) => {
    handleSetMenuActivation("calendar", next);
  };

  const handleChangeDashboard = (next: boolean) => {
    handleSetMenuActivation("dashboard", next);
  };

  const handleChangeStats = (next: boolean) => {
    handleSetMenuActivation("stats", next);
  };

  return {
    calendar: {
      isToggle: calendar,
      handleValueChange: handleChangeCalendar,
    },
    dashboard: {
      isToggle: dashboard,
      handleValueChange: handleChangeDashboard,
    },
    stats: {
      isToggle: stats,
      handleValueChange: handleChangeStats,
    },
  };
}

export default useMenuActivationToggles;
