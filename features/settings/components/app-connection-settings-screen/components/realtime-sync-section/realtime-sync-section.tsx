import { View } from "react-native";

import { AnimatedSwitch, SpoqaText } from "@/components";
import { NotionIcon } from "@/icons";

import { SettingsRow } from "../../../settings-row";

interface ToggleHandler {
  isToggle: boolean;
  handleValueChange: (next: boolean) => void;
}

interface RealtimeSyncSectionProps {
  notion: ToggleHandler;
  googleCalendar: ToggleHandler;
  microsoftTodo: ToggleHandler;
}

function RealtimeSyncSection({ notion, googleCalendar, microsoftTodo }: RealtimeSyncSectionProps) {
  return (
    <View className="pt-[2rem]">
      <SpoqaText
        weight="semiBold"
        className="mb-[0.8rem] text-size14 text-black_500"
      >
        실시간 연동
      </SpoqaText>

      <View className="overflow-hidden rounded-radius10 border border-[#E5E5E5] bg-[#FFFFFF] px-[1.4rem]">
        <SettingsRow
          label="Notion"
          leftContent={<NotionIcon size={16} />}
          rightContent={
            <AnimatedSwitch
              size="large"
              value={notion.isToggle}
              onValueChange={notion.handleValueChange}
              offBackgroundColor="#E1E1E1"
              onBackgroundColor="#1363DE"
              offThumbColor="#FFFFFF"
              onThumbColor="#FFFFFF"
            />
          }
        />
        <SettingsRow
          label="Google Calendar"
          rightContent={
            <AnimatedSwitch
              size="large"
              value={googleCalendar.isToggle}
              onValueChange={googleCalendar.handleValueChange}
              offBackgroundColor="#E1E1E1"
              onBackgroundColor="#1363DE"
              offThumbColor="#FFFFFF"
              onThumbColor="#FFFFFF"
            />
          }
        />
        <SettingsRow
          label="Microsoft To-Do"
          hasBottomBorder={false}
          rightContent={
            <AnimatedSwitch
              size="large"
              value={microsoftTodo.isToggle}
              onValueChange={microsoftTodo.handleValueChange}
              offBackgroundColor="#E1E1E1"
              onBackgroundColor="#1363DE"
              offThumbColor="#FFFFFF"
              onThumbColor="#FFFFFF"
            />
          }
        />
      </View>
    </View>
  );
}

export default RealtimeSyncSection;
