import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { SpoqaText } from "@/components";
import FeedCalendar from "@/features/feed/components/feed-calendar/feed-calendar";
import type { MainFeedView } from "@/features/feed/components/main-feed/main-feed";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { CheckIcon, EditIcon, ListIcon, PlusIcon, TimelineIcon } from "@/icons";
import type { MonthlyWeeklyTodoType } from "@/types/response/feed/feed";
import type { GoalType } from "@/types/response/goal/goal";
import { hexConvertForRGBA } from "@/utils";

export interface FeedWideSummary {
  total: number;
  complete: number;
  postponed: number;
}

export interface FeedWideControlPanelProps {
  date: string;
  view: MainFeedView;
  monthlyTodos: MonthlyWeeklyTodoType[];
  goalList: GoalType[];
  isGoalListLoading?: boolean;
  isGoalListError?: boolean;
  selectedGoalIds: number[];
  summary: FeedWideSummary;
  onSelectDate: (date: string) => void;
  onPressToday: () => void;
  onChangeView: (view: MainFeedView) => void;
  onClearGoalSelection: () => void;
  onToggleGoal: (goalId: number) => void;
  onPressAddGoal: () => void;
  onPressEditGoal: (goalId: number) => void;
}

const viewOptions: { value: MainFeedView; labelKey: string }[] = [
  { value: "list", labelKey: "feed.list" },
  { value: "timeline", labelKey: "feed.timeline" },
];

const normalizeGoalColor = (color: string) => (color.startsWith("#") ? color : `#${color}`);

