import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";

function ConnectionActionButtons() {
  return (
    <View className="flex-row gap-[0.6rem]">
      <Pressable className="h-[3.2rem] items-center justify-center rounded-radius10 border border-[#D2D2D2] bg-[#FFFFFF] px-[0.9rem]">
        <SpoqaText className="text-size12 text-black_500">Import</SpoqaText>
      </Pressable>
      <Pressable className="h-[3.2rem] items-center justify-center rounded-radius10 border border-[#D2D2D2] bg-[#FFFFFF] px-[0.9rem]">
        <SpoqaText className="text-size12 text-black_500">Export</SpoqaText>
      </Pressable>
    </View>
  );
}

export default ConnectionActionButtons;
