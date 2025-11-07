import { Switch, View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";

export interface AlarmToggleRowProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

function AlarmToggleRow({ enabled, onToggle }: AlarmToggleRowProps) {
  return (
    <View className="flex-row items-center justify-between bg-white_100 px-[1.6rem] py-[1rem] rounded-radius10">
      <SpoqaText className="text-size13">미리 알림 받기</SpoqaText>
      <Switch
        value={enabled}
        onValueChange={onToggle}
      />
    </View>
  );
}

export default AlarmToggleRow;
