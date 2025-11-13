import { Controller } from "react-hook-form";
import { View } from "react-native";

import { PeriodGoalMemo, SpoqaText } from "@/components";
import { MonthlyGoalMemoType } from "@/types/response/feed/feed";

import usePeriodGoalMemoForm from "../../hooks/use-period-goal-memo-form/use-period-goal-memo-form";

export interface FeedCalendarHeaderProps {
  yearMonth: string;
  type: "week" | "month";
  minHeight?: number | string;
  periodGoalMemo?: MonthlyGoalMemoType;
}

function FeedCalendarHeader({
  yearMonth,
  type = "month",
  minHeight = 60,
  periodGoalMemo,
}: FeedCalendarHeaderProps) {
  const { methods, onValid } = usePeriodGoalMemoForm({
    yearMonth,
    periodGoalMemo,
  });

  return (
    <View className="px-4 py-2 w-full z-header">
      <View className="flex-row items-center justify-between w-full mb-3">
        <SpoqaText
          weight="medium"
          className="text-size13"
        >
          이번 {type === "week" ? "주" : "달"} 목표를 메모해보세요
        </SpoqaText>
      </View>
      <Controller
        control={methods.control}
        name="contents"
        defaultValue={periodGoalMemo?.contents}
        render={({ field: { value, onChange } }) => (
          <PeriodGoalMemo
            type={type}
            value={value}
            onChange={onChange}
            onBlur={methods.handleSubmit(onValid)}
            minHeight={minHeight}
          />
        )}
      />
    </View>
  );
}

export default FeedCalendarHeader;
