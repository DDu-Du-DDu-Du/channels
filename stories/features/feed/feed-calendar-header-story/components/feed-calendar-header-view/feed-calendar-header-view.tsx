import { View } from "react-native";

import FeedCalendarHeader from "@/features/feed/components/feed-calendar/components/feed-calendar-header/feed-calendar-header";

export interface FeedCalendarHeaderViewProps {
  displayMonth?: string;
  onPressMonthPicker?: () => void;
  showHeaderActions?: boolean;
}

function FeedCalendarHeaderView({
  displayMonth = `${new Date().getFullYear()}년 ${String(new Date().getMonth() + 1).padStart(2, "0")}월`,
  onPressMonthPicker,
  showHeaderActions,
}: FeedCalendarHeaderViewProps) {
  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <FeedCalendarHeader
        displayMonth={displayMonth}
        onPressMonthPicker={onPressMonthPicker}
        showHeaderActions={showHeaderActions}
      />
    </View>
  );
}

export default FeedCalendarHeaderView;
