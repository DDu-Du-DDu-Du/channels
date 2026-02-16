import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import type { RepeatDduduRequestType } from "@/types/request/repeat-ddudu/repeat-ddudu";
import type { DayOfWeek } from "@/types/response/repeat-ddudu/repeat-ddudu";

export interface RepeatDduduCardsProps {
  repeatDdudus: RepeatDduduRequestType[];
  onPressRepeatDdudu?: (index: number) => void;
}

const REPEAT_TYPE_LABEL: Record<RepeatDduduRequestType["repeatType"], string> = {
  DAILY: "매일",
  WEEKLY: "매주",
  MONTHLY: "매월",
};

const WEEK_DAY_LABEL: Record<DayOfWeek, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

function formatMonthlyDays(repeatDdudu: RepeatDduduRequestType) {
  const days = [...(repeatDdudu.repeatDaysOfMonth ?? [])]
    .sort((a, b) => Number(a) - Number(b))
    .map((day) => String(day));

  if (repeatDdudu.lastDayOfMonth) {
    days.push("마지막날");
  }

  if (days.length > 10) {
    return `${days.slice(0, 10).join(" ")} ...`;
  }

  return days.join(" ");
}

function buildDescription(repeatDdudu: RepeatDduduRequestType) {
  const parts: string[] = [REPEAT_TYPE_LABEL[repeatDdudu.repeatType]];

  if (repeatDdudu.repeatType === "WEEKLY" && repeatDdudu.repeatDaysOfWeek?.length) {
    parts.push(repeatDdudu.repeatDaysOfWeek.map((day) => WEEK_DAY_LABEL[day]).join(" "));
  }

  if (repeatDdudu.repeatType === "MONTHLY") {
    const monthlyDays = formatMonthlyDays(repeatDdudu);

    if (monthlyDays) {
      parts.push(monthlyDays);
    }
  }

  parts.push(`${formatDate(repeatDdudu.startDate)} ~ ${formatDate(repeatDdudu.endDate)}`);

  return parts.join(" | ");
}

function RepeatDduduCards({ repeatDdudus, onPressRepeatDdudu }: RepeatDduduCardsProps) {
  if (!repeatDdudus.length) {
    return null;
  }

  return (
    <View className="gap-[0.8rem]">
      {repeatDdudus.map((repeatDdudu, index) => (
        <Pressable
          key={`${repeatDdudu.name}-${repeatDdudu.startDate}-${index}`}
          onPress={() => onPressRepeatDdudu?.(index)}
          className="rounded-radius15 bg-white_100 px-[1.2rem] py-[1rem]"
        >
          <SpoqaText
            weight="medium"
            className="text-size14 text-black"
          >
            {repeatDdudu.name}
          </SpoqaText>
          <SpoqaText className="mt-[0.4rem] text-size12 text-example_gray_900">
            {buildDescription(repeatDdudu)}
          </SpoqaText>
        </Pressable>
      ))}
    </View>
  );
}

export default RepeatDduduCards;
