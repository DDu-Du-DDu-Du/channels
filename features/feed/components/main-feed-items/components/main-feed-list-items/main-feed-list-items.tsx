import { ActivityIndicator, Pressable, View } from "react-native";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";

import { EmptyList, SpoqaText } from "@/components";
import { ExclamationIcon, PlusIcon } from "@/icons";
import type { MainDailyListType, MainTodosType } from "@/types/response/feed/feed";
import { hexConvertForRGBA, remToPx } from "@/utils";

import MainTodoItem from "../main-todo-item/main-todo-item";

export interface MainFeedListItemsProps {
  dailyList: MainDailyListType[];
  isDailyListLoading: boolean;
  isCalendarOpen: boolean;
  onTodoCompleteToggle: (id: number) => void;
  onTodosheetOpen: (id: number) => void;
  onOpenCreateSheet: (goal: MainDailyListType["goal"]) => void;
}

function MainFeedListItems({
  dailyList,
  isDailyListLoading,
  isCalendarOpen,
  onTodoCompleteToggle,
  onTodosheetOpen,
  onOpenCreateSheet,
}: MainFeedListItemsProps) {
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
        ListEmptyComponent={() =>
          isDailyListLoading ? (
            <View className="items-center py-[4rem]">
              <ActivityIndicator size="small" />
            </View>
          ) : (
            <EmptyList text="목표를 먼저 생성해보세요." />
          )
        }
        renderItem={({ item }) => {
          const todos = item.todos ?? item.Todos ?? [];
          const goalColor = item.goal.color;
          const goalHeaderBackgroundColor = hexConvertForRGBA({
            hex: goalColor,
            alpha: 0.1,
          });
          const goalBorderColor = hexConvertForRGBA({
            hex: goalColor,
            alpha: 0.18,
          });
          const emptyIconBackgroundColor = hexConvertForRGBA({
            hex: goalColor,
            alpha: 0.12,
          });

          return (
            <Animated.View entering={FadeInDown.duration(180)}>
              <View
                className="overflow-hidden rounded-radius15 border bg-role-surface-canvas dark:bg-role-dark-surface-canvas mb-[1.6rem]"
                style={{ borderColor: goalBorderColor }}
              >
                <View
                  className="flex-row items-center justify-between px-[1.6rem] py-[1rem]"
                  style={{ backgroundColor: goalHeaderBackgroundColor }}
                >
                  <View className="min-w-0 flex-1 flex-row items-center">
                    <View
                      className="mr-[0.8rem] h-[0.8rem] w-[0.8rem] rounded-full"
                      style={{ backgroundColor: `#${goalColor}` }}
                    />
                    <SpoqaText
                      weight="semiBold"
                      className="min-w-0 flex-1 text-size15 text-role-text-primary dark:text-role-dark-text-primary"
                      numberOfLines={1}
                    >
                      {item.goal.name}
                    </SpoqaText>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    className="ml-[0.8rem] h-[2.8rem] w-[2.8rem] items-center justify-center"
                    onPress={() => onOpenCreateSheet(item.goal)}
                  >
                    <PlusIcon
                      size={14}
                      stroke={`#${goalColor}`}
                    />
                  </Pressable>
                </View>

                <View>
                  {todos.length === 0 && (
                    <View className="min-h-[14rem] items-center justify-center px-[1.6rem] py-[2.4rem]">
                      <View
                        className="mb-[1rem] h-[4rem] w-[4rem] items-center justify-center rounded-full"
                        style={{ backgroundColor: emptyIconBackgroundColor }}
                      >
                        <ExclamationIcon
                          size={24}
                          stroke={`#${goalColor}`}
                        />
                      </View>
                      <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
                        아직 생성된 투두가 없어요.
                      </SpoqaText>
                      <SpoqaText className="mt-[0.4rem] text-size12 text-role-text-tertiary dark:text-role-dark-text-tertiary">
                        + 버튼으로 투두를 추가해보세요.
                      </SpoqaText>
                    </View>
                  )}

                  {todos.map((TodoItem: MainTodosType) => (
                    <Animated.View key={TodoItem.id}>
                      <MainTodoItem
                        id={TodoItem.id}
                        Todo={TodoItem.name}
                        status={TodoItem.status}
                        color={goalColor}
                        beginAt={TodoItem.beginAt}
                        endAt={TodoItem.endAt}
                        isPostponed={TodoItem.isPostponed}
                        onTodoCompleteToggle={onTodoCompleteToggle}
                        onTextPress={onTodosheetOpen}
                        handleToggleOn={() => onTodosheetOpen(TodoItem.id)}
                      />
                    </Animated.View>
                  ))}
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
