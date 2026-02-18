import { useMemo, useState } from "react";

import type { PeriodType } from "@/components/period-goal-memo/period-goal-memo";
import { formatDateToYYYYMMDD } from "@/utils";

import type { MainFeedView } from "../../main-feed";

interface UseFeedDateTypeProps {
  view: MainFeedView;
  onSelectDate?: (date: string) => void;
}

interface UseFeedDateTypeResult {
  type: PeriodType;
  isMonth: boolean;
  isWeek: boolean;
  selectedDate: string;
  dateKey: string;
  handleSelectDate: (date: string) => void;
}

const useFeedDateType = ({ view, onSelectDate }: UseFeedDateTypeProps): UseFeedDateTypeResult => {
  const type: PeriodType = view === "list" ? "MONTH" : "WEEK";
  const today = useMemo(() => formatDateToYYYYMMDD(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const yearMonth = useMemo(() => selectedDate.slice(0, 7), [selectedDate]);
  const weekTuesday = useMemo(() => {
    if (type !== "WEEK") {
      return selectedDate;
    }

    const date = new Date(selectedDate);
    if (Number.isNaN(date.getTime())) {
      return selectedDate;
    }

    const dayOfWeek = date.getDay(); // 0 (Sun) - 6 (Sat)
    const mondayIndex = (dayOfWeek + 6) % 7; // Monday = 0, Sunday = 6
    const diff = 1 - mondayIndex; // Tuesday (1) of the Monday-based week
    date.setDate(date.getDate() + diff);

    return formatDateToYYYYMMDD(date);
  }, [selectedDate, type]);
  const dateKey = useMemo(
    () => (type === "MONTH" ? yearMonth : weekTuesday),
    [type, yearMonth, weekTuesday],
  );

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    onSelectDate?.(date);
  };

  return {
    type,
    isMonth: type === "MONTH",
    isWeek: type === "WEEK",
    selectedDate,
    dateKey,
    handleSelectDate,
  };
};

export default useFeedDateType;
