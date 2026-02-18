import { View } from "react-native";

import LineBox from "@/components/timeline/components/line-box/line-box";

function LineBoxView() {
  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <View className="h-[12rem] w-full max-w-[20rem] bg-example_gray_100">
        <LineBox />
      </View>
      <View className="mt-4 h-[12rem] w-full max-w-[20rem] bg-example_gray_100">
        <LineBox color="1363DE" />
      </View>
    </View>
  );
}

export default LineBoxView;
