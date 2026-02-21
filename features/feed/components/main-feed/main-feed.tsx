import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue, withTiming } from "react-native-reanimated";

import { FEED_KEY } from "@/constants/query-key/query-key";
import FeedCalendar from "@/features/feed/components/feed-calendar/feed-calendar";
import MainFeedItems from "@/features/feed/components/main-feed-items/main-feed-items";
import { useMe } from "@/features/user";
import { getDailyList, getDailyTimeTable, getPeriodDDuDus } from "@/service/feed/feed";
import { useAuthStore } from "@/stores";
import type {
  MainDailyListType,
  MainDailyTimeTableType,
  MonthlyWeeklyDDuDuType,
} from "@/types/response/feed/feed";
import { formatDateToYYYYMMDD } from "@/utils";
import { useQuery } from "@tanstack/react-query";

import { useLocalSearchParams } from "expo-router";

export type MainFeedView = "list" | "timeline";

export interface MainFeedProps {
  onSelectDate?: (date: string) => void;
}

const DATE_PARAM_RE = /^\d{4}-\d{2}-\d{2}$/;

const toSingleParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const resolveFeedView = (view: string | undefined): MainFeedView => {
  return view === "timeline" ? "timeline" : "list";
};

const resolveFeedDate = (date: string | undefined, fallbackDate: string) => {
  if (!date || !DATE_PARAM_RE.test(date)) {
    return fallbackDate;
  }

  const parsedMs = Date.parse(`${date}T00:00:00`);

  if (Number.isNaN(parsedMs)) {
    return fallbackDate;
  }

  return date;
};

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
  const params = useLocalSearchParams<{ view?: string | string[]; date?: string | string[] }>();
  const view = resolveFeedView(toSingleParam(params.view));
  const paramDate = toSingleParam(params.date);
  const hasTokens = useAuthStore((state) => state.accessToken && state.refreshToken);
  const { data: user } = useMe({ readOnly: true });
  const today = useMemo(() => formatDateToYYYYMMDD(new Date()), []);
  const resolvedParamDate = useMemo(() => resolveFeedDate(paramDate, today), [paramDate, today]);
  const [selectedDate, setSelectedDate] = useState(resolvedParamDate);
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

  useEffect(() => {
    setSelectedDate(resolvedParamDate);
  }, [resolvedParamDate]);

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

  const { data: dailyTimeTable, isLoading: isDailyTimeTableLoading } =
    useQuery<MainDailyTimeTableType>({
      queryKey: [FEED_KEY.DAILY_TIMETABLE, selectedDate],
      queryFn: () =>
        getDailyTimeTable({
          userId: user?.id,
          date: selectedDate,
        }),
      enabled: isSessionReady && view === "timeline",
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

  const feedCalendar = (
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
  );

  const feedItems = (
    <MainFeedItems
      view={view}
      dailyList={dailyList ?? []}
      dailyTimeTable={dailyTimeTable}
      isDailyTimeTableLoading={isDailyTimeTableLoading}
      selectedDDuDuDate={selectedDate}
      isCalendarOpen={isCalendarOpen}
    />
  );

  if (view === "timeline") {
    return (
      <View className="w-full flex-1">
        <GestureDetector gesture={calendarListPanGesture}>{feedCalendar}</GestureDetector>
        {feedItems}
      </View>
    );
  }

  return (
    <GestureDetector gesture={calendarListPanGesture}>
      <View className="w-full flex-1">
        {feedCalendar}
        {feedItems}
      </View>
    </GestureDetector>
  );
}

export default MainFeed;
