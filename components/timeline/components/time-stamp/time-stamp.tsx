import { View } from "react-native";

import { SpoqaText } from "@/components";

export interface TimeStampProps {
  children: React.ReactNode;
}

function TimeStamp({ children }: TimeStampProps) {
  return (
    <View className="flex w-[5rem] items-center justify-center pl-[1rem] h-[5.7rem]">
      <View className="flex h-[2.4rem] w-[4rem] items-center justify-center rounded-[0.5rem] bg-white_100">
        <SpoqaText className="text-size11">{children}</SpoqaText>
      </View>
    </View>
  );
}

export default TimeStamp;
