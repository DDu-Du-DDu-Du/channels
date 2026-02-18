import { View } from "react-native";

import { SpoqaText } from "@/components";

export interface TimeStampProps {
  children: React.ReactNode;
  fillParentHeight?: boolean;
}

function TimeStamp({ children, fillParentHeight = false }: TimeStampProps) {
  const wrapperHeightClassName = fillParentHeight ? "h-full" : "h-[5.7rem]";

  return (
    <View
      className={`flex w-[5rem] items-center justify-center pl-[1rem] ${wrapperHeightClassName}`}
    >
      <View className="flex h-[2.4rem] w-[4rem] items-center justify-center rounded-[0.5rem] bg-white_100">
        <SpoqaText className="text-size11">{children}</SpoqaText>
      </View>
    </View>
  );
}

export default TimeStamp;
