import { useCallback, useMemo } from "react";

import { useSettingsStore } from "@/stores";
import {
  MENU_ACTIVATION_KEYS,
  MenuActivationKey,
} from "@/stores/use-settings-store/use-settings-store";

export type MenuActivationTabHref = "/feed" | "/dashboard" | "/stats";

const MENU_KEY_TO_HREF: Record<MenuActivationKey, MenuActivationTabHref> = {
  calendar: "/feed",
  dashboard: "/dashboard",
  stats: "/stats",
};

function useMenuActivationTabRouting() {
  const menuActivation = useSettingsStore((state) => state.menuActivation);
  const sortedMenuKeys = useMemo(
    () =>
      [...MENU_ACTIVATION_KEYS].sort(
        (a, b) => menuActivation[a].priority - menuActivation[b].priority,
      ),
    [menuActivation],
  );
  const sortedActiveMenuKeys = useMemo(
    () => sortedMenuKeys.filter((key) => menuActivation[key].isActivated),
    [menuActivation, sortedMenuKeys],
  );
  const hasAnyActiveTab = sortedActiveMenuKeys.length > 0;

  const firstActiveHref = useMemo<MenuActivationTabHref>(() => {
    const firstActiveKey = sortedActiveMenuKeys[0];
    if (firstActiveKey) {
      return MENU_KEY_TO_HREF[firstActiveKey];
    }

    return "/feed";
  }, [sortedActiveMenuKeys]);

  const handleGetRedirectHref = useCallback(
    (pathname: string): MenuActivationTabHref | null => {
      if (!hasAnyActiveTab) {
        return null;
      }

      if (pathname.startsWith("/feed") && !menuActivation.calendar.isActivated) {
        return firstActiveHref;
      }

      if (pathname.startsWith("/dashboard") && !menuActivation.dashboard.isActivated) {
        return firstActiveHref;
      }

      if (pathname.startsWith("/stats") && !menuActivation.stats.isActivated) {
        return firstActiveHref;
      }

      return null;
    },
    [
      firstActiveHref,
      hasAnyActiveTab,
      menuActivation.calendar.isActivated,
      menuActivation.dashboard.isActivated,
      menuActivation.stats.isActivated,
    ],
  );

  return {
    menuActivation,
    sortedActiveMenuKeys,
    firstActiveHref,
    handleGetRedirectHref,
  };
}

export default useMenuActivationTabRouting;
