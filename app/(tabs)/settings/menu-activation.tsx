import { View, useWindowDimensions } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { useToast } from "@/components/toast/hooks";
import {
  MenuActivationSettingsScreen,
  SettingsWideShell,
  handleIsSettingsWideLayout,
} from "@/features/settings";

function MenuActivation() {
  const { width } = useWindowDimensions();
  const { createToast } = useToast();

  const handleValidationError = () => {
    createToast("최소 하나의 메뉴는 활성화되어야 합니다.", { type: "warning" });
  };

  if (handleIsSettingsWideLayout(width)) {
    return <SettingsWideShell initialSection="menu-activation" />;
  }

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="메뉴 활성화"
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
