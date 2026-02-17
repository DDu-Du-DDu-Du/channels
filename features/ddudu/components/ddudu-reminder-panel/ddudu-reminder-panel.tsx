import { Switch, View } from "react-native";

import { SpoqaText, TimePicker } from "@/components";

export interface DDuDuReminderPanelProps {
  enabled: boolean;
  day: number;
  hour: number;
  minute: number;
  warningMessage?: string;
  onToggle: (enabled: boolean) => void;
  onChangeDay: (value: number) => void;
  onChangeHour: (value: number) => void;
  onChangeMinute: (value: number) => void;
}

function DDuDuReminderPanel({
  enabled,
  day,
  hour,
  minute,
  warningMessage,
  onToggle,
  onChangeDay,
  onChangeHour,
  onChangeMinute,
}: DDuDuReminderPanelProps) {
  return (
    <View className="gap-[0.8rem]">
      <View className="flex-row items-center justify-between rounded-radius15 bg-white_100 px-[1.2rem] py-[1.4rem]">
        <SpoqaText className="text-size14 text-black">미리 알림 받기</SpoqaText>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: "#D9D9D9", true: "#35CB72" }}
          thumbColor="#FFFFFF"
        />
      </View>

      {enabled && (
        <View className="rounded-radius15 bg-white_100 px-[1rem] py-[1.2rem]">
          <View className="flex-row items-center justify-center">
            <TimePicker
              type="day"
              value={day}
              onChange={onChangeDay}
            />
            <TimePicker
              type="hour"
              value={hour}
              onChange={onChangeHour}
              label="시간"
            />
            <TimePicker
              type="min"
              value={minute}
              onChange={onChangeMinute}
              label="분"
            />
          </View>
          <SpoqaText className="mt-[0.6rem] text-center text-size13 text-example_gray_900">
            전에 알림 받기
          </SpoqaText>
        </View>
      )}

      {warningMessage ? (
        <SpoqaText className="text-size13 text-example_red_500">{warningMessage}</SpoqaText>
      ) : null}
    </View>
  );
}

export default DDuDuReminderPanel;
