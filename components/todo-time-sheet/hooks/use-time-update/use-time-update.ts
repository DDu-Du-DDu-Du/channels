import { useEffect, useState } from "react";

import { TodoTimeType } from "@/features/feed/feed.types";

interface UseTimeUpdateProps {
  currentTodoTime: TodoTimeType;
}

const useTimeUpdate = ({ currentTodoTime }: UseTimeUpdateProps) => {
  const { beginAt, endAt } = currentTodoTime;

  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [beginHour, setBeginHour] = useState(0);
  const [beginMin, setBeginMin] = useState(0);
  const [endHour, setEndHour] = useState(0);
  const [endMin, setEndMin] = useState(0);

  useEffect(() => {
    if (!beginAt) {
      setBeginHour(0);
      setBeginMin(0);
      setEndHour(0);
      setEndMin(0);
      return;
    }

    const [beginHour, beginMin] = beginAt.split(":").map(Number);
    setBeginHour(beginHour);
    setBeginMin(beginMin);

    if (!endAt) {
      setEndHour(beginHour);
      setEndMin(beginMin);
      return;
    }

    const [endHour, endMin] = endAt.split(":").map(Number);
    setEndHour(endHour);
    setEndMin(endMin);
  }, [beginAt, endAt]);

  const handleTodoTimeChange = () => {
    const beginTime = beginHour * 60 + beginMin;
    const endTime = endHour * 60 + endMin;

    if (beginTime > endTime) {
      setIsErrorMessage(true);
      return false;
    }

    setIsErrorMessage(false);
    return true;
  };

  const handleClearErrorMessage = () => {
    setIsErrorMessage(false);
  };

  const handleChangeBeginHour = (beginHours: number) => {
    setBeginHour(beginHours);
  };
  const handleChangeBeginMin = (beginMinutes: number) => {
    setBeginMin(beginMinutes);
  };
  const handleChangeEndHour = (endHours: number) => {
    setEndHour(endHours);
  };
  const handleChangeEndMin = (endMinutes: number) => {
    setEndMin(endMinutes);
  };

  return {
    beginHour,
    beginMin,
    endHour,
    endMin,
    isErrorMessage,
    handleTodoTimeChange,
    handleChangeBeginHour,
    handleChangeBeginMin,
    handleChangeEndHour,
    handleChangeEndMin,
    handleClearErrorMessage,
  };
};

export default useTimeUpdate;
