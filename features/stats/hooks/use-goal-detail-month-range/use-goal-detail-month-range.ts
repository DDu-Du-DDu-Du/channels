import { useMemo, useState } from "react";

interface YearMonthValue {
  year: number;
  month: number;
}

interface UseGoalDetailMonthRangeParams {
  initialYearMonth?: string;
}

const parseYearMonth = (yearMonth?: string): YearMonthValue => {
  if (yearMonth && /^\d{4}-\d{2}$/.test(yearMonth)) {
    const [yearString, monthString] = yearMonth.split("-");
    const year = Number(yearString);
    const month = Number(monthString);

    if (year >= 1980 && year <= 2099 && month >= 1 && month <= 12) {
      return { year, month };
    }
  }

  // yearMonth query missing/invalid => current month fallback
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
};

const toYearMonthText = ({ year, month }: YearMonthValue) => {
  return `${year}-${String(month).padStart(2, "0")}`;
};

const toYearMonthKey = ({ year, month }: YearMonthValue) => year * 100 + month;

const toYearMonthLabel = ({ year, month }: YearMonthValue) => {
  return `${year}년 ${String(month).padStart(2, "0")}월`;
};

function useGoalDetailMonthRange({ initialYearMonth }: UseGoalDetailMonthRangeParams) {
  const initial = parseYearMonth(initialYearMonth);

  const [isRangeEnabled, setIsRangeEnabled] = useState(false);
  const [singleMonth, setSingleMonth] = useState<YearMonthValue>(initial);
  const [fromMonth, setFromMonth] = useState<YearMonthValue>(initial);
  const [toMonth, setToMonth] = useState<YearMonthValue>(initial);

  const normalizedFrom = useMemo(() => {
    if (!isRangeEnabled) {
      return singleMonth;
    }

    return toYearMonthKey(fromMonth) <= toYearMonthKey(toMonth) ? fromMonth : toMonth;
  }, [fromMonth, isRangeEnabled, singleMonth, toMonth]);

  const normalizedTo = useMemo(() => {
    if (!isRangeEnabled) {
      return singleMonth;
    }

    return toYearMonthKey(fromMonth) <= toYearMonthKey(toMonth) ? toMonth : fromMonth;
  }, [fromMonth, isRangeEnabled, singleMonth, toMonth]);

  const fromMonthText = useMemo(() => toYearMonthText(normalizedFrom), [normalizedFrom]);
  const toMonthText = useMemo(() => toYearMonthText(normalizedTo), [normalizedTo]);

  const inputLabel = useMemo(() => {
    if (!isRangeEnabled) {
      return toYearMonthLabel(singleMonth);
    }

    return `${toYearMonthLabel(normalizedFrom)} ~ ${toYearMonthLabel(normalizedTo)}`;
  }, [isRangeEnabled, normalizedFrom, normalizedTo, singleMonth]);

  const handleChangeSingleMonth = (next: YearMonthValue) => {
    setSingleMonth(next);
    if (!isRangeEnabled) {
      setFromMonth(next);
      setToMonth(next);
    }
  };

  const handleChangeFromMonth = (next: YearMonthValue) => {
    setFromMonth(next);

    if (toYearMonthKey(next) > toYearMonthKey(toMonth)) {
      setToMonth(next);
    }
  };

  const handleChangeToMonth = (next: YearMonthValue) => {
    setToMonth(next);
  };

  const handleToggleRange = (next: boolean) => {
    setIsRangeEnabled(next);

    if (next) {
      setFromMonth(singleMonth);
      setToMonth(singleMonth);
      return;
    }

    // Requirement: keep `from` when turning range off.
    setSingleMonth(normalizedFrom);
  };

  return {
    isRangeEnabled,
    singleMonth,
    fromMonth,
    toMonth,
    fromMonthText,
    toMonthText,
    inputLabel,
    suffixLabel: "통계",
    handleChangeSingleMonth,
    handleChangeFromMonth,
    handleChangeToMonth,
    handleToggleRange,
  };
}

export type { YearMonthValue };
export default useGoalDetailMonthRange;
