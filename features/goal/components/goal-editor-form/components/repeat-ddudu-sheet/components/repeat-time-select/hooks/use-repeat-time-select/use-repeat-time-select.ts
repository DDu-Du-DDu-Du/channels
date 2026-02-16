import { useMemo, useState } from "react";

import { DDuDuTimeRangeType, DDuDuTimeType } from "@/features/feed/feed.types";

interface UseRepeatTimeSelectProps {
  beginAt?: string;
  endAt?: string;
  onChangeBeginAt: (value: string | undefined) => void;
  onChangeEndAt: (value: string | undefined) => void;
}

function formatTimeWithSecond(time: string) {
  if (time.length === 8) {
    return time;
  }

  if (time.length === 5) {
    return `${time}:00`;
  }

  return time;
}

function normalizeHHmm(value?: string) {
  if (!value) {
    return "00:00";
  }

  return value.slice(0, 5);
}

function useRepeatTimeSelect({
  beginAt,
  endAt,
  onChangeBeginAt,
  onChangeEndAt,
}: UseRepeatTimeSelectProps) {
  const [isTimeSheetOpen, setIsTimeSheetOpen] = useState(false);

  const currentDDuDuTime: DDuDuTimeType = useMemo(
    () => ({
      beginAt: normalizeHHmm(beginAt),
      endAt: normalizeHHmm(endAt),
    }),
    [beginAt, endAt],
  );

  const handleOpenTimeSheet = () => {
    setIsTimeSheetOpen(true);
  };

  const handleCloseTimeSheet = () => {
    setIsTimeSheetOpen(false);
  };

  const handleChangeDDuDuTime = (
    selectedTime: DDuDuTimeRangeType,
    isBeginTimeEnabled: boolean,
    isEndTimeEnabled: boolean,
  ) => {
    const beginHHmm = `${String(selectedTime.beginHour).padStart(2, "0")}:${String(selectedTime.beginMin).padStart(2, "0")}`;
    const endHHmm = `${String(selectedTime.endHour).padStart(2, "0")}:${String(selectedTime.endMin).padStart(2, "0")}`;

    if (!isBeginTimeEnabled) {
      onChangeBeginAt(undefined);
      onChangeEndAt(undefined);
      setIsTimeSheetOpen(false);
      return;
    }

    onChangeBeginAt(formatTimeWithSecond(beginHHmm));
    if (isEndTimeEnabled) {
      onChangeEndAt(formatTimeWithSecond(endHHmm));
    } else {
      onChangeEndAt(undefined);
    }
    setIsTimeSheetOpen(false);
  };

  return {
    isTimeSheetOpen,
    currentDDuDuTime,
    handleOpenTimeSheet,
    handleCloseTimeSheet,
    handleChangeDDuDuTime,
  };
}

export default useRepeatTimeSelect;
