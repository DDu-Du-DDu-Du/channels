import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import {
  FeedViewToggleMenu,
  GoalMenu,
  TodosearchMenu,
} from "@/features/feed/components/main-header/components";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ChevronRightIcon } from "@/icons";

interface FeedCalendarHeaderProps {
  displayMonth: string;
  onPressMonthPicker?: () => void;
}

function FeedCalendarHeader({ displayMonth, onPressMonthPicker }: FeedCalendarHeaderProps) {
  const iconFill = useThemeColorToken("ui.icon.default");

  return (
    <View
      className="w-full border-b border-role-border-subtle dark:border-role-dark-border-subtle"
      style={{
        boxShadow: "0px 2px 3px rgba(0,0,0,0.12)",
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
            className="text-role-text-primary dark:text-role-dark-text-primary text-size16"
          >
            {displayMonth}
          </SpoqaText>
          <ChevronRightIcon
            size={14}
            fill={iconFill}
          />
        </Pressable>
        <View className="flex-row items-center gap-[0.8rem]">
          <FeedViewToggleMenu />
          <TodosearchMenu />
          <GoalMenu />
        </View>
      </View>
    </View>
  );
}

export default FeedCalendarHeader;
