import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { FeedViewToggleMenu, GoalMenu } from "@/features/feed/components/main-header/components";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ChevronDownIcon } from "@/icons";

interface FeedCalendarHeaderProps {
  displayMonth: string;
  onPressMonthPicker?: () => void;
  showHeaderActions?: boolean;
}

function FeedCalendarHeader({
  displayMonth,
  onPressMonthPicker,
  showHeaderActions = true,
}: FeedCalendarHeaderProps) {
  const iconFill = useThemeColorToken("ui.icon.default");
  const headerContentClassName = showHeaderActions
    ? "w-full flex-row items-center justify-between px-2 pt-1 pb-6"
    : "h-[5.6rem] w-full flex-row items-center justify-between px-[1.6rem]";
  const monthButtonClassName = showHeaderActions
    ? "flex-row items-center pl-[1rem] gap-[0.6rem]"
    : "flex-row items-center gap-[0.6rem]";

  return (
    <View
      className="w-full border-b border-role-border-subtle dark:border-role-dark-border-subtle"
      style={{
        boxShadow: "0px 2px 3px rgba(0,0,0,0.12)",
      }}
    >
      <View className={headerContentClassName}>
        <Pressable
          onPress={onPressMonthPicker}
          hitSlop={8}
          accessibilityRole="button"
          className={monthButtonClassName}
        >
          <SpoqaText
            weight="bold"
            className="text-role-text-primary dark:text-role-dark-text-primary text-size16"
          >
            {displayMonth}
          </SpoqaText>
          <ChevronDownIcon
            size={14}
            fill={iconFill}
          />
        </Pressable>
        {showHeaderActions ? (
          <View className="flex-row items-center gap-[0.8rem]">
            <FeedViewToggleMenu />
            <GoalMenu />
          </View>
        ) : null}
      </View>
    </View>
  );
}

export default FeedCalendarHeader;
