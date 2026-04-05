import { useCallback, useState } from "react";

import { normalizeDayOfWeekToEn } from "@/constants";
import type { RepeatTodoRequestType } from "@/types/request/repeat-todo/repeat-todo";
import type { DayOfWeek } from "@/types/response/repeat-todo/repeat-todo";

function getToday() {
  return new Date();
}

function useRepeatTodoForm() {
  const [repeatType, setRepeatType] = useState<RepeatTodoRequestType["repeatType"]>("DAILY");
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
    (repeatTodo?: RepeatTodoRequestType) => {
      if (!repeatTodo) {
        handleResetForm();
        return;
      }

      setRepeatType(repeatTodo.repeatType);
      setStartDate(new Date(repeatTodo.startDate));
      setEndDate(new Date(repeatTodo.endDate));
      setBeginAt(repeatTodo.beginAt);
      setEndAt(repeatTodo.endAt);
      setSelectedWeekDays((repeatTodo.repeatDaysOfWeek ?? []).map(normalizeDayOfWeekToEn));
      setSelectedMonthDays((repeatTodo.repeatDaysOfMonth as number[] | undefined) ?? []);
      setIsLastDaySelected(Boolean(repeatTodo.lastDayOfMonth));
    },
    [handleResetForm],
  );

  return {
    repeatType,
    startDate,
    endDate,
    beginAt,
    endAt,
    selectedWeekDays,
    selectedMonthDays,
    isLastDaySelected,
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

export default useRepeatTodoForm;
