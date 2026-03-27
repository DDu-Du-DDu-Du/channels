import { Switch, View } from "react-native";

import { SpoqaText, TimePicker } from "@/components";
import { useThemeColorToken } from "@/hooks/use-theme-color";

export interface TodoReminderPanelProps {
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

function TodoReminderPanel({
  enabled,
  day,
  hour,
  minute,
  warningMessage,
  onToggle,
  onChangeDay,
  onChangeHour,
  onChangeMinute,
}: TodoReminderPanelProps) {
  const switchOffTrackColor = useThemeColorToken("role.border.default");
  const switchOnTrackColor = useThemeColorToken("role.status.success");
  const switchThumbColor = useThemeColorToken("role.surface.canvas");

  return (
    <View className="gap-[0.8rem]">
      <View className="flex-row items-center justify-between rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.2rem] py-[1.4rem]">
        <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
          미리 알림 받기
        </SpoqaText>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: switchOffTrackColor, true: switchOnTrackColor }}
          thumbColor={switchThumbColor}
        />
      </View>

      {enabled && (
        <View className="rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1rem] py-[1.2rem]">
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
          <SpoqaText className="mt-[0.6rem] text-center text-size13 text-role-text-secondary dark:text-role-dark-text-secondary">
            전에 알림 받기
          </SpoqaText>
        </View>
      )}

      {warningMessage ? (
        <SpoqaText className="text-size13 text-role-status-error dark:text-role-dark-status-error">
          {warningMessage}
        </SpoqaText>
      ) : null}
    </View>
  );
}

export default TodoReminderPanel;
