import { View } from "react-native";

import { PageHeader } from "@/components";
import { DisplaySettingsScreen } from "@/features/settings";

function Display() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="화면표시"
        titleClassName="text-size18 text-role-text-primary dark:text-role-dark-text-primary"
        className="px-[2.4rem] pb-[2.8rem] pt-[2.4rem]"
      />
      <DisplaySettingsScreen />
    </View>
  );
}

export default Display;
