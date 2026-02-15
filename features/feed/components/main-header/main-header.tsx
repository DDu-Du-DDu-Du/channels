import { View } from "react-native";

import { SpoqaText } from "@/components";
import { SettingsIcon } from "@/icons";

function MainHeader() {
  return (
    <View className="mb-[2rem] pt-[2.4rem] px-[2.4rem]">
      <View className="flex flex-row justify-between items-center mb-[1.5rem]">
        <SpoqaText
          weight="bold"
          className="text-white text-size20"
        >
          여긴 어떤게 들어가는게 좋을까?
        </SpoqaText>
        <View className="flex flex-row justify-end gap-[0.8rem]">
          <SettingsIcon stroke="#ffffff" />
        </View>
      </View>
    </View>
  );
}

export default MainHeader;
