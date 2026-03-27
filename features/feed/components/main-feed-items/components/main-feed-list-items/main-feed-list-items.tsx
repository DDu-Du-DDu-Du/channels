import { View } from "react-native";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";

import { EmptyList, GoalItem } from "@/components";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import type { MainDailyListType, MainTodosType } from "@/types/response/feed/feed";
import { hexConvertForRGBA, remToPx } from "@/utils";

import MainTodoItem from "../main-todo-item/main-todo-item";

export interface MainFeedListItemsProps {
  dailyList: MainDailyListType[];
  isCalendarOpen: boolean;
  onTodoCompleteToggle: (id: number) => void;
  onTodosheetOpen: (id: number) => void;
  onOpenCreateSheet: (goal: MainDailyListType["goal"]) => void;
}

function MainFeedListItems({
  dailyList,
  isCalendarOpen,
  onTodoCompleteToggle,
  onTodosheetOpen,
  onOpenCreateSheet,
}: MainFeedListItemsProps) {
  const emptyIconStroke = useThemeColorToken("role.icon.muted");
  return (
    <Animated.View style={{ flex: 1 }}>
      <Animated.FlatList
        contentContainerStyle={{ marginTop: remToPx(0.8) }}
        data={dailyList}
        keyExtractor={(item) => item.goal.id.toString()}
        style={{ flex: 1 }}
        itemLayoutAnimation={LinearTransition.duration(180)}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isCalendarOpen}
        bounces={!isCalendarOpen}
        alwaysBounceVertical={!isCalendarOpen}
        overScrollMode="always"
        ListEmptyComponent={() => <EmptyList text="목표를 먼저 생성해보세요." />}
        renderItem={({ item }) => {
          const todos = item.todos ?? item.Todos ?? [];
          const groupBorderColor = hexConvertForRGBA({ hex: item.goal.color, alpha: 0.35 });
          const thinBorderColor = hexConvertForRGBA({ hex: item.goal.color, alpha: 0.28 });
          const emptyBackgroundColor = hexConvertForRGBA({ hex: item.goal.color, alpha: 0.12 });

          return (
            <Animated.View entering={FadeInDown.duration(180)}>
              <View
                className="mb-4 overflow-hidden rounded-radius15 border-[0.16rem]"
                style={{ borderColor: groupBorderColor }}
              >
                <View
                  className="border-b-[0.16rem]"
                  style={{ borderBottomColor: groupBorderColor }}
                >
                  <GoalItem
                    className="w-full"
                    type="create"
                    isRounded={false}
                    height={remToPx(1.8) + 15}
                    goal={item.goal}
                    onPress={() => onOpenCreateSheet(item.goal)}
                  />
                </View>

                <View>
                  {todos.length === 0 && (
                    <View style={{ backgroundColor: emptyBackgroundColor }}>
                      <EmptyList
                        text="아직 생성된 투두가 없어요."
                        className="w-full items-center py-[2rem]"
                        textClassName="mt-[0.8rem] text-size14 text-role-text-secondary dark:text-role-dark-text-secondary"
                        iconStroke={emptyIconStroke}
                      />
                    </View>
                  )}

                  {todos.map((TodoItem: MainTodosType, index: number) => {
                    const showThinBorder = index !== todos.length - 1;

                    return (
                      <Animated.View
                        key={TodoItem.id}
                        style={{
                          borderBottomWidth: showThinBorder ? 1 : 0,
                          borderBottomColor: thinBorderColor,
                        }}
                      >
                        <MainTodoItem
                          id={TodoItem.id}
                          Todo={TodoItem.name}
                          status={TodoItem.status}
                          color={item.goal.color}
                          onTodoCompleteToggle={onTodoCompleteToggle}
                          handleToggleOn={() => onTodosheetOpen(TodoItem.id)}
                        />
                      </Animated.View>
                    );
                  })}
                </View>
              </View>
            </Animated.View>
          );
        }}
      />
    </Animated.View>
  );
}

export default MainFeedListItems;
