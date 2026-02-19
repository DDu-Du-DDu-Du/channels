import { useMemo, useState } from "react";

const formatYearMonthParam = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

const formatYearMonthLabel = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return `${year}년 ${month}월`;
};

function useStatsMonth() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const yearMonth = useMemo(() => formatYearMonthParam(selectedMonth), [selectedMonth]);
  const yearMonthLabel = useMemo(() => formatYearMonthLabel(selectedMonth), [selectedMonth]);

  const handleChangeMonth = (offset: number) => {
    setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const handlePrevMonth = () => {
    handleChangeMonth(-1);
  };

  const handleNextMonth = () => {
    handleChangeMonth(1);
  };

  return {
    yearMonth,
    yearMonthLabel,
    handlePrevMonth,
    handleNextMonth,
  };
}

export default useStatsMonth;