function FeedWideControlPanel({
  date,
  view,
  monthlyTodos,
  goalList,
  isGoalListLoading = false,
  isGoalListError = false,
  selectedGoalIds,
  summary,
  onSelectDate,
  onPressToday,
  onChangeView,
  onClearGoalSelection,
  onToggleGoal,
  onPressAddGoal,
  onPressEditGoal,
}: FeedWideControlPanelProps) {
  const { t } = useTranslation();
  const iconTone = useThemeColorToken("ui.icon.default");
  const mutedIconTone = useThemeColorToken("ui.icon.muted");
  const hasExplicitGoalSelection = selectedGoalIds.length > 0;

  return (
    <View className="flex-1">
      <FeedCalendar
        date={date}
        monthlyTodos={monthlyTodos}
        onSelectDate={onSelectDate}
        forceFullWidth
        showHeaderActions={false}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 28, rowGap: 16 }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={onPressToday}
            className="h-[3.6rem] rounded-full border border-role-border-subtle px-[1.4rem] items-center justify-center dark:border-role-dark-border-subtle"
          >
            <SpoqaText className="text-size13 text-role-text-primary dark:text-role-dark-text-primary">
              {t("calendar.today")}
            </SpoqaText>
          </Pressable>

          <View className="flex-row rounded-full bg-role-surface-panel p-[0.3rem] dark:bg-role-dark-surface-panel">
            {viewOptions.map((option) => {
              const isSelected = option.value === view;
              const optionIconTone = isSelected ? iconTone : mutedIconTone;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => onChangeView(option.value)}
                  className={`h-[3rem] flex-row items-center gap-[0.4rem] rounded-full px-[1rem] ${
                    isSelected ? "bg-role-surface-canvas dark:bg-role-dark-surface-canvas" : ""
                  }`}
                >
                  {option.value === "list" ? (
                    <ListIcon
                      size={16}
                      fill={optionIconTone}
                    />
                  ) : (
                    <TimelineIcon
                      size={16}
                      stroke={optionIconTone}
                    />
                  )}
                  <SpoqaText
                    weight={isSelected ? "semiBold" : "regular"}
                    className={`text-size12 ${
                      isSelected
                        ? "text-role-text-primary dark:text-role-dark-text-primary"
                        : "text-role-text-tertiary dark:text-role-dark-text-tertiary"
                    }`}
                  >
                    {t(option.labelKey)}
                  </SpoqaText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="rounded-radius10 bg-role-surface-panel p-[1.2rem] dark:bg-role-dark-surface-panel">
          <View className="mb-[1rem] flex-row items-center justify-between">
            <SpoqaText
              weight="semiBold"
              className="text-size14 text-role-text-primary dark:text-role-dark-text-primary"
            >
              {t("feed.goal")}
            </SpoqaText>
            <Pressable
              onPress={onPressAddGoal}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={t("feed.addGoal")}
              className="h-[3rem] w-[3rem] items-center justify-center rounded-full"
            >
              <PlusIcon
                size={14}
                stroke={iconTone}
              />
            </Pressable>
          </View>

          <View className="gap-[0.8rem]">
            <Pressable
              onPress={onClearGoalSelection}
              className={`min-h-[4.4rem] flex-row items-center justify-between rounded-radius10 border px-[1.2rem] ${
                !hasExplicitGoalSelection
                  ? "border-role-border-strong bg-role-surface-canvas dark:border-role-dark-border-strong dark:bg-role-dark-surface-canvas"
                  : "border-role-border-subtle bg-role-surface-panel dark:border-role-dark-border-subtle dark:bg-role-dark-surface-panel"
              }`}
            >
              <SpoqaText
                weight={!hasExplicitGoalSelection ? "semiBold" : "regular"}
                className="text-size13 text-role-text-primary dark:text-role-dark-text-primary"
              >
                {t("feed.allGoals")}
              </SpoqaText>
              {!hasExplicitGoalSelection ? (
                <CheckIcon
                  size={18}
                  fill={iconTone}
                />
              ) : null}
            </Pressable>

            {isGoalListLoading ? (
              <View className="min-h-[6rem] items-center justify-center rounded-radius10 border border-role-border-subtle dark:border-role-dark-border-subtle">
                <ActivityIndicator size="small" />
              </View>
            ) : isGoalListError ? (
              <View className="min-h-[6rem] items-center justify-center rounded-radius10 border border-role-border-subtle dark:border-role-dark-border-subtle">
                <SpoqaText className="text-size13 text-role-status-error dark:text-role-dark-status-error">
                  {t("feed.goalLoadFailed")}
                </SpoqaText>
              </View>
            ) : goalList.length === 0 ? (
              <View className="min-h-[6rem] items-center justify-center rounded-radius10 border border-role-border-subtle dark:border-role-dark-border-subtle">
                <SpoqaText className="text-size13 text-role-text-tertiary dark:text-role-dark-text-tertiary">
                  {t("feed.noGoals")}
                </SpoqaText>
              </View>
            ) : (
              goalList.map((goal) => {
                const isSelected = selectedGoalIds.includes(goal.id);
                const goalColor = normalizeGoalColor(goal.color);
                const goalBackgroundColor = isSelected
                  ? hexConvertForRGBA({ hex: goal.color, alpha: 0.12 })
                  : undefined;
                const goalBorderColor = isSelected
                  ? hexConvertForRGBA({ hex: goal.color, alpha: 0.36 })
                  : undefined;

                return (
                  <View
                    key={goal.id}
                    className={`min-h-[4.8rem] flex-row items-center rounded-radius10 border ${
                      isSelected
                        ? "bg-role-surface-canvas dark:bg-role-dark-surface-canvas"
                        : "border-role-border-subtle bg-role-surface-panel dark:border-role-dark-border-subtle dark:bg-role-dark-surface-panel"
                    }`}
                    style={{
                      backgroundColor: goalBackgroundColor,
                      borderColor: goalBorderColor,
                    }}
                  >
                    <Pressable
                      onPress={() => onToggleGoal(goal.id)}
                      className="min-w-0 flex-1 flex-row items-center px-[1.2rem] py-[1rem]"
                    >
                      <View
                        className="mr-[0.8rem] h-[0.9rem] w-[0.9rem] rounded-full"
                        style={{ backgroundColor: goalColor }}
                      />
                      <SpoqaText
                        weight={isSelected ? "semiBold" : "regular"}
                        className="min-w-0 flex-1 text-size13 text-role-text-primary dark:text-role-dark-text-primary"
                        numberOfLines={1}
                      >
                        {goal.name}
                      </SpoqaText>
                    </Pressable>

                    <Pressable
                      onPress={() => onPressEditGoal(goal.id)}
                      hitSlop={8}
                      className="h-[4.8rem] w-[4.2rem] items-center justify-center"
                    >
                      <EditIcon
                        size={12}
                        fill={iconTone}
                      />
                    </Pressable>
                  </View>
                );
              })
            )}
          </View>
        </View>

        <View className="rounded-radius10 bg-role-surface-panel p-[1.2rem] dark:bg-role-dark-surface-panel">
          <SpoqaText
            weight="semiBold"
            className="mb-[1rem] text-size14 text-role-text-primary dark:text-role-dark-text-primary"
          >
            {date}
          </SpoqaText>

          <View className="flex-row gap-[0.8rem]">
            <View className="flex-1 rounded-radius10 bg-role-surface-canvas px-[1rem] py-[0.9rem] dark:bg-role-dark-surface-canvas">
              <SpoqaText className="text-size11 text-role-text-tertiary dark:text-role-dark-text-tertiary">
                {t("common.all")}
              </SpoqaText>
              <SpoqaText
                weight="semiBold"
                className="mt-[0.3rem] text-size16 text-role-text-primary dark:text-role-dark-text-primary"
              >
                {summary.total}
              </SpoqaText>
            </View>
            <View className="flex-1 rounded-radius10 bg-role-surface-canvas px-[1rem] py-[0.9rem] dark:bg-role-dark-surface-canvas">
              <SpoqaText className="text-size11 text-role-text-tertiary dark:text-role-dark-text-tertiary">
                {t("common.complete")}
              </SpoqaText>
              <SpoqaText
                weight="semiBold"
                className="mt-[0.3rem] text-size16 text-role-text-primary dark:text-role-dark-text-primary"
              >
                {summary.complete}
              </SpoqaText>
            </View>
            <View className="flex-1 rounded-radius10 bg-role-surface-canvas px-[1rem] py-[0.9rem] dark:bg-role-dark-surface-canvas">
              <SpoqaText className="text-size11 text-role-text-tertiary dark:text-role-dark-text-tertiary">
                {t("todo.actions.postpone")}
              </SpoqaText>
              <SpoqaText
                weight="semiBold"
                className="mt-[0.3rem] text-size16 text-role-text-primary dark:text-role-dark-text-primary"
              >
                {summary.postponed}
              </SpoqaText>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default FeedWideControlPanel;
