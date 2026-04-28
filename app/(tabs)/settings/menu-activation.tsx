import { View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { useToast } from "@/components/toast/hooks";
import { MenuActivationSettingsScreen } from "@/features/settings";

function MenuActivation() {
  const { createToast } = useToast();

  const handleValidationError = () => {
    createToast("최소 하나의 메뉴는 활성화되어야 합니다.", { type: "warning" });
  };

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
