import { View } from "react-native";

import DailyDDuDu from "@/features/feed/components/feed-calendar/components/daily-ddudu/daily-ddudu";

export interface DailyDDuDuViewProps {
  totalCount?: number;
  doneCount?: number;
  restCount?: number;
}

function DailyDDuDuView({ totalCount = 8, doneCount = 3, restCount = 5 }: DailyDDuDuViewProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <DailyDDuDu
        totalCount={totalCount}
        doneCount={doneCount}
        restCount={restCount}
      />
    </View>
  );
}

export default DailyDDuDuView;
