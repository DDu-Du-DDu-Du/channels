import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { type SharedValue, useSharedValue, withTiming } from "react-native-reanimated";

import { SpoqaText, WidePanelLayout } from "@/components";
import { FEED_KEY, GOAL_KEY } from "@/constants/query-key/query-key";
import FeedCalendar from "@/features/feed/components/feed-calendar/feed-calendar";
import FeedWideControlPanel, {
  type FeedWideSummary,
} from "@/features/feed/components/feed-wide-control-panel/feed-wide-control-panel";
import MainFeedItems from "@/features/feed/components/main-feed-items/main-feed-items";
import { useFeedWideState } from "@/features/feed/components/main-feed/hooks";
import { GoalEditorForm, GoalEditorScreen } from "@/features/goal";
import { useMe } from "@/features/user";
import { useWideLayout } from "@/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { CloseIcon } from "@/icons";
import { getDailyList, getDailyTimeTable, getPeriodTodos } from "@/service/feed/feed";
import { getGoalList } from "@/service/goal/goal";
import { useAuthStore, useSettingsStore } from "@/stores";
import type {
  MainDailyListType,
  MainDailyTimeTableType,
  MainTimeTableType,
  MonthlyWeeklyTodoType,
} from "@/types/response/feed/feed";
import type { GoalType } from "@/types/response/goal/goal";
import { formatDateToYYYYMMDD } from "@/utils";
import { useQuery } from "@tanstack/react-query";

import { useLocalSearchParams, useRouter } from "expo-router";

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

const getDailyTodos = (daily: MainDailyListType) => daily.todos ?? daily.Todos ?? [];

const filterDailyListByGoalIds = (list: MainDailyListType[], goalIds: Set<number>) =>
  list
    .filter((daily) => goalIds.has(daily.goal.id))
    .map((daily) => {
      const todos = getDailyTodos(daily);

      return {
        ...daily,
        todos,
        Todos: todos,
      };
    });

const filterTimeTableSectionByGoalIds = (
  section: MainTimeTableType,
  goalIds: Set<number>,
): MainTimeTableType => {
  const todos = (section.todos ?? section.Todos ?? []).filter((todo) => goalIds.has(todo.goalId));

  return {
    ...section,
    todos,
    Todos: todos,
  };
};

const filterDailyTimeTableByGoalIds = (
  dailyTimeTable: MainDailyTimeTableType | undefined,
  goalIds: Set<number>,
): MainDailyTimeTableType | undefined => {
  if (!dailyTimeTable) {
    return dailyTimeTable;
  }

  return {
    timetable: (dailyTimeTable.timetable ?? []).map((section) =>
      filterTimeTableSectionByGoalIds(section, goalIds),
    ),
    unassignedTodos: filterDailyListByGoalIds(dailyTimeTable.unassignedTodos ?? [], goalIds),
  };
};

const summarizeDailyList = (dailyList: MainDailyListType[]): FeedWideSummary => {
  return dailyList.reduce<FeedWideSummary>(
    (summary, daily) => {
      const todos = getDailyTodos(daily);

      return todos.reduce<FeedWideSummary>(
        (nextSummary, todo) => ({
          total: nextSummary.total + 1,
          complete: nextSummary.complete + (todo.status === "COMPLETE" ? 1 : 0),
          postponed: nextSummary.postponed + (todo.isPostponed ? 1 : 0),
        }),
        summary,
      );
    },
    { total: 0, complete: 0, postponed: 0 },
  );
};

interface CreateCalendarPanGestureParams {
  enabled: boolean;
  calendarHeightRange: number;
  calendarOpenProgress: SharedValue<number>;
  dragStartProgress: SharedValue<number>;
  isCalendarOpen: boolean;
  handleToggleCalendar: (() => void) | null;
  handleSetIsCalendarOpen: (next: boolean) => void;
}

const createCalendarPanGesture = ({
  enabled,
  calendarHeightRange,
  calendarOpenProgress,
  dragStartProgress,
  isCalendarOpen,
  handleToggleCalendar,
  handleSetIsCalendarOpen,
}: CreateCalendarPanGestureParams) => {
  return Gesture.Pan()
    .enabled(enabled)
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

      if (nextIsOpen !== isCalendarOpen) {
        handleToggleCalendar?.();
        return;
      }

      handleSetIsCalendarOpen(nextIsOpen);
    });
};

