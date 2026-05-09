import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { ShakingCheckIcon, SpoqaText } from "@/components";
import { OptionIcon } from "@/icons";

export interface MainTodoItemProps {
  id: number;
  Todo: string;
  status: "UNCOMPLETED" | "COMPLETE";
  color: string;
  beginAt?: string | null;
  endAt?: string | null;
  isPostponed?: boolean;
  onTodoCompleteToggle: (id: number) => void;
  onTextPress?: (id: number) => void;
  handleToggleOn: () => void;
}

function MainTodoItem({
  id,
  Todo,
  status,
  color,
  beginAt,
  endAt,
  isPostponed = false,
  onTodoCompleteToggle,
  onTextPress,
  handleToggleOn,
}: MainTodoItemProps) {
  const { t } = useTranslation();
  const isComplete = status === "COMPLETE";
  const resolvedBeginAt = beginAt?.slice(0, 5);
  const resolvedEndAt = endAt?.slice(0, 5);
  const timeLabel = resolvedBeginAt
    ? `${resolvedBeginAt}${resolvedEndAt ? ` ~ ${resolvedEndAt}` : ""}`
    : "";
  const textMetaItems = [timeLabel, isPostponed ? t("todo.postponed") : ""].filter(Boolean);
  const shouldShowMeta = textMetaItems.length > 0;

  const handleEditMode = () => {
    onTextPress?.(id);
  };

  const handlePressComplete = () => {
    onTodoCompleteToggle(id);
  };

  return (
    <View className="w-full min-h-[5.8rem] flex-row items-center bg-role-surface-canvas dark:bg-role-dark-surface-canvas">
      <View className="min-w-0 flex-1 flex-row items-center py-[1rem] pl-[1.6rem] pr-[0.4rem]">
        <View className="mr-[1rem] items-center justify-center">
          <ShakingCheckIcon
            isChecked={isComplete}
            color={color}
            size={20}
            onPress={handlePressComplete}
          />
        </View>
        <Pressable
          className="min-w-0 flex-1"
          onPress={handleEditMode}
        >
          <SpoqaText
            weight="regular"
            className={`text-size14 ${
              isComplete
                ? "text-role-text-tertiary line-through dark:text-role-dark-text-tertiary"
                : "text-role-text-primary dark:text-role-dark-text-primary"
            }`}
            numberOfLines={1}
          >
            {Todo}
          </SpoqaText>
          {shouldShowMeta && (
            <View className="mt-[0.25rem] min-w-0 flex-row flex-wrap items-center">
              <SpoqaText
                className="text-size11 text-role-text-tertiary dark:text-role-dark-text-tertiary"
                numberOfLines={1}
              >
                {textMetaItems.join(" • ")}
              </SpoqaText>
            </View>
          )}
        </Pressable>
      </View>
      <Pressable
        accessibilityRole="button"
        className="w-[3.8rem] items-center justify-center self-stretch"
        onPress={handleToggleOn}
      >
        <View style={{ transform: [{ rotate: "90deg" }] }}>
          <OptionIcon fill="#747474" />
        </View>
      </Pressable>
    </View>
  );
}

export default MainTodoItem;
