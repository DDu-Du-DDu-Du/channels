import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";
import YearMonthPicker, { YearMonthValue } from "@/components/year-month-picker/year-month-picker";
import { useThemeColorToken } from "@/hooks/use-theme-color";

export interface YearMonthPopoverProps {
  value: YearMonthValue;
  onConfirm: (next: YearMonthValue) => void;
  minYear?: number;
  maxYear?: number;
  availableYearMonths?: string[];
  confirmLabel?: string;
  backgroundColor?: string;
}

const DEFAULT_MIN_YEAR = 1980;
const DEFAULT_MAX_YEAR = 2099;

const clampYear = (year: number, minYear: number, maxYear: number) =>
  Math.max(minYear, Math.min(maxYear, year));

const clampMonth = (month: number) => Math.max(1, Math.min(12, month));

const parseYearMonth = (yearMonth: string): YearMonthValue | null => {
  const [yearString, monthString] = yearMonth.split("-");
  const year = Number(yearString);
  const month = Number(monthString);

  if (!year || !month || month < 1 || month > 12) {
    return null;
  }

  return { year, month };
};

const normalizeValue = (
  value: YearMonthValue,
  minYear: number,
  maxYear: number,
  availableYearMonths?: string[],
) => {
  const availableValues = (availableYearMonths ?? [])
    .map(parseYearMonth)
    .filter((item): item is YearMonthValue => Boolean(item));

  if (!availableValues.length) {
    return {
      year: clampYear(value.year, minYear, maxYear),
      month: clampMonth(value.month),
    };
  }

  const exact = availableValues.find(
    (item) => item.year === value.year && item.month === value.month,
  );

  if (exact) {
    return exact;
  }

  return [...availableValues].sort((a, b) => a.year * 100 + a.month - (b.year * 100 + b.month))[0];
};

function YearMonthPopover({
  value,
  onConfirm,
  minYear = DEFAULT_MIN_YEAR,
  maxYear = DEFAULT_MAX_YEAR,
  availableYearMonths,
  confirmLabel = "확인",
  backgroundColor,
}: YearMonthPopoverProps) {
  const defaultBackgroundColor = useThemeColorToken("role.surface.panel");
  const { year: valueYear, month: valueMonth } = value;

  const [pending, setPending] = useState<YearMonthValue>(() =>
    normalizeValue(value, minYear, maxYear, availableYearMonths),
  );

  useEffect(() => {
    setPending(
      normalizeValue({ year: valueYear, month: valueMonth }, minYear, maxYear, availableYearMonths),
    );
  }, [valueYear, valueMonth, minYear, maxYear, availableYearMonths]);

  const handleConfirm = () => {
    onConfirm(pending);
  };

  return (
    <View
      className="w-full max-w-[34rem] rounded-radius10 p-[1.2rem]"
      style={{ backgroundColor: backgroundColor ?? defaultBackgroundColor }}
    >
      <View className="mb-[5rem] mt-[2.8rem]">
        <YearMonthPicker
          isRangeEnabled={false}
          singleValue={pending}
          fromValue={pending}
          toValue={pending}
          onChangeSingle={setPending}
          onChangeFrom={setPending}
          onChangeTo={setPending}
          minYear={minYear}
          maxYear={maxYear}
          availableYearMonths={availableYearMonths}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handleConfirm}
        className="h-[5rem] w-[12rem] self-center items-center justify-center rounded-radius15 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg"
      >
        <SpoqaText
          weight="semiBold"
          className="text-size15 text-role-text-inverse dark:text-role-dark-text-inverse"
        >
          {confirmLabel}
        </SpoqaText>
      </Pressable>
    </View>
  );
}

export default YearMonthPopover;
