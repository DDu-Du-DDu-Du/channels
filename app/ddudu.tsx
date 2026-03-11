import { View } from "react-native";

import { DDuDuSearchScreen } from "@/features/ddudu-search";

function Ddudu() {
  return (
    <View className="flex-1 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg">
      <DDuDuSearchScreen />
    </View>
  );
}

export default Ddudu;
