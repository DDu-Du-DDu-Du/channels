import { View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { SettingsScreen } from "@/features/settings";

function Settings() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="설정"
        rightContent={<HeaderRightActions />}
      />
      <SettingsScreen />
    </View>
  );
}

export default Settings;
