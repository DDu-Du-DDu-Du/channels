import { View } from "react-native";

import { AppConnectionSettingsScreen } from "@/features/settings";

function AppConnection() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <AppConnectionSettingsScreen />
    </View>
  );
}

export default AppConnection;
