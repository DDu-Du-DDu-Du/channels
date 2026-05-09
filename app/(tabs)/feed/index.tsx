import { View } from "react-native";

import { RootTabHeader } from "@/components";
import { MainFeed } from "@/features/feed/components";
import { TodoSearchMenu } from "@/features/feed/components/main-header/components";

export default function Feed() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <RootTabHeader rightExtraContent={<TodoSearchMenu />} />
      <MainFeed />
    </View>
  );
}
