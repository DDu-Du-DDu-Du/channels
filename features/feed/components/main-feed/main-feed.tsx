import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue, withTiming } from "react-native-reanimated";

import { FEED_KEY } from "@/constants/query-key/query-key";
import FeedCalendar from "@/features/feed/components/feed-calendar/feed-calendar";
import MainFeedItems from "@/features/feed/components/main-feed-items/main-feed-items";
import { useMe } from "@/features/user";
import { getDailyList, getPeriodDDuDus } from "@/service/feed/feed";
import { useAuthStore } from "@/stores";
import type { MainDailyListType, MonthlyWeeklyDDuDuType } from "@/types/response/feed/feed";
import { formatDateToYYYYMMDD } from "@/utils";
import { useQuery } from "@tanstack/react-query";

export type MainFeedView = "ddudu" | "schedule";

export interface MainFeedProps {
  onSelectDate?: (date: string) => void;
}

const sortByGoalStatus = (list: MainDailyListType[]) =>
  list.sort((a, b) => {
    if (a.goal.status > b.goal.status) {
      return -1;
    }

    if (a.goal.status < b.goal.status) {
      return 1;
    }

    return 1;
  });

function MainFeed({ onSelectDate }: MainFeedProps) {
  const hasTokens = useAuthStore((state) => state.accessToken && state.refreshToken);
  const { data: user } = useMe({ readOnly: true });
  const today = useMemo(() => formatDateToYYYYMMDD(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  const [calendarHeightRange, setCalendarHeightRange] = useState(240);
  const dateKey = useMemo(() => selectedDate.slice(0, 7), [selectedDate]);
  const [handleToggleCalendar, setHandleToggleCalendar] = useState<(() => void) | null>(null);
  const isSessionReady = !!hasTokens && !!user;
  const calendarOpenProgress = useSharedValue(1);
  const dragStartProgress = useSharedValue(1);
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    onSelectDate?.(date);
  };

  const { data: periodDDuDus } = useQuery<MonthlyWeeklyDDuDuType[]>({
    queryKey: [FEED_KEY.MONTHLY_DDUDUS, dateKey],
    queryFn: async () =>
      getPeriodDDuDus({
        userId: user.id,
        date: dateKey,
        type: "MONTH",
      }),
    enabled: isSessionReady,
  });

  const { data: dailyList } = useQuery<MainDailyListType[]>({
    queryKey: [FEED_KEY.DAILY_LIST, selectedDate],
    queryFn: () =>
      getDailyList({
        userId: user?.id,
        date: selectedDate,
      }),
    select: sortByGoalStatus,
    enabled: isSessionReady,
  });

  useEffect(() => {
    calendarOpenProgress.value = withTiming(isCalendarOpen ? 1 : 0, {
      duration: 220,
    });
  }, [calendarOpenProgress, isCalendarOpen]);

  const calendarListPanGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-8, 8])
        .failOffsetX([-16, 16])
        .onBegin(() => {
          dragStartProgress.value = calendarOpenProgress.value;
        })
        .onUpdate((event) => {
          const isVerticalGesture = Math.abs(event.translationY) > Math.abs(event.translationX);
          if (!isVerticalGesture) {
            return;
          }

          const range = Math.max(1, calendarHeightRange);
          const nextProgress = dragStartProgress.value + event.translationY / range;
          calendarOpenProgress.value = Math.max(0, Math.min(1, nextProgress));
        })
        .onEnd((event) => {
          const isVerticalGesture = Math.abs(event.translationY) > Math.abs(event.translationX);
          if (!isVerticalGesture) {
            return;
          }

          let nextIsOpen = isCalendarOpen;

          if (isCalendarOpen && event.translationY < -16) {
            nextIsOpen = false;
          }

          if (!isCalendarOpen && event.translationY > 16) {
            nextIsOpen = true;
          }

          calendarOpenProgress.value = withTiming(nextIsOpen ? 1 : 0, {
            duration: 220,
          });

          if (nextIsOpen !== isCalendarOpen) {
            handleToggleCalendar?.();
          }
        }),
    [
      calendarHeightRange,
      calendarOpenProgress,
      dragStartProgress,
      handleToggleCalendar,
      isCalendarOpen,
    ],
  );

  return (
    <GestureDetector gesture={calendarListPanGesture}>
      <View className="w-full flex-1">
        <FeedCalendar
          date={selectedDate}
          monthlyDDuDus={periodDDuDus ?? []}
          onSelectDate={handleSelectDate}
          onCalendarToggled={setIsCalendarOpen}
          externalOpenProgress={calendarOpenProgress}
          onCalendarHeightRangeChange={setCalendarHeightRange}
          onReadyToggleCalendar={(nextHandleToggleCalendar) => {
            setHandleToggleCalendar(() => nextHandleToggleCalendar);
          }}
        />
        {dailyList && dailyList.length > 0 && (
          <MainFeedItems
            dailyList={dailyList}
            selectedDDuDuDate={selectedDate}
            isCalendarOpen={isCalendarOpen}
          />
        )}
      </View>
    </GestureDetector>
  );
}

export default MainFeed;
