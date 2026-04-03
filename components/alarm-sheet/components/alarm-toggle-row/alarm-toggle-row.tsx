import { View } from "react-native";

import AnimatedSwitch from "@/components/animated-switch/animated-switch";
import SpoqaText from "@/components/spoqa-text/spoqa-text";

export interface AlarmToggleRowProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

function AlarmToggleRow({ enabled, onToggle }: AlarmToggleRowProps) {
  return (
    <View className="flex-row items-center justify-between bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.6rem] py-[1rem] rounded-radius10">
      <SpoqaText className="text-size13">미리 알림 받기</SpoqaText>
      <AnimatedSwitch
        value={enabled}
        onValueChange={onToggle}
      />
    </View>
  );
}

export default AlarmToggleRow;
