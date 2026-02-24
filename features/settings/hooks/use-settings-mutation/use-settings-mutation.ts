import { SettingsPayload } from "@/stores/use-settings-store/use-settings-store";

function useSettingsMutation() {
  const handleSyncSettings = async (_payload: SettingsPayload): Promise<void> => {
    // TODO: PUT /settings API 연동 후 요청/에러 처리 구현
  };

  return {
    handleSyncSettings,
  };
}

export default useSettingsMutation;
