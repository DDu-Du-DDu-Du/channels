import { Pressable, View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { formatDateRange } from "@/utils";

import { Href, useRouter } from "expo-router";

export interface GoalTodoListItemProps {
  title: string;
  repeatDays: string;
  startDate: string;
  endDate: string;
  linkTo: Href;
  bgColor?: string;
}

function GoalTodoListItem({
  title,
  repeatDays,
  startDate,
  endDate,
  linkTo,
  bgColor = "#F5F5F5",
}: GoalTodoListItemProps) {
  const router = useRouter();

  const handlePress = () => {
    if (!linkTo) {
      return;
    }

    router.push(linkTo);
  };

  return (
    <View className="w-full">
      <Pressable
        className="rounded-radius10 px-[1.8rem] py-[1.2rem] gap-[0.5rem]"
        style={{ backgroundColor: bgColor }}
        onPress={handlePress}
      >
        <SpoqaText className="text-size13 leading-[1.3rem]">{title}</SpoqaText>
        <View className="flex-row">
          <SpoqaText className="mr-[0.5rem] text-size11 font-light text-role-text-secondary dark:text-role-dark-text-secondary">
            {repeatDays}
          </SpoqaText>
          <SpoqaText className="text-size11 font-light text-role-text-secondary dark:text-role-dark-text-secondary">
            {formatDateRange(startDate, endDate)}
          </SpoqaText>
        </View>
      </Pressable>
    </View>
  );
}

export default GoalTodoListItem;
