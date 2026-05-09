import { useMemo } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { EmptyList } from "@/components";
import { TimeItem, TimeStamp } from "@/components/timeline/components";
import type {
  MainDailyTimeTableType,
  MainTimeTableTodoType,
  MainTimeTableType,
} from "@/types/response/feed/feed";

interface TimelineSectionType {
  label: string;
  Todos: MainTimeTableTodoType[];
}

export interface MainFeedTimelineItemsProps {
  dailyTimeTable?: MainDailyTimeTableType;
  isDailyTimeTableLoading: boolean;
  isCalendarOpen: boolean;
  onTodoCompleteToggle: (id: number) => void;
  onTodosheetOpen: (id: number) => void;
}

const formatTimestampLabel = (beginAt: string) => {
  const matched = beginAt.match(/^(\d{1,2}:\d{2})/);
  return matched ? matched[1] : beginAt;
};

const mapTimedSection = (timeTable: MainTimeTableType): TimelineSectionType | null => {
  const todos = timeTable.todos ?? timeTable.Todos ?? [];

  if (todos.length === 0) {
    return null;
  }

  return {
    label: formatTimestampLabel(timeTable.beginAt),
    Todos: todos,
  };
};

function MainFeedTimelineItems({
  dailyTimeTable,
  isDailyTimeTableLoading,
  isCalendarOpen,
  onTodoCompleteToggle,
  onTodosheetOpen,
}: MainFeedTimelineItemsProps) {
  const timelineSections = useMemo(() => {
    const timedSections = (dailyTimeTable?.timetable ?? [])
      .map(mapTimedSection)
      .filter((section): section is TimelineSectionType => section !== null);

    const unassignedTodos = (
      dailyTimeTable?.unassignedTodos ??
      dailyTimeTable?.unassignedTodos ??
      []
    ).flatMap((daily) =>
      (daily.todos ?? daily.Todos ?? []).map<MainTimeTableTodoType>((Todo) => ({
        id: Todo.id,
        name: Todo.name,
        status: Todo.status,
        goalId: daily.goal.id,
        color: daily.goal.color,
      })),
    );

    if (unassignedTodos.length > 0) {
      timedSections.push({
        label: "미정",
        Todos: unassignedTodos,
      });
    }

    return timedSections;
  }, [dailyTimeTable]);

  const hasTimelineItems = timelineSections.length > 0;

  return (
    <View className="flex-1 pt-[0.8rem]">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isCalendarOpen}
        bounces={!isCalendarOpen}
        alwaysBounceVertical={!isCalendarOpen}
        overScrollMode="always"
      >
        {isDailyTimeTableLoading ? (
          <View className="items-center py-[4rem]">
            <ActivityIndicator size="small" />
          </View>
        ) : (
          !hasTimelineItems && <EmptyList text="목표를 먼저 생성해보세요." />
        )}

        {!isDailyTimeTableLoading && hasTimelineItems && (
          <View className="relative">
            {timelineSections.map((section, sectionIndex) =>
              section.Todos.map((Todo, TodoIndex) => (
                <View
                  key={`${section.label}-${Todo.id}-${sectionIndex}-${TodoIndex}`}
                  className="w-full flex-row"
                >
                  {TodoIndex === 0 ? (
                    <View className="w-[5rem]">
                      <TimeStamp fillParentHeight>{section.label}</TimeStamp>
                    </View>
                  ) : (
                    <View className="w-[5rem]" />
                  )}

                  <View className="flex-1 pl-[5rem] pr-[0.4rem]">
                    <TimeItem
                      Todo={Todo}
                      isFirstItem={TodoIndex === 0}
                      isLastItem={TodoIndex === section.Todos.length - 1}
                      onTodoCompleteToggle={onTodoCompleteToggle}
                      onTodosheetOpen={onTodosheetOpen}
                    />
                  </View>
                </View>
              )),
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default MainFeedTimelineItems;
