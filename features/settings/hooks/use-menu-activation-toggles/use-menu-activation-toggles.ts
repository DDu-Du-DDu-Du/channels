import { useSettingsStore } from "@/stores";
import { MenuActivationKey } from "@/stores/use-settings-store/use-settings-store";

interface MenuActivationToggleState {
  isToggle: boolean;
  handleValueChange: (next: boolean) => void;
}

interface UseMenuActivationTogglesOptions {
  isValidationEnabled?: boolean;
  onValidationError?: () => void;
}

interface UseMenuActivationTogglesReturn {
  calendar: MenuActivationToggleState;
  dashboard: MenuActivationToggleState;
  stats: MenuActivationToggleState;
  priorities: Record<MenuActivationKey, number>;
  handleReorderMenuActivation: (nextOrder: MenuActivationKey[]) => void;
}

function useMenuActivationToggles(
  options: UseMenuActivationTogglesOptions = {},
): UseMenuActivationTogglesReturn {
  const { isValidationEnabled = true, onValidationError } = options;
  const calendar = useSettingsStore((state) => state.menuActivation.calendar);
  const dashboard = useSettingsStore((state) => state.menuActivation.dashboard);
  const stats = useSettingsStore((state) => state.menuActivation.stats);
  const handleSetMenuActivation = useSettingsStore((state) => state.handleSetMenuActivation);
  const handleReorderMenuActivation = useSettingsStore(
    (state) => state.handleReorderMenuActivation,
  );

  const canDeactivateMenu = (currentValue: boolean) => {
    if (!isValidationEnabled || !currentValue) {
      return true;
    }

    const activeMenuCount =
      Number(calendar.isActivated) + Number(dashboard.isActivated) + Number(stats.isActivated);
    if (activeMenuCount > 1) {
      return true;
    }

    onValidationError?.();
    return false;
  };

  const handleChangeCalendar = (next: boolean) => {
    if (!next && !canDeactivateMenu(calendar.isActivated)) {
      return;
    }

    handleSetMenuActivation("calendar", next);
  };

  const handleChangeDashboard = (next: boolean) => {
    if (!next && !canDeactivateMenu(dashboard.isActivated)) {
      return;
    }

    handleSetMenuActivation("dashboard", next);
  };

  const handleChangeStats = (next: boolean) => {
    if (!next && !canDeactivateMenu(stats.isActivated)) {
      return;
    }

    handleSetMenuActivation("stats", next);
  };

  return {
    calendar: {
      isToggle: calendar.isActivated,
      handleValueChange: handleChangeCalendar,
    },
    dashboard: {
      isToggle: dashboard.isActivated,
      handleValueChange: handleChangeDashboard,
    },
    stats: {
      isToggle: stats.isActivated,
      handleValueChange: handleChangeStats,
    },
    priorities: {
      calendar: calendar.priority,
      dashboard: dashboard.priority,
      stats: stats.priority,
    },
    handleReorderMenuActivation,
  };
}

export default useMenuActivationToggles;
