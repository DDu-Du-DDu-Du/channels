import { View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { AnnouncementDetailScreen } from "@/features/announcement";

export default function Id() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="공지사항"
        titleClassName="text-size18 text-role-text-primary dark:text-role-dark-text-primary"
        className="px-[1.6rem] pb-[2.8rem] pt-[2rem]"
        rightContent={<HeaderRightActions />}
      />
      <AnnouncementDetailScreen />
    </View>
  );
}
