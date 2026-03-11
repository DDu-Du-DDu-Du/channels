import { View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";
import TimePicker from "@/components/time-picker/time-picker";

export interface AlarmPickersRowProps {
  onDayChange: (index: number) => void;
  onHourChange: (index: number) => void;
  onMinuteChange: (index: number) => void;
}

function AlarmPickersRow({ onDayChange, onHourChange, onMinuteChange }: AlarmPickersRowProps) {
  return (
    <View className="flex-row bg-role-surface-canvas dark:bg-role-dark-surface-canvas py-[1rem] rounded-radius10 justify-center">
      <View className="flex-row">
        <TimePicker
          onChange={onDayChange}
          type="day"
        />
        <TimePicker
          type="hour"
          onChange={onHourChange}
          label="시간"
        />
        <TimePicker
          type="min"
          onChange={onMinuteChange}
        />
      </View>
      <View className="justify-center">
        <SpoqaText>전 알림 받기</SpoqaText>
      </View>
    </View>
  );
}

export default AlarmPickersRow;
