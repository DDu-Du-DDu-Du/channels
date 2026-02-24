import { useEffect } from "react";

import { useSettingsStore } from "@/stores";

import useSettingsQuery from "../use-settings-query/use-settings-query";

interface UseSettingsBootstrapParams {
  enabled: boolean;
}

function useSettingsBootstrap({ enabled }: UseSettingsBootstrapParams) {
  const handleHydrateSettings = useSettingsStore((state) => state.handleHydrateSettings);
  const { handleFetchSettings } = useSettingsQuery();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // TODO: settings GET API 준비 후 초기 hydrate 연결
    // const bootstrap = async () => {
    //   const payload = await handleFetchSettings();
    //   if (!payload) return;
    //   handleHydrateSettings(payload);
    // };
    // bootstrap();
    void handleFetchSettings;
    void handleHydrateSettings;
  }, [enabled, handleFetchSettings, handleHydrateSettings]);
}

export default useSettingsBootstrap;
