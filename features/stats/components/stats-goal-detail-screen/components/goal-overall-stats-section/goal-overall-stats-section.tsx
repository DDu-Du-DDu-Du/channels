import { View } from "react-native";

import { SpoqaText } from "@/components";

interface GoalOverallStatsSectionProps {
  createdAt: string;
  createdDduduCount: number;
  completionRate: number;
}

function GoalOverallStatsSection({
  createdAt,
  createdDduduCount,
  completionRate,
}: GoalOverallStatsSectionProps) {
  return (
    <View className="mt-[2rem] flex-row justify-between gap-[0.8rem]">
      <View className="flex-1 rounded-radius10 bg-white_100 px-[1rem] py-[1.2rem]">
        <SpoqaText
          weight="semiBold"
          className="text-center text-size16 text-black_500"
        >
          {createdAt}
        </SpoqaText>
        <SpoqaText className="mt-[0.4rem] text-center text-size12 text-example_gray_800">
          개설날짜
        </SpoqaText>
      </View>

      <View className="flex-1 rounded-radius10 bg-white_100 px-[1rem] py-[1.2rem]">
        <SpoqaText
          weight="semiBold"
          className="text-center text-size16 text-black_500"
        >
          {`${createdDduduCount}개`}
        </SpoqaText>
        <SpoqaText className="mt-[0.4rem] text-center text-size12 text-example_gray_800">
          생성된 투두
        </SpoqaText>
      </View>

      <View className="flex-1 rounded-radius10 bg-white_100 px-[1rem] py-[1.2rem]">
        <SpoqaText
          weight="semiBold"
          className="text-center text-size16 text-black_500"
        >
          {`${completionRate}%`}
        </SpoqaText>
        <SpoqaText className="mt-[0.4rem] text-center text-size12 text-example_gray_800">
          투두 완료도
        </SpoqaText>
      </View>
    </View>
  );
}

export default GoalOverallStatsSection;
