import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import {
  DDuDuSearchMenu,
  FeedViewToggleMenu,
  GoalMenu,
} from "@/features/feed/components/main-header/components";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";

interface FeedCalendarHeaderProps {
  displayMonth: string;
  onPrev?: () => void;
  onNext?: () => void;
}

function FeedCalendarHeader({ displayMonth, onPrev, onNext }: FeedCalendarHeaderProps) {
  const isNavigationEnabled = Boolean(onPrev && onNext);

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
        <View className="flex-row items-center">
          {isNavigationEnabled && (
            <Pressable
              onPress={onPrev}
              hitSlop={8}
              className="w-6 items-start"
            >
              <ChevronLeftIcon
                size={16}
                fill="#FFFFFF"
              />
            </Pressable>
          )}
          <SpoqaText
            weight="bold"
            className={`text-white text-size16 ${isNavigationEnabled ? "px-2" : "w-full text-center"}`}
          >
            {displayMonth}
          </SpoqaText>
          {isNavigationEnabled && (
            <Pressable
              onPress={onNext}
              hitSlop={8}
              className="w-6 items-end"
            >
              <ChevronRightIcon
                size={16}
                fill="#FFFFFF"
              />
            </Pressable>
          )}
        </View>
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
