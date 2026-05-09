import { useTranslation } from "react-i18next";
import { Platform, View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";
import WheelPicker from "@/components/wheel-picker/wheel-picker";

export interface YearMonthValue {
  year: number;
  month: number;
}

interface YearMonthPickerProps {
  isRangeEnabled: boolean;
  singleValue: YearMonthValue;
  fromValue: YearMonthValue;
  toValue: YearMonthValue;
  toWarningText?: string;
  onChangeSingle: (next: YearMonthValue) => void;
  onChangeFrom: (next: YearMonthValue) => void;
  onChangeTo: (next: YearMonthValue) => void;
  minYear?: number;
  maxYear?: number;
  availableYearMonths?: string[];
}

const toYearIndex = (year: number, minYear: number) => year - minYear;
const toMonthIndex = (month: number) => month - 1;

const getPickerWidth = () => (Platform.OS === "web" ? 76 : 58);

const parseYearMonth = (yearMonth: string): YearMonthValue | null => {
  const [yearString, monthString] = yearMonth.split("-");
  const year = Number(yearString);
  const month = Number(monthString);

  if (!year || !month || month < 1 || month > 12) {
    return null;
  }

  return { year, month };
};

function YearMonthPicker({
  isRangeEnabled,
  singleValue,
  fromValue,
  toValue,
  toWarningText,
  onChangeSingle,
  onChangeFrom,
  onChangeTo,
  minYear = 1980,
  maxYear = 2099,
  availableYearMonths,
}: YearMonthPickerProps) {
  const { t } = useTranslation();
  const availableValues = (availableYearMonths ?? [])
    .map(parseYearMonth)
    .filter((value): value is YearMonthValue => Boolean(value));
  const hasAvailableYearMonths = availableValues.length > 0;

  const years = hasAvailableYearMonths
    ? Array.from(new Set(availableValues.map((value) => value.year))).sort((a, b) => a - b)
    : Array.from({ length: maxYear - minYear + 1 }, (_, index) => minYear + index);

  const getMonths = (year: number) => {
    if (!hasAvailableYearMonths) {
      return Array.from({ length: 12 }, (_, index) => index + 1);
    }

    return availableValues
      .filter((value) => value.year === year)
      .map((value) => value.month)
      .sort((a, b) => a - b);
  };

  const getNextValueForYear = (value: YearMonthValue, year: number) => {
    const months = getMonths(year);

    return {
      year,
      month: months.includes(value.month) ? value.month : (months[0] ?? 1),
    };
  };

  const getYearIndex = (year: number) => {
    if (!hasAvailableYearMonths) {
      return toYearIndex(year, minYear);
    }

    return Math.max(0, years.indexOf(year));
  };

  const getMonthIndex = (year: number, month: number) => {
    const months = getMonths(year);
    const index = months.indexOf(month);

    return index >= 0 ? index : 0;
  };

  const handleChangeYear = (type: "single" | "from" | "to", index: number) => {
    const year = years[index] ?? minYear;

    if (type === "single") {
      onChangeSingle(getNextValueForYear(singleValue, year));
      return;
    }

    if (type === "from") {
      onChangeFrom(getNextValueForYear(fromValue, year));
      return;
    }

    onChangeTo(getNextValueForYear(toValue, year));
  };

  const handleChangeMonth = (type: "single" | "from" | "to", index: number) => {
    const value = type === "single" ? singleValue : type === "from" ? fromValue : toValue;
    const months = getMonths(value.year);
    const month = months[index] ?? months[0] ?? 1;

    if (type === "single") {
      onChangeSingle({ ...singleValue, month });
      return;
    }

    if (type === "from") {
      onChangeFrom({ ...fromValue, month });
      return;
    }

    onChangeTo({ ...toValue, month });
  };

  const renderPickerLine = (label: string | null, type: "single" | "from" | "to") => {
    const value = type === "single" ? singleValue : type === "from" ? fromValue : toValue;
    const months = getMonths(value.year);

    return (
      <View className="w-full">
        {label ? (
          <SpoqaText
            weight="semiBold"
            className="mb-[0.8rem] text-size13 text-role-text-primary dark:text-role-dark-text-primary"
          >
            {label}
          </SpoqaText>
        ) : null}
        <View className="flex-row items-center justify-center gap-[0.8rem]">
          <View className="items-center rounded-radius10 bg-role-surface-panel dark:bg-role-dark-surface-panel px-[0.6rem] py-[0.4rem]">
            <WheelPicker
              data={years}
              value={getYearIndex(value.year)}
              onChange={(index) => handleChangeYear(type, index)}
              itemHeight={40}
              width={getPickerWidth()}
            />
          </View>
          <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
            {t("calendar.year")}
          </SpoqaText>
          <View className="items-center rounded-radius10 bg-role-surface-panel dark:bg-role-dark-surface-panel px-[0.6rem] py-[0.4rem]">
            <WheelPicker
              data={months}
              value={
                hasAvailableYearMonths
                  ? getMonthIndex(value.year, value.month)
                  : toMonthIndex(value.month)
              }
              onChange={(index) => handleChangeMonth(type, index)}
              itemHeight={40}
              width={getPickerWidth()}
            />
          </View>
          <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
            {t("calendar.month")}
          </SpoqaText>
        </View>
        {type === "to" && toWarningText ? (
          <SpoqaText className="mt-[0.6rem] text-size12 text-role-status-error dark:text-role-dark-status-error">
            {toWarningText}
          </SpoqaText>
        ) : null}
      </View>
    );
  };

  return (
    <View className="w-full gap-[1.8rem]">
      {isRangeEnabled ? (
        <>
          {renderPickerLine("from", "from")}
          {renderPickerLine("to", "to")}
        </>
      ) : (
        renderPickerLine(null, "single")
      )}
    </View>
  );
}

export type { YearMonthPickerProps };
export default YearMonthPicker;
