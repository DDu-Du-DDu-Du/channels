import { useMemo, useState } from "react";

const YEAR_MONTH_RE = /^\d{4}-\d{2}$/;

const parseYearMonthParam = (yearMonth?: string) => {
  if (!yearMonth || !YEAR_MONTH_RE.test(yearMonth)) {
    return null;
  }

  const [yearString, monthString] = yearMonth.split("-");
  const year = Number(yearString);
  const month = Number(monthString);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }

  return new Date(year, month - 1, 1);
};

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

function useStatsMonth(initialYearMonth?: string) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const parsedInitialMonth = parseYearMonthParam(initialYearMonth);
    if (parsedInitialMonth) {
      return parsedInitialMonth;
    }

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
