import { View } from "react-native";

import { SpoqaText } from "@/components";

interface MiniMetricCardProps {
  title: string;
  value: string;
  className?: string;
}

function MiniMetricCard({ title, value, className }: MiniMetricCardProps) {
  return (
    <View
      className={`w-[49%] rounded-radius10 bg-sub_1 px-[0.8rem] py-[0.8rem] ${className ?? ""}`}
    >
      <View className="items-center rounded-circle bg-example_gray_100 px-[0.7rem] py-[0.3rem]">
        <SpoqaText className="text-size11 text-black_500">{title}</SpoqaText>
      </View>
      <SpoqaText
        weight="bold"
        className="mt-[0.2rem] text-center text-size17 text-black_500"
        numberOfLines={1}
      >
        {value}
      </SpoqaText>
    </View>
  );
}

export default MiniMetricCard;
