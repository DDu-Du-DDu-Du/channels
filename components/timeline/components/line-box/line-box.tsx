import { View } from "react-native";

function LineBox() {
  return (
    <View className="absolute left-[5rem] h-full w-[5rem] items-center justify-center">
      <View className="h-full w-[0.2rem] border-l-[0.2rem] border-dashed" />
    </View>
  );
}

export default LineBox;
