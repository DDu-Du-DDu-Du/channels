import { View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { AnnouncementDetailScreen } from "@/features/announcement";

export default function Id() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="공지사항"
        rightContent={<HeaderRightActions />}
      />
      <AnnouncementDetailScreen />
    </View>
  );
}
