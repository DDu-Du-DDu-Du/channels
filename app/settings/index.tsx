import { View } from "react-native";

import { SettingsScreen } from "@/features/settings";

function Settings() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <SettingsScreen />
    </View>
  );
}

export default Settings;
