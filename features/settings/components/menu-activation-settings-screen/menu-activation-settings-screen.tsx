import { View } from "react-native";

import { MenuActivationDraggableList } from "./components";

export interface MenuActivationSettingsScreenProps {
  isValidationEnabled?: boolean;
  onValidationError?: () => void;
}

function MenuActivationSettingsScreen({
  isValidationEnabled = true,
  onValidationError,
}: MenuActivationSettingsScreenProps) {
  return (
    <View className="flex-1 pb-[2.8rem]">
      <MenuActivationDraggableList
        isValidationEnabled={isValidationEnabled}
        onValidationError={onValidationError}
      />
    </View>
  );
}

export default MenuActivationSettingsScreen;
