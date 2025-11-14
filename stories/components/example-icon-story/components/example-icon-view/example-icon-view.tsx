import { View } from "react-native";

import { ExampleIcon } from "@/components";

export interface ExampleIconViewProps {
  size?: number;
}

function ExampleIconView({ size = 32 }: ExampleIconViewProps) {
  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <ExampleIcon size={size} />
    </View>
  );
}

export default ExampleIconView;
