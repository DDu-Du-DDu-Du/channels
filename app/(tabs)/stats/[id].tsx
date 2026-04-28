import { useState } from "react";
import { Pressable, View } from "react-native";

import { HeaderRightActions, MemberGuide, PageHeader } from "@/components";
import { StatsGoalDetailScreen } from "@/features/stats/components";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { EditIcon } from "@/icons";
import { useAuthStore } from "@/stores";

import { useLocalSearchParams, usePathname, useRouter } from "expo-router";

const getStringParam = (param?: string | string[]) => {
  if (Array.isArray(param)) {
    return param[0];
  }

  return param;
};

export default function Id() {
  const router = useRouter();
  const pathname = usePathname();
  const isGuestSession = useAuthStore((state) => state.sessionType === "guest");
  const params = useLocalSearchParams<{ id?: string | string[]; yearMonth?: string | string[] }>();
  const yearMonth = getStringParam(params.yearMonth);
  const goalId = Number(getStringParam(params.id) ?? 0);
  const [goalName, setGoalName] = useState("Goal");
  const iconFill = useThemeColorToken("ui.icon.default");

  const handlePressEdit = () => {
    if (!goalId) {
      return;
    }

    router.push({
      pathname: "/goal/editor",
      params: {
        goalId,
        backHref: yearMonth ? `${pathname}?yearMonth=${encodeURIComponent(yearMonth)}` : pathname,
      },
    });
  };

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title={goalName}
        rightContent={<HeaderRightActions />}
      />
      <View className="items-end px-[2.4rem] py-[0.8rem]">
        <Pressable
          onPress={handlePressEdit}
          className="size-[2.4rem] items-end justify-center"
          hitSlop={8}
        >
          <EditIcon
            size={16}
            fill={iconFill}
          />
        </Pressable>
      </View>
      {isGuestSession ? <MemberGuide /> : <StatsGoalDetailScreen onGoalNameChange={setGoalName} />}
    </View>
  );
}
