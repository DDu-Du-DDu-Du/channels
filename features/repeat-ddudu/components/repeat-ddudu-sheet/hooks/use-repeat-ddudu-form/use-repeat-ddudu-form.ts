import { useCallback, useState } from "react";

import type { RepeatDduduRequestType } from "@/types/request/repeat-ddudu/repeat-ddudu";
import type { DayOfWeek } from "@/types/response/repeat-ddudu/repeat-ddudu";

function getToday() {
  return new Date();
}

function useRepeatDduduForm() {
  const [title, setTitle] = useState("");
  const [repeatType, setRepeatType] = useState<RepeatDduduRequestType["repeatType"]>("DAILY");
  const [startDate, setStartDate] = useState<Date>(getToday());
  const [endDate, setEndDate] = useState<Date>(getToday());
  const [beginAt, setBeginAt] = useState<string | undefined>();
  const [endAt, setEndAt] = useState<string | undefined>();
  const [selectedWeekDays, setSelectedWeekDays] = useState<DayOfWeek[]>([]);
  const [selectedMonthDays, setSelectedMonthDays] = useState<number[]>([]);
  const [isLastDaySelected, setIsLastDaySelected] = useState(false);

  const handleToggleWeekDay = (day: DayOfWeek) => {
    setSelectedWeekDays((prev) =>
      prev.includes(day) ? prev.filter((selectedDay) => selectedDay !== day) : [...prev, day],
    );
  };

  const handleToggleMonthDay = (day: number) => {
    setSelectedMonthDays((prev) =>
      prev.includes(day) ? prev.filter((selectedDay) => selectedDay !== day) : [...prev, day],
    );
  };

  const handleToggleLastDay = () => {
    setIsLastDaySelected((prev) => !prev);
  };

  const handleResetForm = useCallback(() => {
    setTitle("");
    setRepeatType("DAILY");
    setStartDate(getToday());
    setEndDate(getToday());
    setBeginAt(undefined);
    setEndAt(undefined);
    setSelectedWeekDays([]);
    setSelectedMonthDays([]);
    setIsLastDaySelected(false);
  }, []);

  const handleFillForm = useCallback(
    (repeatDdudu?: RepeatDduduRequestType) => {
      if (!repeatDdudu) {
        handleResetForm();
        return;
      }

      setTitle(repeatDdudu.name);
      setRepeatType(repeatDdudu.repeatType);
      setStartDate(new Date(repeatDdudu.startDate));
      setEndDate(new Date(repeatDdudu.endDate));
      setBeginAt(repeatDdudu.beginAt);
      setEndAt(repeatDdudu.endAt);
      setSelectedWeekDays(repeatDdudu.repeatDaysOfWeek ?? []);
      setSelectedMonthDays((repeatDdudu.repeatDaysOfMonth as number[] | undefined) ?? []);
      setIsLastDaySelected(Boolean(repeatDdudu.lastDayOfMonth));
    },
    [handleResetForm],
  );

  return {
    title,
    repeatType,
    startDate,
    endDate,
    beginAt,
    endAt,
    selectedWeekDays,
    selectedMonthDays,
    isLastDaySelected,
    setTitle,
    setRepeatType,
    setStartDate,
    setEndDate,
    setBeginAt,
    setEndAt,
    handleToggleWeekDay,
    handleToggleMonthDay,
    handleToggleLastDay,
    handleResetForm,
    handleFillForm,
  };
}

export default useRepeatDduduForm;
