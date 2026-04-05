import { View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { SettingsScreen } from "@/features/settings";

function Settings() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="설정"
        titleClassName="text-size18 text-role-text-primary dark:text-role-dark-text-primary"
        className="px-[2.4rem] pb-[2.8rem] pt-[2rem]"
        rightContent={<HeaderRightActions />}
      />
      <SettingsScreen />
    </View>
  );
}

export default Settings;
