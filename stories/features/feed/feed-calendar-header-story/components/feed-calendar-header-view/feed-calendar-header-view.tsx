import { View } from "react-native";

import FeedCalendarHeader from "@/features/feed/components/feed-calendar/components/feed-calendar-header/feed-calendar-header";

export interface FeedCalendarHeaderViewProps {
  displayMonth?: string;
  onPrev?: () => void;
  onNext?: () => void;
}

function FeedCalendarHeaderView({
  displayMonth = `${new Date().getFullYear()}년 ${String(new Date().getMonth() + 1).padStart(2, "0")}월`,
  onPrev,
  onNext,
}: FeedCalendarHeaderViewProps) {
  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <FeedCalendarHeader
        displayMonth={displayMonth}
        onPrev={onPrev}
        onNext={onNext}
      />
    </View>
  );
}

export default FeedCalendarHeaderView;
