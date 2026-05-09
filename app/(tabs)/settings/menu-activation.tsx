import { useTranslation } from "react-i18next";
import { View, useWindowDimensions } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { useToast } from "@/components/toast/hooks";
import {
  MenuActivationSettingsScreen,
  SettingsWideShell,
  handleIsSettingsWideLayout,
} from "@/features/settings";

function MenuActivation() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { createToast } = useToast();

  const handleValidationError = () => {
    createToast(t("settings.minimumMenuWarning"), { type: "warning" });
  };

  if (handleIsSettingsWideLayout(width)) {
    return <SettingsWideShell initialSection="menu-activation" />;
  }

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title={t("settings.menuActivation")}
        rightContent={<HeaderRightActions />}
      />
      <MenuActivationSettingsScreen
        isValidationEnabled={true}
        onValidationError={handleValidationError}
      />
    </View>
  );
}

export default MenuActivation;
