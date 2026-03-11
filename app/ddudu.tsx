import { View } from "react-native";

import { DDuDuSearchScreen } from "@/features/ddudu-search";

function Ddudu() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <DDuDuSearchScreen />
    </View>
  );
}

export default Ddudu;
