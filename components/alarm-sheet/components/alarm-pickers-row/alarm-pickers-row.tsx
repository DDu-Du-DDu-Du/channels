import { Platform, View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";
import WheelPicker from "@/components/wheel-picker/wheel-picker";

export interface AlarmPickersRowProps {
  dayList: number[];
  hourList: number[];
  minuteList: number[];
  dayIndex: number;
  hourIndex: number;
  minuteIndex: number;
  onDayChange: (index: number) => void;
  onHourChange: (index: number) => void;
  onMinuteChange: (index: number) => void;
}

function AlarmPickersRow({
  dayList,
  hourList,
  minuteList,
  dayIndex,
  hourIndex,
  minuteIndex,
  onDayChange,
  onHourChange,
  onMinuteChange,
}: AlarmPickersRowProps) {
  const itemHeight = 40;
  const pickerWidth = Platform.OS === "web" ? 72 : 50;

  return (
    <View className="flex-row bg-white_100 py-[1rem] rounded-radius10 justify-center">
      <View className="flex-row">
        <View className="flex-row items-center">
          <View
            className="items-center justify-center rounded-radius10 bg-example_gray_100"
            style={{ width: pickerWidth, height: itemHeight * 3 }}
          >
            <WheelPicker
              data={dayList}
              value={dayIndex}
              onChange={onDayChange}
              itemHeight={itemHeight}
            />
          </View>
          <SpoqaText className="px-[0.5rem]">일</SpoqaText>
        </View>
        <View className="flex-row items-center">
          <View
            className="items-center justify-center rounded-radius10 bg-example_gray_100"
            style={{ width: pickerWidth, height: itemHeight * 3 }}
          >
            <WheelPicker
              data={hourList}
              value={hourIndex}
              onChange={onHourChange}
              itemHeight={itemHeight}
            />
          </View>
          <SpoqaText className="px-[0.5rem]">시간</SpoqaText>
        </View>
        <View className="flex-row items-center">
          <View
            className="items-center justify-center rounded-radius10 bg-example_gray_100"
            style={{ width: pickerWidth, height: itemHeight * 3 }}
          >
            <WheelPicker
              data={minuteList}
              value={minuteIndex}
              onChange={onMinuteChange}
              itemHeight={itemHeight}
            />
          </View>
          <SpoqaText className="px-[0.5rem]">분</SpoqaText>
        </View>
      </View>
      <View className="justify-center">
        <SpoqaText>전 알림 받기</SpoqaText>
      </View>
    </View>
  );
}

export default AlarmPickersRow;
