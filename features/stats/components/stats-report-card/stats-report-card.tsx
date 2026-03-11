import { View } from "react-native";

import { SpoqaText } from "@/components";

type DeltaTone = "increase" | "decrease" | "neutral";

interface StatsReportCardProps {
  title: string;
  valueLabel: string;
  deltaLabel: string;
  deltaTone: DeltaTone;
}

const DELTA_BADGE_CLASS: Record<DeltaTone, string> = {
  increase: "bg-[#E7F3EB]",
  decrease: "bg-[#F6E8E8]",
  neutral: "bg-[#ECECEC]",
};

const DELTA_TEXT_CLASS: Record<DeltaTone, string> = {
  increase: "text-[#2F6B45]",
  decrease: "text-[#8A5555]",
  neutral: "text-[#7A7A7A]",
};

function StatsReportCard({ title, valueLabel, deltaLabel, deltaTone }: StatsReportCardProps) {
  return (
    <View className="flex-1 rounded-radius15 border border-ui-card-default-border bg-ui-card-default-bg px-[1.2rem] py-[1.6rem] dark:border-ui-dark-card-default-border dark:bg-ui-dark-card-default-bg">
      <View className="flex-1 items-center justify-center gap-[0.8rem] pb-[0.8rem]">
        <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
          {title}
        </SpoqaText>
        <SpoqaText
          weight="bold"
          className="text-size20 text-role-text-primary dark:text-role-dark-text-primary"
        >
          {valueLabel}
        </SpoqaText>
      </View>
      <View className="mt-[0.5rem] items-center">
        <View className={`rounded-circle px-[1.2rem] py-[0.5rem] ${DELTA_BADGE_CLASS[deltaTone]}`}>
          <SpoqaText className={`text-size12 ${DELTA_TEXT_CLASS[deltaTone]}`}>
            {deltaLabel}
          </SpoqaText>
        </View>
      </View>
    </View>
  );
}

export default StatsReportCard;
