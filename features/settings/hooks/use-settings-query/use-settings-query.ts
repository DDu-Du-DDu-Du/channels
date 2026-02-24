import { SettingsPayload } from "@/stores/use-settings-store/use-settings-store";

function useSettingsQuery() {
  const handleFetchSettings = async (): Promise<SettingsPayload | null> => {
    // TODO: GET /settings API 연동 후 fetch + 응답 매핑 구현
    return null;
  };

  return {
    handleFetchSettings,
  };
}

export default useSettingsQuery;
