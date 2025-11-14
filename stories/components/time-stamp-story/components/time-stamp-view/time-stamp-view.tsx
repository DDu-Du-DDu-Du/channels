import { View } from "react-native";

import TimeStamp from "@/components/timeline/components/time-stamp/time-stamp";

export interface TimeStampViewProps {
  label?: string;
}

function TimeStampView({ label = "09:00" }: TimeStampViewProps) {
  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <TimeStamp>{label}</TimeStamp>
    </View>
  );
}

export default TimeStampView;
