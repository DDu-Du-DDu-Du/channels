import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { ArrowLeftIcon } from "@/icons";

import { useLocalSearchParams, useRouter } from "expo-router";

const toSingleParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

function StatsGoalDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[]; yearMonth?: string | string[] }>();
  const goalId = toSingleParam(params.id) ?? "";
  const yearMonth = toSingleParam(params.yearMonth) ?? "";

  const handlePressBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 px-[2.4rem] pt-[2.4rem]">
      <View className="relative items-center justify-center">
        <Pressable
          onPress={handlePressBack}
          className="absolute left-0 top-0 size-[2.4rem] items-start justify-center"
          hitSlop={8}
        >
          <ArrowLeftIcon
            size={16}
            stroke="#FFFFFF"
          />
        </Pressable>
        <SpoqaText
          weight="bold"
          className="text-size15 text-white_100"
        >
          목표 상세통계
        </SpoqaText>
      </View>

      <View className="mt-[2.4rem] rounded-radius15 bg-white_100 px-[1.6rem] py-[2rem]">
        <SpoqaText
          weight="semiBold"
          className="text-size15 text-black_500"
        >
          상세 통계 더미 페이지
        </SpoqaText>
        <SpoqaText className="mt-[1.2rem] text-size14 text-example_gray_800">{`goalId: ${goalId}`}</SpoqaText>
        <SpoqaText className="mt-[0.8rem] text-size14 text-example_gray_800">{`yearMonth: ${yearMonth}`}</SpoqaText>
      </View>
    </View>
  );
}

export default StatsGoalDetailScreen;
