import { useEffect, useRef } from "react";

import { useSettingsStore } from "@/stores";

import useSettingsQuery from "../use-settings-query/use-settings-query";

interface UseSettingsBootstrapParams {
  enabled: boolean;
}

function useSettingsBootstrap({ enabled }: UseSettingsBootstrapParams) {
  const dirty = useSettingsStore((state) => state.dirty);
  const handleHydrateSettings = useSettingsStore((state) => state.handleHydrateSettings);
  const { data, isSuccess, dataUpdatedAt } = useSettingsQuery({ enabled });
  const lastHydratedAtRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      lastHydratedAtRef.current = 0;
      return;
    }

    if (!isSuccess || !data) {
      return;
    }

    if (dirty) {
      return;
    }

    if (lastHydratedAtRef.current === dataUpdatedAt) {
      return;
    }

    lastHydratedAtRef.current = dataUpdatedAt;
    handleHydrateSettings(data);
  }, [data, dataUpdatedAt, dirty, enabled, handleHydrateSettings, isSuccess]);
}

export default useSettingsBootstrap;
