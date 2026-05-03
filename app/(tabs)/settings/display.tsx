import { View, useWindowDimensions } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import {
  DisplaySettingsScreen,
  SettingsWideShell,
  handleIsSettingsWideLayout,
} from "@/features/settings";

function Display() {
  const { width } = useWindowDimensions();

  if (handleIsSettingsWideLayout(width)) {
    return <SettingsWideShell initialSection="display" />;
  }

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
