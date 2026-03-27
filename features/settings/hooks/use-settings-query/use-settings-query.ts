import { USER_KEY } from "@/constants/query-key/query-key";
import { getUserSettings } from "@/service/user/user";
import { SettingsPayload } from "@/stores/use-settings-store/use-settings-store";
import { UserSettingsResponseType } from "@/types/response/user/settings";
import { useQuery } from "@tanstack/react-query";

export const mapSettingsResponseToPayload = (
  settings: UserSettingsResponseType,
): SettingsPayload => ({
  display: {
    weekStartDay: settings.display.weekStartDay === "MON" ? "mon" : "sun",
    isDarkMode: settings.display.isDarkMode,
  },
  menuActivation: {
    calendar: {
      isActivated: settings.menuActivation.calendar.isActive,
      priority: settings.menuActivation.calendar.priority,
    },
    dashboard: {
      isActivated: settings.menuActivation.dashboard.isActive,
      priority: settings.menuActivation.dashboard.priority,
    },
    stats: {
      isActivated: settings.menuActivation.stats.isActive,
      priority: settings.menuActivation.stats.priority,
    },
  },
  appConnection: {
    realtimeSync: {
      notion: settings.appConnection.realtimeSync.notion,
      googleCalendar: settings.appConnection.realtimeSync.googleCalendar,
      microsoftTodo: settings.appConnection.realtimeSync.microsoftTodo,
    },
  },
});

interface UseSettingsQueryParams {
  enabled?: boolean;
}

function useSettingsQuery({ enabled = true }: UseSettingsQueryParams = {}) {
  return useQuery<SettingsPayload>({
    queryKey: [USER_KEY.SETTINGS],
    enabled,
    queryFn: async () => {
      const response = await getUserSettings();
      return mapSettingsResponseToPayload(response);
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export default useSettingsQuery;
