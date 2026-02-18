import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import { EmptyList } from "@/components";
import { TimeItem, TimeStamp } from "@/components/timeline/components";
import type {
  MainDailyTimeTableType,
  MainTimeTableDDuDuType,
  MainTimeTableType,
} from "@/types/response/feed/feed";

interface TimelineSectionType {
  label: string;
  ddudus: MainTimeTableDDuDuType[];
}

export interface MainFeedTimelineItemsProps {
  dailyTimeTable?: MainDailyTimeTableType;
  isDailyTimeTableLoading: boolean;
  isCalendarOpen: boolean;
  onDDuDuCompleteToggle: (id: number) => void;
  onDDuDuSheetOpen: (id: number) => void;
}

const formatTimestampLabel = (beginAt: string) => {
  const matched = beginAt.match(/^(\d{1,2}:\d{2})/);
  return matched ? matched[1] : beginAt;
};

const mapTimedSection = (timeTable: MainTimeTableType): TimelineSectionType | null => {
  if (timeTable.ddudus.length === 0) {
    return null;
  }

  return {
    label: formatTimestampLabel(timeTable.beginAt),
    ddudus: timeTable.ddudus,
  };
};

function MainFeedTimelineItems({
  dailyTimeTable,
  isDailyTimeTableLoading,
  isCalendarOpen,
  onDDuDuCompleteToggle,
  onDDuDuSheetOpen,
}: MainFeedTimelineItemsProps) {
  const timelineSections = useMemo(() => {
    const timedSections = (dailyTimeTable?.timetable ?? [])
      .map(mapTimedSection)
      .filter((section): section is TimelineSectionType => section !== null);

    const unassignedDdudus = (dailyTimeTable?.unassignedDdudus ?? []).flatMap((daily) =>
      daily.ddudus.map<MainTimeTableDDuDuType>((ddudu) => ({
        id: ddudu.id,
        name: ddudu.name,
        status: ddudu.status,
        goalId: daily.goal.id,
        color: daily.goal.color,
      })),
    );

    if (unassignedDdudus.length > 0) {
      timedSections.push({
        label: "미정",
        ddudus: unassignedDdudus,
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
          <EmptyList text="불러오는 중..." />
        ) : (
          !hasTimelineItems && <EmptyList text="목표를 먼저 생성해보세요." />
        )}

        {!isDailyTimeTableLoading && hasTimelineItems && (
          <View className="relative">
            {timelineSections.map((section, sectionIndex) =>
              section.ddudus.map((ddudu, dduduIndex) => (
                <View
                  key={`${section.label}-${ddudu.id}-${sectionIndex}-${dduduIndex}`}
                  className="w-full flex-row"
                >
                  {dduduIndex === 0 ? (
                    <View className="w-[5rem]">
                      <TimeStamp fillParentHeight>{section.label}</TimeStamp>
                    </View>
                  ) : (
                    <View className="w-[5rem]" />
                  )}

                  <View className="flex-1 pl-[5rem] pr-[0.4rem]">
                    <TimeItem
                      ddudu={ddudu}
                      isFirstItem={dduduIndex === 0}
                      isLastItem={dduduIndex === section.ddudus.length - 1}
                      onDDuDuCompleteToggle={onDDuDuCompleteToggle}
                      onDDuDuSheetOpen={onDDuDuSheetOpen}
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
