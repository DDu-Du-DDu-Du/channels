import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { formatDateRange } from "@/utils";

import { useRouter } from "expo-router";

export interface GoalDDuDuListItemProps {
  title: string;
  repeatDays: string;
  startDate: string;
  endDate: string;
  linkTo: string;
  bgColor?: string;
}

function GoalDDuDuListItem({
  title,
  repeatDays,
  startDate,
  endDate,
  linkTo,
  bgColor = "#F5F5F5",
}: GoalDDuDuListItemProps) {
  const router = useRouter();

  const handlePress = () => {
    if (!linkTo) {
      return;
    }

    router.push(linkTo as any);
  };

  return (
    <View className="w-full">
      <Pressable
        className="rounded-radius10 px-[1.8rem] py-[1.2rem]"
        style={{ backgroundColor: bgColor }}
        onPress={handlePress}
      >
        <SpoqaText className="block text-size13 leading-[1.3rem]">{title}</SpoqaText>
        <SpoqaText className="mr-[0.5rem] text-size11 font-light text-example_gray_900">
          {repeatDays}
        </SpoqaText>
        <SpoqaText className="text-size11 font-light text-example_gray_900">
          {formatDateRange(startDate, endDate)}
        </SpoqaText>
      </Pressable>
    </View>
  );
}

export default GoalDDuDuListItem;
