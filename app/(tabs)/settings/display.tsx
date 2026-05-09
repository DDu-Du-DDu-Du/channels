import { useTranslation } from "react-i18next";
import { View, useWindowDimensions } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import {
  DisplaySettingsScreen,
  SettingsWideShell,
  handleIsSettingsWideLayout,
} from "@/features/settings";

function Display() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  if (handleIsSettingsWideLayout(width)) {
    return <SettingsWideShell initialSection="display" />;
  }

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title={t("settings.display.title")}
        rightContent={<HeaderRightActions />}
      />
      <DisplaySettingsScreen />
    </View>
  );
}

export default Display;
