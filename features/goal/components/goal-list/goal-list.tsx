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

import { useRouter } from "expo-router";

function GoalList() {
  const router = useRouter();
  const hasTokens = useAuthStore((state) => Boolean(state.accessToken && state.refreshToken));
  const isGuestSession = useAuthStore((state) => state.sessionType === "guest");
  const { data: user } = useMe({ readOnly: true });
  const isSessionReady = useMemo(
    () => isGuestSession || (!!hasTokens && !!user),
    [hasTokens, isGuestSession, user],
  );

  const { data: goalList = [] } = useQuery<GoalType[]>({
    queryKey: [GOAL_KEY.GOAL_LIST, user?.id],
    queryFn: () => {
      if (!isGuestSession && !user?.id) {
        return Promise.resolve([]);
      }

      return getGoalList({ userId: user?.id ?? 0 });
    },
    enabled: !!isSessionReady,
  });
  const sortedGoalList = useMemo(
    () =>
      [...goalList].sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }

        return a.id - b.id;
      }),
    [goalList],
  );

  const handlePressGoal = (goalId: number) => {
    router.push({
      pathname: "/goal/editor",
      params: { goalId },
    });
  };

  return (
    <FlatList
      data={sortedGoalList}
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
  );
}

export default GoalList;
