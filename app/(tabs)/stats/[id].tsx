import { useState } from "react";
import { View, useWindowDimensions } from "react-native";

import { HeaderRightActions, MemberGuide, PageHeader, RootTabHeader } from "@/components";
import {
  GoalEditHeaderAction,
  StatsGoalDetailScreen,
  StatsScreen,
} from "@/features/stats/components";
import { useAuthStore } from "@/stores";

import { useLocalSearchParams, usePathname } from "expo-router";

const getStringParam = (param?: string | string[]) => {
  if (Array.isArray(param)) {
    return param[0];
  }

  return param;
};

export default function Id() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isGuestSession = useAuthStore((state) => state.sessionType === "guest");
  const params = useLocalSearchParams<{ id?: string | string[]; yearMonth?: string | string[] }>();
  const yearMonth = getStringParam(params.yearMonth);
  const goalId = Number(getStringParam(params.id) ?? 0);
  const [goalName, setGoalName] = useState("Goal");
  const isWideLayout = width > 768;

  if (isWideLayout) {
    return (
      <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
        <RootTabHeader />
        {isGuestSession ? <MemberGuide /> : <StatsScreen initialSelectedGoalId={goalId} />}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title={goalName}
        rightContent={
          <HeaderRightActions
            action={
              <GoalEditHeaderAction
                goalId={goalId}
                yearMonth={yearMonth}
                backPathname={pathname}
              />
            }
          />
        }
      />
      {isGuestSession ? <MemberGuide /> : <StatsGoalDetailScreen onGoalNameChange={setGoalName} />}
    </View>
  );
}
