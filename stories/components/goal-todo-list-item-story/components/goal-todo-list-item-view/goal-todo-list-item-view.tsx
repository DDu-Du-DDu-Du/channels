import { View } from "react-native";

import { GoalTodoListItem } from "@/components";

import { Href } from "expo-router";

export interface GoalTodoListItemViewProps {
  title?: string;
  repeatDays?: string;
  startDate?: string;
  endDate?: string;
  linkTo?: Href;
  bgColor?: string;
}

function GoalTodoListItemView({
  title = "목표 제목",
  repeatDays = "월 수 금",
  startDate = "2024-05-10",
  endDate = "2024-05-13",
  linkTo = "/",
  bgColor,
}: GoalTodoListItemViewProps) {
  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <GoalTodoListItem
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

export default GoalTodoListItemView;
