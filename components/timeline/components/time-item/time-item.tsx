import { View } from "react-native";

import { ShakingCheckIcon, SpoqaText } from "@/components";
import MotionPressable from "@/components/motion/motion-pressable/motion-pressable";
import LineBox from "@/components/timeline/components/line-box/line-box";
import type { MainTimeTableDDuDuType } from "@/types/response/feed/feed";
import { hexConvertForRGBA } from "@/utils";

export interface TimeItemProps {
  ddudu: MainTimeTableDDuDuType;
  isFirstItem: boolean;
  isLastItem: boolean;
  onDDuDuCompleteToggle: (id: number) => void;
  onDDuDuSheetOpen: (id: number) => void;
}

export const TIME_ITEM_CARD_GAP = 5;
export const TIME_ITEM_BOUNDARY_GAP = TIME_ITEM_CARD_GAP * 3;

function TimeItem({
  ddudu,
  isFirstItem,
  isLastItem,
  onDDuDuCompleteToggle,
  onDDuDuSheetOpen,
}: TimeItemProps) {
  const { id, name, status, beginAt, endAt, color } = ddudu;
  const isComplete = status === "COMPLETE";
  const cardBorderColor = hexConvertForRGBA({ hex: color, alpha: 0.32 });
  const iconCenterOffset =
    (isFirstItem ? TIME_ITEM_BOUNDARY_GAP / 2 : 0) -
    (isLastItem ? TIME_ITEM_BOUNDARY_GAP / 2 : 0) -
    (!isLastItem ? TIME_ITEM_CARD_GAP / 2 : 0);

  const handleDDuDuCompleteToggle = () => {
    onDDuDuCompleteToggle(id);
  };

  const handleDDuDuSheetOpen = () => {
    onDDuDuSheetOpen(id);
  };

  return (
    <View
      className="relative w-full"
      style={{
        paddingTop: isFirstItem ? TIME_ITEM_BOUNDARY_GAP : 0,
        paddingBottom: isLastItem ? TIME_ITEM_BOUNDARY_GAP : 0,
      }}
    >
      <View className="absolute right-[100%] top-0 h-full w-[5rem] items-center justify-center">
        <View
          className="absolute top-0 w-full z-timeline_line"
          style={{ height: "50%" }}
        >
          {isFirstItem ? (
            <LineBox
              color={color}
              mode="inline"
            />
          ) : (
            <View
              className="mx-auto h-full w-[0.2rem]"
              style={{ backgroundColor: `#${color}` }}
            />
          )}
        </View>

        <View
          className="absolute inset-0 z-timeline_icon items-center justify-center"
          style={{ transform: [{ translateY: iconCenterOffset }] }}
        >
          <ShakingCheckIcon
            isChecked={isComplete}
            color={color}
            size={27}
            onPress={handleDDuDuCompleteToggle}
          />
        </View>

        <View
          className="absolute bottom-0 w-full z-timeline_line"
          style={{ height: "50%" }}
        >
          {isLastItem ? (
            <LineBox
              color={color}
              mode="inline"
            />
          ) : (
            <View
              className="mx-auto h-full w-[0.2rem]"
              style={{ backgroundColor: `#${color}` }}
            />
          )}
        </View>
      </View>

      <MotionPressable
        whileTap={{ scale: 0.95 }}
        highlightColor={`#${color}`}
        highlightHoverOpacity={0.1}
        highlightTapOpacity={0.2}
        onPress={handleDDuDuSheetOpen}
      >
        <View
          className="w-full min-h-[5.7rem] flex-col rounded-radius15 border bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.6rem] py-[1.2rem]"
          style={{
            borderColor: cardBorderColor,
            marginBottom: isLastItem ? 0 : TIME_ITEM_CARD_GAP,
          }}
        >
          <SpoqaText className="text-size14">{name}</SpoqaText>
          <SpoqaText className="text-size11 text-role-text-tertiary dark:text-role-dark-text-tertiary">
            {beginAt && endAt ? `${beginAt} - ${endAt}` : ""}
          </SpoqaText>
        </View>
      </MotionPressable>
    </View>
  );
}

export default TimeItem;
