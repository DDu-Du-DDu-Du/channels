import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import {
  DDuDuSearchMenu,
  FeedViewToggleMenu,
  GoalMenu,
} from "@/features/feed/components/main-header/components";
import { ChevronRightIcon } from "@/icons";

interface FeedCalendarHeaderProps {
  displayMonth: string;
  onPressMonthPicker?: () => void;
}

function FeedCalendarHeader({ displayMonth, onPressMonthPicker }: FeedCalendarHeaderProps) {
  return (
    <View
      className="w-full"
      style={{
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 4,
        elevation: 6,
      }}
    >
      <View className="w-full flex-row items-center justify-between px-2 pt-1 pb-6">
        <Pressable
          onPress={onPressMonthPicker}
          hitSlop={8}
          accessibilityRole="button"
          className="flex-row items-center pl-[1rem] gap-[0.6rem]"
        >
          <SpoqaText
            weight="bold"
            className="text-role-text-inverse dark:text-role-dark-text-inverse text-size16"
          >
            {displayMonth}
          </SpoqaText>
          <ChevronRightIcon
            size={14}
            fill="#FFFFFF"
          />
        </Pressable>
        <View className="flex-row items-center gap-[0.8rem]">
          <FeedViewToggleMenu />
          <DDuDuSearchMenu />
          <GoalMenu />
        </View>
      </View>
    </View>
  );
}

export default FeedCalendarHeader;
