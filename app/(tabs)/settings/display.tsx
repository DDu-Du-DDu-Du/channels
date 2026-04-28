import { View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { DisplaySettingsScreen } from "@/features/settings";

function Display() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="화면표시"
        rightContent={<HeaderRightActions />}
      />
      <DisplaySettingsScreen />
    </View>
  );
}

export default Display;
