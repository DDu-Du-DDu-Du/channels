import { useMemo } from "react";
import { FlatList, View } from "react-native";

import { EmptyList, SpoqaText } from "@/components";
import MotionPressable from "@/components/motion/motion-pressable/motion-pressable";
import { GOAL_KEY } from "@/constants/query-key/query-key";
import { useMe } from "@/features/user";
import { getGoalList } from "@/service/goal/goal";
import { useAuthStore } from "@/stores";
import { GoalType } from "@/types/response/goal/goal";
import { useQuery } from "@tanstack/react-query";

import { useLocalSearchParams, useRouter } from "expo-router";

const toSingleParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

function StatsGoalSelectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ yearMonth?: string | string[] }>();
  const yearMonth = toSingleParam(params.yearMonth) ?? "";

  const hasTokens = useAuthStore((state) => state.accessToken && state.refreshToken);
  const { data: user } = useMe({ readOnly: true });
  const isSessionReady = useMemo(() => !!hasTokens && !!user, [hasTokens, user]);

  const { data: goalList = [] } = useQuery<GoalType[]>({
    queryKey: [GOAL_KEY.GOAL_LIST, user?.id],
    queryFn: () => {
      if (!user?.id) {
        return Promise.resolve([]);
      }

      return getGoalList({ userId: user.id });
    },
    enabled: !!isSessionReady && !!user?.id,
  });

  const handlePressGoal = (goalId: number) => {
    router.push({
      pathname: "/stats/[id]",
      params: { id: goalId, yearMonth },
    });
  };

  return (
    <View className="flex-1">
      <FlatList
        data={goalList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingTop: 8,
          paddingHorizontal: 24,
          paddingBottom: 24,
          rowGap: 16,
        }}
        renderItem={({ item }) => (
          <MotionPressable
            whileTap={{ scale: 0.95 }}
            highlightColor={`#${item.color}`}
            highlightHoverOpacity={0.1}
            highlightTapOpacity={0.2}
            onPress={() => handlePressGoal(item.id)}
            style={{ borderRadius: 15 }}
          >
            <View className="w-full rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.8rem] py-[1.6rem]">
              <SpoqaText
                weight="semiBold"
                className="text-size15"
                style={{ color: `#${item.color}` }}
              >
                {item.name}
              </SpoqaText>
            </View>
          </MotionPressable>
        )}
        ListEmptyComponent={() => <EmptyList text="No goals yet." />}
      />
    </View>
  );
}

export default StatsGoalSelectScreen;
