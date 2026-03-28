import { View } from "react-native";

import { useAppConnectionSettings } from "@/features/settings/hooks";
import { NotionIcon } from "@/icons";

import { SettingsRow } from "../settings-row";
import { ConnectionActionButtons, RealtimeSyncSection } from "./components";

function AppConnectionSettingsScreen() {
  const realtimeSyncSettings = useAppConnectionSettings();

  return (
    <View className="flex-1 px-[2.4rem] pb-[2.8rem]">
      <SettingsRow
        label="Notion"
        leftContent={<NotionIcon size={16} />}
        rightContent={<ConnectionActionButtons />}
      />
      <SettingsRow
        label="Google Calendar"
        rightContent={<ConnectionActionButtons />}
      />
      <SettingsRow
        label="Microsoft To-Do"
        rightContent={<ConnectionActionButtons />}
      />

      <RealtimeSyncSection
        notion={realtimeSyncSettings.notion}
        googleCalendar={realtimeSyncSettings.googleCalendar}
        microsoftTodo={realtimeSyncSettings.microsoftTodo}
      />
    </View>
  );
}

export default AppConnectionSettingsScreen;
