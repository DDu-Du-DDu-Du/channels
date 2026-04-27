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
  confirmLabel?: string;
  backgroundColor?: string;
}

const DEFAULT_MIN_YEAR = 1980;
const DEFAULT_MAX_YEAR = 2099;

const clampYear = (year: number, minYear: number, maxYear: number) =>
  Math.max(minYear, Math.min(maxYear, year));

const clampMonth = (month: number) => Math.max(1, Math.min(12, month));

function YearMonthPopover({
  value,
  onConfirm,
  minYear = DEFAULT_MIN_YEAR,
  maxYear = DEFAULT_MAX_YEAR,
  confirmLabel = "확인",
  backgroundColor,
}: YearMonthPopoverProps) {
  const defaultBackgroundColor = useThemeColorToken("role.surface.panel");

  const [pending, setPending] = useState<YearMonthValue>(() => ({
    year: clampYear(value.year, minYear, maxYear),
    month: clampMonth(value.month),
  }));

  useEffect(() => {
    setPending({
      year: clampYear(value.year, minYear, maxYear),
      month: clampMonth(value.month),
    });
  }, [value.year, value.month, minYear, maxYear]);

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
