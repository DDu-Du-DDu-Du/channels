import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { SpoqaText } from "@/components";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { EditIcon, PlusIcon } from "@/icons";
import type { GoalType } from "@/types/response/goal/goal";

import StatsHeader from "../stats-header/stats-header";

interface StatsWideControlPanelProps {
  yearMonthLabel: string;
  goals: GoalType[];
  selectedGoalId?: number;
  isGoalsLoading: boolean;
  isGoalsError: boolean;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handlePressOverview: () => void;
  handlePressGoal: (goalId: number) => void;
  handlePressEditGoal: (goalId: number) => void;
  handlePressAddGoal: () => void;
}

const resolveGoalColor = (color: string) => (color.startsWith("#") ? color : `#${color}`);

function StatsWideControlPanel({
  yearMonthLabel,
  goals,
  selectedGoalId,
  isGoalsLoading,
  isGoalsError,
  handlePrevMonth,
  handleNextMonth,
  handlePressOverview,
  handlePressGoal,
  handlePressEditGoal,
  handlePressAddGoal,
}: StatsWideControlPanelProps) {
  const iconFill = useThemeColorToken("ui.icon.default");
  const mutedIconFill = useThemeColorToken("ui.icon.muted");
  const isOverviewSelected = !selectedGoalId;

  return (
    <View className="h-full w-full bg-role-surface-panel p-[1.6rem] dark:bg-role-dark-surface-panel">
      <StatsHeader
        yearMonthLabel={yearMonthLabel}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
      />

      <View className="mb-[1.4rem]">
        <SpoqaText
          weight="bold"
          className="text-size18 text-role-text-primary dark:text-role-dark-text-primary"
        >
          통계 보기
        </SpoqaText>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handlePressOverview}
        className={`mb-[1rem] rounded-radius10 border px-[1.4rem] py-[1.2rem] ${
          isOverviewSelected
            ? "border-role-border-strong bg-role-surface-canvas dark:border-role-dark-border-strong dark:bg-role-dark-surface-canvas"
            : "border-role-border-subtle bg-role-surface-subtle dark:border-role-dark-border-subtle dark:bg-role-dark-surface-subtle"
        }`}
      >
        <SpoqaText
          weight={isOverviewSelected ? "bold" : "semiBold"}
          className="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
        >
          전체 요약
        </SpoqaText>
        <SpoqaText className="mt-[0.4rem] text-size12 text-role-text-tertiary dark:text-role-dark-text-tertiary">
          월간 리포트와 목표별 순위를 봅니다
        </SpoqaText>
      </Pressable>

      <View className="mb-[1rem] mt-[0.6rem] flex-row items-center justify-between">
        <SpoqaText
          weight="semiBold"
          className="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
        >
          목표 상세통계
        </SpoqaText>
        <Pressable
          accessibilityRole="button"
          onPress={handlePressAddGoal}
          className="size-[2.8rem] items-center justify-center rounded-circle bg-role-surface-subtle dark:bg-role-dark-surface-subtle"
          hitSlop={8}
        >
          <PlusIcon
            size={14}
            stroke={iconFill}
          />
        </Pressable>
      </View>

      {isGoalsLoading ? (
        <View className="mt-[0.8rem] items-center py-[1.6rem]">
          <ActivityIndicator size="small" />
        </View>
      ) : null}

      {isGoalsError && !isGoalsLoading ? (
        <SpoqaText className="mt-[0.8rem] text-size14 text-role-status-error dark:text-role-dark-status-error">
          목표 목록을 불러오지 못했어요.
        </SpoqaText>
      ) : null}

      {!isGoalsLoading && !isGoalsError ? (
        <ScrollView
          className="min-h-0 flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ rowGap: 8, paddingBottom: 12 }}
        >
          {goals.length === 0 ? (
            <View className="rounded-radius10 border border-role-border-subtle bg-role-surface-subtle px-[1.4rem] py-[1.6rem] dark:border-role-dark-border-subtle dark:bg-role-dark-surface-subtle">
              <SpoqaText className="text-size14 text-role-text-tertiary dark:text-role-dark-text-tertiary">
                아직 목표가 없어요.
              </SpoqaText>
            </View>
          ) : null}

          {goals.map((goal) => {
            const goalColor = resolveGoalColor(goal.color);
            const isSelected = goal.id === selectedGoalId;

            return (
              <View
                key={goal.id}
                className={`flex-row items-center rounded-radius10 border px-[1.2rem] py-[1rem] ${
                  isSelected
                    ? "border-role-border-strong bg-role-surface-canvas dark:border-role-dark-border-strong dark:bg-role-dark-surface-canvas"
                    : "border-role-border-subtle bg-role-surface-subtle dark:border-role-dark-border-subtle dark:bg-role-dark-surface-subtle"
                }`}
              >
                <Pressable
                  accessibilityRole="button"
                  onPress={() => handlePressGoal(goal.id)}
                  className="min-w-0 flex-1 flex-row items-center"
                >
                  <View
                    className="mr-[1rem] size-[0.9rem] rounded-circle"
                    style={{ backgroundColor: goalColor }}
                  />
                  <View className="min-w-0 flex-1">
                    <SpoqaText
                      weight={isSelected ? "bold" : "semiBold"}
                      className="text-size14"
                      numberOfLines={1}
                      style={{ color: goalColor }}
                    >
                      {goal.name}
                    </SpoqaText>
                    <SpoqaText className="mt-[0.3rem] text-size11 text-role-text-tertiary dark:text-role-dark-text-tertiary">
                      {goal.status === "IN_PROGRESS" ? "진행 중" : "완료됨"}
                    </SpoqaText>
                  </View>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => handlePressEditGoal(goal.id)}
                  className="ml-[0.8rem] size-[2.6rem] items-center justify-center rounded-circle"
                  hitSlop={8}
                >
                  <EditIcon
                    size={14}
                    fill={isSelected ? iconFill : mutedIconFill}
                  />
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );
}

export default StatsWideControlPanel;
