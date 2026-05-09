import { useTranslation } from "react-i18next";
import { View, useWindowDimensions } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import {
  AppConnectionSettingsScreen,
  SettingsWideShell,
  handleIsSettingsWideLayout,
} from "@/features/settings";

function AppConnection() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  if (handleIsSettingsWideLayout(width)) {
    return <SettingsWideShell initialSection="app-connection" />;
  }

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title={t("settings.appConnection")}
        rightContent={<HeaderRightActions />}
      />
      <AppConnectionSettingsScreen />
    </View>
  );
}

export default AppConnection;
