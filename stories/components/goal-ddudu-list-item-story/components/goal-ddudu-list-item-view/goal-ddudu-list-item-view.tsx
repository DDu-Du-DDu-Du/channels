import { View } from "react-native";

import { GoalDDuDuListItem } from "@/components";

export interface GoalDDuDuListItemViewProps {
  title?: string;
  repeatDays?: string;
  startDate?: string;
  endDate?: string;
  linkTo?: string;
  bgColor?: string;
}

function GoalDDuDuListItemView({
  title = "목표 제목",
  repeatDays = "월 수 금",
  startDate = "2024-05-10",
  endDate = "2024-05-13",
  linkTo = "/",
  bgColor,
}: GoalDDuDuListItemViewProps) {
  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <GoalDDuDuListItem
        title={title}
        repeatDays={repeatDays}
        startDate={startDate}
        endDate={endDate}
        linkTo={linkTo}
        bgColor={bgColor}
      />
    </View>
  );
}

export default GoalDDuDuListItemView;
