import { View } from "react-native";

import { PageHeader } from "@/components";
import { AppConnectionSettingsScreen } from "@/features/settings";

function AppConnection() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="앱 연결"
        titleClassName="text-size18 text-role-text-primary dark:text-role-dark-text-primary"
        className="px-[2.4rem] pb-[2.8rem] pt-[2.4rem]"
      />
      <AppConnectionSettingsScreen />
    </View>
  );
}

export default AppConnection;
