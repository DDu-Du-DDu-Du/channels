import { useState } from "react";

import { DDUDU_KEY, FEED_KEY } from "@/constants/query-key/query-key";
import type { DDuDuTimeRangeType, DDuDuTimeType } from "@/features/feed/feed.types";
import { useToggle } from "@/hooks";
import {
  fetchCompleteToggleDDuDu,
  fetchDDuDuChangeDate,
  fetchDDuDuChangeTime,
  fetchDDuDuRepeatDate,
  fetchDeleteDDuDu,
} from "@/service/feed/feed";
import { formatDateToYYYYMMDD } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseDDuDuSearchActionsProps {
  onRefetchSearch: () => void;
}

function useDDuDuSearchActions({ onRefetchSearch }: UseDDuDuSearchActionsProps) {
  const queryClient = useQueryClient();
  const [currentDDuDuId, setCurrentDDuDuId] = useState(-1);
  const [hasAlarmBeginAt, setHasAlarmBeginAt] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [currentDate, setCurrentDate] = useState("");
  const [currentCalendarType, setCurrentCalendarType] = useState<"repeat" | "change">("change");
  const [currentDDuDuTime, setCurrentDDuDuTime] = useState<DDuDuTimeType>({
    beginAt: null,
    endAt: null,
  });

  const {
    isToggle: isDDuDuSheetToggle,
    handleToggleOn: handleDDuDuSheetToggleOn,
    handleToggleOff: handleDDuDuSheetToggleOff,
  } = useToggle();
  const {
    isToggle: isAlarmSheetToggle,
    handleToggleOn: handleAlarmSheetToggleOn,
    handleToggleOff: handleAlarmSheetToggleOff,
  } = useToggle();
  const {
    isToggle: isCalendarSheetToggle,
    handleToggleOn: handleCalendarSheetToggleOn,
    handleToggleOff: handleCalendarSheetToggleOff,
  } = useToggle();
  const {
    isToggle: isDDuDuTimeSheetToggle,
    handleToggleOn: handleDDuDuTimeSheetToggleOn,
    handleToggleOff: handleDDuDuTimeSheetToggleOff,
  } = useToggle();

  const handleRefetchLinkedQueries = () => {
    queryClient.invalidateQueries({ queryKey: [DDUDU_KEY.SEARCH] });
    queryClient.invalidateQueries({ queryKey: [FEED_KEY.MONTHLY_DDUDUS] });
    queryClient.invalidateQueries({ queryKey: [FEED_KEY.WEEKLY_DDUDUS] });
    queryClient.invalidateQueries({ queryKey: [FEED_KEY.DAILY_LIST] });
    queryClient.invalidateQueries({ queryKey: [FEED_KEY.DAILY_TIMETABLE] });
    onRefetchSearch();
  };

  const completeToggleDDuDuMutation = useMutation({
    mutationKey: [FEED_KEY.COMPLETE_TOGGLE],
    mutationFn: fetchCompleteToggleDDuDu,
    onSuccess: handleRefetchLinkedQueries,
  });

  const deleteDDuDuMutation = useMutation({
    mutationKey: [FEED_KEY.DELETE_DDUDU],
    mutationFn: fetchDeleteDDuDu,
    onSuccess: () => {
      handleRefetchLinkedQueries();
      handleDDuDuSheetToggleOff();
    },
  });

  const dduduChangeDateMutation = useMutation({
    mutationKey: [FEED_KEY.DDUDU_CHANGE_DATE],
    mutationFn: fetchDDuDuChangeDate,
    onSuccess: () => {
      handleRefetchLinkedQueries();
      setSelectedDate(undefined);
      handleCalendarSheetToggleOff();
    },
  });

  const dduduRepeatDateMutation = useMutation({
    mutationKey: [FEED_KEY.DDUDU_REPEAT_DATE],
    mutationFn: fetchDDuDuRepeatDate,
    onSuccess: () => {
      handleRefetchLinkedQueries();
      setSelectedDate(undefined);
      handleCalendarSheetToggleOff();
      handleDDuDuSheetToggleOff();
    },
  });

  const dduduChangeTimeMutation = useMutation({
    mutationKey: [FEED_KEY.DDUDU_CHANGE_TIME],
    mutationFn: fetchDDuDuChangeTime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEED_KEY.DDUDU_DETAIL] });
      handleRefetchLinkedQueries();
      setCurrentDDuDuTime({ beginAt: null, endAt: null });
      handleDDuDuTimeSheetToggleOff();
    },
  });

  const handleDDuDuSheetOpen = (id: number) => {
    setCurrentDDuDuId(id);
    handleDDuDuSheetToggleOn();
  };

  const handleDDuDuCompleteToggle = (id: number) => {
    completeToggleDDuDuMutation.mutate({ id });
  };

  const handleDeleteDDuDu = (id: number) => {
    deleteDDuDuMutation.mutate({ id });
  };

  const handleSelectDifferentDate = (type: "change" | "repeat", date: string) => {
    setCurrentCalendarType(type);
    setCurrentDate(date);
    handleCalendarSheetToggleOn();
    handleDDuDuSheetToggleOff();
  };

  const handleSelectedDate = (nextDate: Date | undefined) => {
    setSelectedDate(nextDate);
  };

  const handleChangeDDuDuDate = (nextDate: Date) => {
    const date = formatDateToYYYYMMDD(nextDate);

    if (currentCalendarType === "change") {
      dduduChangeDateMutation.mutate({ id: currentDDuDuId, date });
      return;
    }

    dduduRepeatDateMutation.mutate({ id: currentDDuDuId, date });
  };

  const handleRepeatCurrentDate = () => {
    dduduRepeatDateMutation.mutate({
      id: currentDDuDuId,
      date: formatDateToYYYYMMDD(new Date()),
    });
  };

  const handleChangeCurrentDate = () => {
    dduduChangeDateMutation.mutate(
      {
        id: currentDDuDuId,
        date: formatDateToYYYYMMDD(new Date()),
      },
      {
        onSuccess: () => {
          handleRefetchLinkedQueries();
          setSelectedDate(undefined);
          handleCalendarSheetToggleOff();
          handleDDuDuSheetToggleOff();
        },
      },
    );
  };

  const handleDDuDuTimeSetting = (beginAt: string | null = null, endAt: string | null = null) => {
    setCurrentDDuDuTime({ beginAt, endAt });
    handleDDuDuTimeSheetToggleOn();
    handleDDuDuSheetToggleOff();
  };

  const handleChangeDDuDuTime = (selectedTime: DDuDuTimeRangeType) => {
    const { beginHour, beginMin, endHour, endMin, isBeginTimeEnabled, isEndTimeEnabled } =
      selectedTime;

    if (!isBeginTimeEnabled) {
      if (currentDDuDuTime.beginAt === null && currentDDuDuTime.endAt === null) {
        handleDDuDuTimeSheetToggleOff();
        return;
      }

      dduduChangeTimeMutation.mutate({
        time: { beginAt: null, endAt: null },
        id: currentDDuDuId,
      });
      return;
    }

    const beginAt = `${beginHour < 10 ? `0${beginHour}` : beginHour}:${
      beginMin < 10 ? `0${beginMin}` : beginMin
    }:00`;
    const endAt = isEndTimeEnabled
      ? `${endHour < 10 ? `0${endHour}` : endHour}:${endMin < 10 ? `0${endMin}` : endMin}:00`
      : null;

    const isSameAsCurrent =
      currentDDuDuTime.beginAt === beginAt && currentDDuDuTime.endAt === endAt;
    if (isSameAsCurrent) {
      handleDDuDuTimeSheetToggleOff();
      return;
    }

    dduduChangeTimeMutation.mutate({
      time: { beginAt, endAt },
      id: currentDDuDuId,
    });
  };

  const handleAlarmSetting = (hasBeginAt: boolean) => {
    setHasAlarmBeginAt(hasBeginAt);
    handleAlarmSheetToggleOn();
    handleDDuDuSheetToggleOff();
  };

  return {
    currentDDuDuId,
    currentDDuDuTime,
    hasAlarmBeginAt,
    selectedDate,
    currentDate,
    isDDuDuSheetToggle,
    isAlarmSheetToggle,
    isCalendarSheetToggle,
    isDDuDuTimeSheetToggle,
    handleSelectedDate,
    handleDDuDuSheetOpen,
    handleDDuDuCompleteToggle,
    handleDeleteDDuDu,
    handleSelectDifferentDate,
    handleChangeDDuDuDate,
    handleRepeatCurrentDate,
    handleChangeCurrentDate,
    handleAlarmSetting,
    handleDDuDuTimeSetting,
    handleChangeDDuDuTime,
    handleDDuDuSheetToggleOff,
    handleAlarmSheetToggleOff,
    handleCalendarSheetToggleOff,
    handleDDuDuTimeSheetToggleOff,
  };
}

export default useDDuDuSearchActions;
