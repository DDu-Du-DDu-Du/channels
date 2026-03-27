import { View } from "react-native";

import { FeedTypeSwitch } from "@/components";

export interface FeedTypeSwitchViewProps {
  firstLabel?: string;
  secondLabel?: string;
  selectedOption?: string;
  alternativeOption?: string;
}

function FeedTypeSwitchView({
  firstLabel = "투두",
  secondLabel = "스케줄",
  selectedOption = "Todo",
  alternativeOption = "schedule",
}: FeedTypeSwitchViewProps) {
  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <FeedTypeSwitch
        firstLabel={firstLabel}
        secondLabel={secondLabel}
        selectedOption={selectedOption}
        alternativeOption={alternativeOption}
      />
    </View>
  );
}

export default FeedTypeSwitchView;
