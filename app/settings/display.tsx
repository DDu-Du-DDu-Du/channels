import { View } from "react-native";

import { DisplaySettingsScreen } from "@/features/settings";

function Display() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <DisplaySettingsScreen />
    </View>
  );
}

export default Display;
