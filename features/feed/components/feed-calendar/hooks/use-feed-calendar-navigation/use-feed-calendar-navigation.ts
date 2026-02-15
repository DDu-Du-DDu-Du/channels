import { useCallback, useEffect, useMemo, useState } from "react";

interface UseFeedCalendarNavigationProps {
  date: string;
  onSelectDate: (date: string) => void;
  onVisibleMonthChange: (dateString: string) => void;
}

const convertDateToISO = (nextDate: Date) => {
  const year = nextDate.getUTCFullYear();
  const month = String(nextDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(nextDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addDays = (targetDate: string, amount: number) => {
  const nextDate = new Date(`${targetDate}T00:00:00.000Z`);
  nextDate.setUTCDate(nextDate.getUTCDate() + amount);
  return convertDateToISO(nextDate);
};

const addMonths = (targetDate: string, amount: number) => {
  const nextDate = new Date(`${targetDate}T00:00:00.000Z`);
  nextDate.setUTCMonth(nextDate.getUTCMonth() + amount);
  return convertDateToISO(nextDate);
};

function useFeedCalendarNavigation({
  date,
  onSelectDate,
  onVisibleMonthChange,
}: UseFeedCalendarNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleDate, setVisibleDate] = useState(date);

  useEffect(() => {
    setVisibleDate(date);
  }, [date]);

  const handleToggleCalendar = useCallback(() => {
    setIsOpen((previousIsOpen) => !previousIsOpen);
  }, []);

  const handleCalendarToggled = useCallback((nextIsOpen: boolean) => {
    setIsOpen(nextIsOpen);
  }, []);

  const handleSelectCalendarDate = useCallback(
    (nextSelectedDate: string) => {
      onSelectDate(nextSelectedDate);
      setVisibleDate(nextSelectedDate);
      onVisibleMonthChange(nextSelectedDate);
    },
    [onSelectDate, onVisibleMonthChange],
  );

  const handleMovePeriod = useCallback(
    (direction: "prev" | "next") => {
      const delta = direction === "prev" ? -1 : 1;
      const nextVisibleDate = isOpen
        ? addMonths(visibleDate, delta)
        : addDays(visibleDate, delta * 7);

      handleSelectCalendarDate(nextVisibleDate);
    },
    [handleSelectCalendarDate, isOpen, visibleDate],
  );

  const handleDisplayMonth = useMemo(() => {
    const [year, month] = visibleDate.split("-");
    return `${year}년 ${month}월`;
  }, [visibleDate]);

  return {
    isOpen,
    visibleDate,
    handleToggleCalendar,
    handleCalendarToggled,
    handleMovePeriod,
    handleDisplayMonth,
    handleSelectCalendarDate,
  };
}

export default useFeedCalendarNavigation;
