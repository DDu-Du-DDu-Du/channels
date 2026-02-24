import { View } from "react-native";

import { AppConnectionSettingsScreen } from "@/features/settings";

function AppConnection() {
  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <AppConnectionSettingsScreen />
    </View>
  );
}

export default AppConnection;
