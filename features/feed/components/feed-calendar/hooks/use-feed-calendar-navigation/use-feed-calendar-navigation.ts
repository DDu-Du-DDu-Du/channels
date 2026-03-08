import { useCallback, useEffect, useMemo, useState } from "react";

interface UseFeedCalendarNavigationProps {
  date: string;
  onSelectDate: (date: string) => void;
  onVisibleMonthChange: (dateString: string) => void;
}

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

  const handleDisplayMonth = useMemo(() => {
    const [year, month] = visibleDate.split("-");
    const resolvedMonth = Number(month);

    return `${year}년 ${resolvedMonth}월`;
  }, [visibleDate]);

  return {
    isOpen,
    visibleDate,
    handleToggleCalendar,
    handleCalendarToggled,
    handleDisplayMonth,
    handleSelectCalendarDate,
  };
}

export default useFeedCalendarNavigation;
