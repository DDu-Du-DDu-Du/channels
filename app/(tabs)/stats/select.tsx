import { View } from "react-native";

import { HeaderRightActions, MemberGuide, PageHeader } from "@/components";
import { StatsGoalSelectScreen } from "@/features/stats/components";
import { useAuthStore } from "@/stores";

export default function Select() {
  const isGuestSession = useAuthStore((state) => state.sessionType === "guest");

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="목표 상세통계"
        titleClassName="text-size15 text-role-text-inverse dark:text-role-dark-text-inverse"
        className="px-[2.4rem] pb-[1.6rem] pt-[2rem]"
        rightContent={<HeaderRightActions />}
      />
      {isGuestSession ? <MemberGuide /> : <StatsGoalSelectScreen />}
    </View>
  );
}
