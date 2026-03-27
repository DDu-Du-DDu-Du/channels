import { useEffect, useMemo, useRef } from "react";

import { useSettingsStore } from "@/stores";
import { SettingsPayload } from "@/stores/use-settings-store/use-settings-store";

import useSettingsMutation from "../use-settings-mutation/use-settings-mutation";

interface UseSettingsSyncParams {
  enabled?: boolean;
  debounceMs?: number;
}

function useSettingsSync({ enabled = true, debounceMs = 1200 }: UseSettingsSyncParams = {}) {
  const dirty = useSettingsStore((state) => state.dirty);
  const isSyncing = useSettingsStore((state) => state.isSyncing);
  const display = useSettingsStore((state) => state.display);
  const menuActivation = useSettingsStore((state) => state.menuActivation);
  const appConnection = useSettingsStore((state) => state.appConnection);
  const handleMarkSyncStart = useSettingsStore((state) => state.handleMarkSyncStart);
  const handleMarkSyncSuccess = useSettingsStore((state) => state.handleMarkSyncSuccess);
  const handleMarkSyncError = useSettingsStore((state) => state.handleMarkSyncError);
  const { handleSyncSettings, isSyncPending } = useSettingsMutation();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const settingsPayload = useMemo<SettingsPayload>(
    () => ({
      display,
      menuActivation,
      appConnection,
    }),
    [appConnection, display, menuActivation],
  );

  const serializedPayload = useMemo(() => JSON.stringify(settingsPayload), [settingsPayload]);

  useEffect(() => {
    if (!enabled || !dirty || isSyncing || isSyncPending) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    debounceTimerRef.current = setTimeout(async () => {
      handleMarkSyncStart();

      try {
        await handleSyncSettings(settingsPayload);
        handleMarkSyncSuccess();
      } catch (error) {
        const message = error instanceof Error ? error.message : "settings sync failed";
        handleMarkSyncError(message);
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [
    debounceMs,
    dirty,
    enabled,
    handleMarkSyncError,
    handleMarkSyncStart,
    handleMarkSyncSuccess,
    handleSyncSettings,
    isSyncPending,
    isSyncing,
    serializedPayload,
    settingsPayload,
  ]);
}

export default useSettingsSync;
