import { useCallback } from "react";

import { USER_KEY } from "@/constants/query-key/query-key";
import { updateUserSettings } from "@/service/user/user";
import { SettingsPayload } from "@/stores/use-settings-store/use-settings-store";
import type { UserSettingsResponseType } from "@/types/response/user/settings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { mapSettingsResponseToPayload } from "../use-settings-query/use-settings-query";

const mapPayloadToSettingsRequest = (payload: SettingsPayload): UserSettingsResponseType => ({
  display: {
    weekStartDay: payload.display.weekStartDay === "mon" ? "MON" : "SUN",
    isDarkMode: payload.display.isDarkMode,
    language: payload.display.language === "en" ? "EN" : "KO",
  },
  menuActivation: {
    calendar: {
      isActive: payload.menuActivation.calendar.isActivated,
      priority: payload.menuActivation.calendar.priority,
    },
    dashboard: {
      isActive: payload.menuActivation.dashboard.isActivated,
      priority: payload.menuActivation.dashboard.priority,
    },
    stats: {
      isActive: payload.menuActivation.stats.isActivated,
      priority: payload.menuActivation.stats.priority,
    },
  },
  appConnection: {
    realtimeSync: {
      notion: payload.appConnection.realtimeSync.notion,
      googleCalendar: payload.appConnection.realtimeSync.googleCalendar,
      microsoftTodo: payload.appConnection.realtimeSync.microsoftTodo,
    },
  },
});

function useSettingsMutation() {
  const queryClient = useQueryClient();
  const syncMutation = useMutation({
    mutationKey: [USER_KEY.SETTINGS, "sync"],
    mutationFn: async (payload: SettingsPayload) => {
      const requestPayload = mapPayloadToSettingsRequest(payload);
      const response = await updateUserSettings(requestPayload);
      return mapSettingsResponseToPayload(response);
    },
    onSuccess: (nextSettings) => {
      queryClient.setQueryData([USER_KEY.SETTINGS], nextSettings);
    },
  });

  const handleSyncSettings = useCallback(
    async (payload: SettingsPayload): Promise<void> => {
      await syncMutation.mutateAsync(payload);
    },
    [syncMutation],
  );

  return {
    handleSyncSettings,
    isSyncPending: syncMutation.isPending,
  };
}

export default useSettingsMutation;
