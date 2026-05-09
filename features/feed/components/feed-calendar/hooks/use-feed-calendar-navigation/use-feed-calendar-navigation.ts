import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();
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

  const handleChangeVisibleDate = useCallback(
    (nextVisibleDate: string) => {
      setVisibleDate(nextVisibleDate);
      onVisibleMonthChange(nextVisibleDate);
    },
    [onVisibleMonthChange],
  );

  const handleDisplayMonth = useMemo(() => {
    const [year, month] = visibleDate.split("-");
    const resolvedMonth = Number(month);

    return t("calendar.yearMonth", {
      year,
      month:
        i18n.language === "en" ? t(`calendar.months.long.${resolvedMonth - 1}`) : resolvedMonth,
    });
  }, [i18n.language, t, visibleDate]);

  return {
    isOpen,
    visibleDate,
    handleToggleCalendar,
    handleCalendarToggled,
    handleDisplayMonth,
    handleSelectCalendarDate,
    handleChangeVisibleDate,
  };
}

export default useFeedCalendarNavigation;
