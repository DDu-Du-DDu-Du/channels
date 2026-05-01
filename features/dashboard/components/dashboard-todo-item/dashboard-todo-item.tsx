import { Pressable, View } from "react-native";

import { ShakingCheckIcon, SpoqaText } from "@/components";
import { OptionIcon } from "@/icons";
import type { TodoDashboardItemType } from "@/types/response/todo/todo";

interface DashboardTodoItemProps {
  item: TodoDashboardItemType;
  onCompleteToggle: (id: number) => void;
  onOpenMenu: (id: number) => void;
}

function DashboardTodoItem({ item, onCompleteToggle, onOpenMenu }: DashboardTodoItemProps) {
  const isComplete = item.status === "COMPLETE";
  const resolvedBeginAt = item.beginAt?.slice(0, 5);
  const resolvedEndAt = item.endAt?.slice(0, 5);
  const timeLabel = resolvedBeginAt
    ? `${resolvedBeginAt}${resolvedEndAt ? ` ~ ${resolvedEndAt}` : ""}`
    : "";
  const isPostponed = Boolean(item.postponedAt);
  const shouldShowMeta = Boolean(timeLabel || isPostponed);

  const handlePressComplete = () => {
    onCompleteToggle(item.id);
  };

  const handleOpenMenu = () => {
    onOpenMenu(item.id);
  };

  return (
    <View className="mb-[1rem] min-h-[6.6rem] w-full flex-row items-center rounded-[2rem] bg-role-surface-canvas dark:bg-role-dark-surface-canvas">
      <View className="items-center justify-center pl-[1.8rem] pr-[1.2rem]">
        <ShakingCheckIcon
          isChecked={isComplete}
          color="8E8E93"
          uncheckedColor="8E8E93"
          size={26}
          borderStrokeAlpha={0.72}
          onPress={handlePressComplete}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handleOpenMenu}
        className="min-w-0 flex-1 py-[1.2rem]"
      >
        <SpoqaText
          weight="regular"
          numberOfLines={1}
          className={`text-size16 ${
            isComplete
              ? "text-role-text-tertiary line-through dark:text-role-dark-text-tertiary"
              : "text-role-text-primary dark:text-role-dark-text-primary"
          }`}
        >
          {item.name}
        </SpoqaText>

        {shouldShowMeta && (
          <View className="mt-[0.25rem] min-w-0 flex-row flex-wrap items-center">
            {timeLabel ? (
              <SpoqaText
                className="text-size11 text-role-text-tertiary dark:text-role-dark-text-tertiary"
                numberOfLines={1}
              >
                {timeLabel}
              </SpoqaText>
            ) : null}
            {isPostponed ? (
              <View
                className={
                  timeLabel ? "ml-[0.6rem] flex-row items-center" : "flex-row items-center"
                }
              >
                <View className="mr-[0.5rem] h-[0.8rem] w-[0.8rem] rounded-circle bg-[#F59E0B]" />
                <SpoqaText className="text-size11 text-role-text-tertiary dark:text-role-dark-text-tertiary">
                  Postponed
                </SpoqaText>
              </View>
            ) : null}
          </View>
        )}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={handleOpenMenu}
        className="w-[4.8rem] items-center justify-center self-stretch"
      >
        <View style={{ transform: [{ rotate: "90deg" }] }}>
          <OptionIcon fill="#747474" />
        </View>
      </Pressable>
    </View>
  );
}

export default DashboardTodoItem;
