import { View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { AppConnectionSettingsScreen } from "@/features/settings";

function AppConnection() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="앱 연결"
        rightContent={<HeaderRightActions />}
      />
      <AppConnectionSettingsScreen />
    </View>
  );
}

export default AppConnection;