function MainFeed({ onSelectDate }: MainFeedProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ view?: string | string[]; date?: string | string[] }>();
  const view = resolveFeedView(toSingleParam(params.view));
  const { isWideLayout } = useWideLayout();
  const paramDate = toSingleParam(params.date);
  const hasTokens = useAuthStore((state) => Boolean(state.accessToken && state.refreshToken));
  const isGuestSession = useAuthStore((state) => state.sessionType === "guest");
  const isDarkMode = useSettingsStore((state) => state.display.isDarkMode);
  const { data: user } = useMe({ readOnly: true });
  const today = useMemo(() => formatDateToYYYYMMDD(new Date()), []);
  const resolvedParamDate = useMemo(() => resolveFeedDate(paramDate, today), [paramDate, today]);
  const [selectedDate, setSelectedDate] = useState(resolvedParamDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  const [calendarHeightRange, setCalendarHeightRange] = useState(240);
  const dateKey = useMemo(() => selectedDate.slice(0, 7), [selectedDate]);
  const [handleToggleCalendar, setHandleToggleCalendar] = useState<(() => void) | null>(null);
  const isSessionReady = isGuestSession || (!!hasTokens && !!user);
  const calendarOpenProgress = useSharedValue(1);
  const dragStartProgress = useSharedValue(1);
  const {
    selectedGoalIds,
    detailMode,
    handleToggleGoal,
    handleClearGoalSelection,
    handleOpenGoalCreate,
    handleOpenGoalEdit,
    handleOpenFeedDetail,
  } = useFeedWideState();
  const handleSelectDate = (date: string) => {
    if (date !== selectedDate) {
      router.setParams({ date });
    }

    setSelectedDate(date);
    onSelectDate?.(date);
  };

  const handleSelectWideDate = (date: string) => {
    handleSelectDate(date);
    handleOpenFeedDetail();
  };

  const handlePressToday = () => {
    handleSelectWideDate(today);
  };

  const handleChangeView = (nextView: MainFeedView) => {
    if (nextView === view) {
      return;
    }

    router.setParams({ view: nextView });
    handleOpenFeedDetail();
  };

  useEffect(() => {
    setSelectedDate(resolvedParamDate);
  }, [resolvedParamDate]);

  const { data: periodTodos } = useQuery<MonthlyWeeklyTodoType[]>({
    queryKey: [FEED_KEY.MONTHLY_Todos, dateKey],
    queryFn: async () =>
      getPeriodTodos({
        userId: user?.id ?? 0,
        date: dateKey,
        type: "MONTH",
      }),
    enabled: isSessionReady,
  });

  const {
    data: dailyList,
    isLoading: isDailyListLoading,
    isFetching: isDailyListFetching,
  } = useQuery<MainDailyListType[]>({
    queryKey: [FEED_KEY.DAILY_LIST, selectedDate],
    queryFn: () =>
      getDailyList({
        userId: user?.id ?? 0,
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
          userId: user?.id ?? 0,
          date: selectedDate,
        }),
      enabled: isSessionReady && view === "timeline",
    });

  const {
    data: goalList = [],
    isLoading: isGoalListLoading,
    isError: isGoalListError,
  } = useQuery<GoalType[]>({
    queryKey: [GOAL_KEY.GOAL_LIST, user?.id],
    queryFn: () => {
      if (!isGuestSession && !user?.id) {
        return Promise.resolve([]);
      }

      return getGoalList({ userId: user?.id ?? 0 });
    },
    enabled: isWideLayout && isSessionReady,
  });

  const inProgressGoalList = useMemo(
    () =>
      [...goalList]
        .filter((goal) => goal.status === "IN_PROGRESS")
        .sort((a, b) => {
          if (a.priority !== b.priority) {
            return a.priority - b.priority;
          }

          return a.id - b.id;
        }),
    [goalList],
  );

  const activeWideGoalIds = useMemo(() => {
    if (selectedGoalIds.length > 0) {
      return new Set(selectedGoalIds);
    }

    const sourceGoalIds =
      inProgressGoalList.length > 0
        ? inProgressGoalList.map((goal) => goal.id)
        : (dailyList ?? [])
            .filter((daily) => daily.goal.status === "IN_PROGRESS")
            .map((daily) => daily.goal.id);

    return new Set(sourceGoalIds);
  }, [dailyList, inProgressGoalList, selectedGoalIds]);

  const filteredDailyList = useMemo(
    () => filterDailyListByGoalIds(dailyList ?? [], activeWideGoalIds),
    [activeWideGoalIds, dailyList],
  );

  const filteredDailyTimeTable = useMemo(
    () => filterDailyTimeTableByGoalIds(dailyTimeTable, activeWideGoalIds),
    [activeWideGoalIds, dailyTimeTable],
  );

  const wideSummary = useMemo(() => summarizeDailyList(filteredDailyList), [filteredDailyList]);

  useEffect(() => {
    calendarOpenProgress.value = withTiming(isCalendarOpen ? 1 : 0, {
      duration: 220,
    });
  }, [calendarOpenProgress, isCalendarOpen]);

  const calendarPanGesture = useMemo(
    () =>
      createCalendarPanGesture({
        enabled: true,
        calendarHeightRange,
        calendarOpenProgress,
        dragStartProgress,
        isCalendarOpen,
        handleToggleCalendar,
        handleSetIsCalendarOpen: setIsCalendarOpen,
      }),
    [
      calendarHeightRange,
      calendarOpenProgress,
      dragStartProgress,
      handleToggleCalendar,
      setIsCalendarOpen,
      isCalendarOpen,
    ],
  );

  const feedPanGesture = useMemo(
    () =>
      createCalendarPanGesture({
        enabled: isCalendarOpen,
        calendarHeightRange,
        calendarOpenProgress,
        dragStartProgress,
        isCalendarOpen,
        handleToggleCalendar,
        handleSetIsCalendarOpen: setIsCalendarOpen,
      }),
    [
      calendarHeightRange,
      calendarOpenProgress,
      dragStartProgress,
      handleToggleCalendar,
      setIsCalendarOpen,
      isCalendarOpen,
    ],
  );

  const feedCalendar = (
    <FeedCalendar
      date={selectedDate}
      monthlyTodos={periodTodos ?? []}
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
      isDailyListLoading={isDailyListLoading || isDailyListFetching}
      dailyTimeTable={dailyTimeTable}
      isDailyTimeTableLoading={isDailyTimeTableLoading}
      selectedTodoDate={selectedDate}
      isCalendarOpen={isCalendarOpen}
    />
  );

  const wideFeedItems = (
    <View className="flex-1">
      <View className="h-[5.6rem] flex-row items-center justify-between border-b border-role-border-subtle px-[2rem] dark:border-role-dark-border-subtle">
        <SpoqaText
          weight="semiBold"
          className="text-size16 text-role-text-primary dark:text-role-dark-text-primary"
        >
          {selectedDate}
        </SpoqaText>
      </View>

      <MainFeedItems
        view={view}
        dailyList={filteredDailyList}
        isDailyListLoading={isDailyListLoading || isDailyListFetching}
        dailyTimeTable={filteredDailyTimeTable}
        isDailyTimeTableLoading={isDailyTimeTableLoading}
        selectedTodoDate={selectedDate}
        isCalendarOpen={false}
      />
    </View>
  );

  const wideGoalEditorDetail =
    detailMode.type === "goal-create" ? (
      <View className="flex-1">
        <FeedWideEditorHeader
          title={t("feed.goalCreate")}
          onPressClose={handleOpenFeedDetail}
        />
        <GoalEditorForm
          submitLabel={t("feed.goalCreate")}
          redirectOnSuccess={false}
          onSuccess={handleOpenFeedDetail}
        />
      </View>
    ) : detailMode.type === "goal-edit" ? (
      <View className="flex-1">
        <FeedWideEditorHeader
          title={t("feed.goalEdit")}
          onPressClose={handleOpenFeedDetail}
        />
        <GoalEditorScreen
          goalId={detailMode.goalId}
          redirectOnSuccess={false}
          invalidateFeedOnSuccess
          onMutationSuccess={handleOpenFeedDetail}
        />
      </View>
    ) : null;

  if (isWideLayout) {
    return (
      <WidePanelLayout
        control={
          <FeedWideControlPanel
            date={selectedDate}
            view={view}
            monthlyTodos={periodTodos ?? []}
            goalList={inProgressGoalList}
            isGoalListLoading={isGoalListLoading}
            isGoalListError={isGoalListError}
            selectedGoalIds={selectedGoalIds}
            summary={wideSummary}
            onSelectDate={handleSelectWideDate}
            onPressToday={handlePressToday}
            onChangeView={handleChangeView}
            onClearGoalSelection={handleClearGoalSelection}
            onToggleGoal={handleToggleGoal}
            onPressAddGoal={handleOpenGoalCreate}
            onPressEditGoal={handleOpenGoalEdit}
          />
        }
        detail={wideGoalEditorDetail ?? wideFeedItems}
        controlWidth="34%"
      />
    );
  }

  return (
    <View className="w-full flex-1">
      <GestureDetector gesture={calendarPanGesture}>{feedCalendar}</GestureDetector>
      <GestureDetector gesture={feedPanGesture}>{feedItems}</GestureDetector>

      <Pressable
        onPress={() => handleSelectDate(today)}
        className="absolute bottom-[2rem] left-[1.6rem] h-[4.4rem] items-center justify-center rounded-full bg-[#F1F2F4] px-[1.4rem] dark:bg-[#2F3136]"
        style={{
          boxShadow: isDarkMode ? "0px 4px 14px rgba(0,0,0,0.28)" : "0px 4px 14px rgba(0,0,0,0.12)",
          elevation: 4,
        }}
      >
        <SpoqaText className="text-size13 text-role-text-primary dark:text-role-dark-text-primary">
          {t("calendar.today")}
        </SpoqaText>
      </Pressable>
    </View>
  );
}

interface FeedWideEditorHeaderProps {
  title: string;
  onPressClose: () => void;
}

function FeedWideEditorHeader({ title, onPressClose }: FeedWideEditorHeaderProps) {
  const iconTone = useThemeColorToken("ui.icon.default");

  return (
    <View className="h-[5.6rem] flex-row items-center justify-between border-b border-role-border-subtle px-[2rem] dark:border-role-dark-border-subtle">
      <SpoqaText
        weight="semiBold"
        className="text-size16 text-role-text-primary dark:text-role-dark-text-primary"
      >
        {title}
      </SpoqaText>
      <Pressable
        onPress={onPressClose}
        hitSlop={8}
        className="h-[3.6rem] w-[3.6rem] items-center justify-center"
      >
        <CloseIcon
          size={22}
          fill={iconTone}
        />
      </Pressable>
    </View>
  );
}

export default MainFeed;
