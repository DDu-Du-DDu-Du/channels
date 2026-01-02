import { Controller } from "react-hook-form";
import { View } from "react-native";

import { PeriodGoalMemo, SpoqaText } from "@/components";
import { PeriodType } from "@/components/period-goal-memo/period-goal-memo";
import { MonthlyGoalMemoType } from "@/types/response/feed/feed";

import usePeriodGoalMemoForm from "../../hooks/use-period-goal-memo-form/use-period-goal-memo-form";

export interface FeedCalendarHeaderProps {
  date: string;
  type: PeriodType;
  minHeight?: number | string;
  periodGoalMemo?: MonthlyGoalMemoType;
}

function FeedCalendarHeader({
  date,
  type = "MONTH",
  minHeight = "60px",
  periodGoalMemo,
}: FeedCalendarHeaderProps) {
  const { methods, onValid } = usePeriodGoalMemoForm({
    date,
    type,
    periodGoalMemo,
  });

  return (
    <View className="px-4 py-2 w-full z-header">
      <View className="flex-row items-center justify-between w-full mb-3">
        <SpoqaText
          weight="medium"
          className="text-size13"
        >
          이번 {type === "WEEK" ? "주" : "달"} 목표를 메모해보세요
        </SpoqaText>
      </View>
      <Controller
        control={methods.control}
        name="contents"
        defaultValue={periodGoalMemo?.contents}
        render={({ field: { value, onChange } }) => (
          <PeriodGoalMemo
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
