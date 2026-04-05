import { View } from "react-native";

import { RootTabHeader } from "@/components";
import { MainFeed } from "@/features/feed/components";

export default function Feed() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <RootTabHeader />
      <View className="w-full flex-1">
        <MainFeed />
      </View>
    </View>
  );
}
