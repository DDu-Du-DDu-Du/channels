import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import MotionPressable from "@/components/motion/motion-pressable/motion-pressable";
import type { MainTimeTableDDuDuType } from "@/types/response/feed/feed";

export interface TimeItemProps {
  ddudu: MainTimeTableDDuDuType;
  isLastItem: boolean;
  onDDuDuCompleteToggle: (id: number) => void;
  onDDuDuSheetOpen: (id: number) => void;
}

function TimeItem({ ddudu, isLastItem, onDDuDuCompleteToggle, onDDuDuSheetOpen }: TimeItemProps) {
  const { id, name, status, beginAt, endAt, color } = ddudu;

  const handleDDuDuCompleteToggle = () => {
    onDDuDuCompleteToggle(id);
  };

  const handleDDuDuSheetOpen = () => {
    onDDuDuSheetOpen(id);
  };

  const isComplete = status === "COMPLETE";

  return (
    <View className="relative w-full">
      <View className="absolute right-[100%] top-0 flex h-full w-[5rem] items-center justify-center">
        <View className="absolute top-0 z-timeline_icon flex h-[5.7rem] items-center justify-center">
          <Pressable
            className="flex h-[2.2rem] w-[2.2rem] items-center justify-center rounded-circle"
            style={{ backgroundColor: `#${color}` }}
            onPress={handleDDuDuCompleteToggle}
          >
            <View className="flex h-[1.6rem] w-[1.6rem] items-center justify-center rounded-circle bg-white_100">
              {isComplete && (
                <View
                  className="h-[1.2rem] w-[1.2rem] rounded-circle"
                  style={{ backgroundColor: `#${color}` }}
                />
              )}
            </View>
          </Pressable>
        </View>

        {!isLastItem && (
          <View
            className="absolute top-[3rem] z-timeline_line w-[0.2rem]"
            style={{
              height: "100%",
              backgroundColor: "#D9D9D9",
            }}
          />
        )}
      </View>
      <MotionPressable
        whileTap={{ scale: 0.95 }}
        highlightColor={`#${color}`}
        highlightHoverOpacity={0.1}
        highlightTapOpacity={0.2}
        onPress={handleDDuDuSheetOpen}
      >
        <View className="w-full min-h-[5.7rem] flex flex-col rounded-radius15 px-[1.6rem] py-[1.2rem]">
          <SpoqaText className="text-size14">{name}</SpoqaText>
          <SpoqaText className="text-size11 text-example_gray_800">
            {beginAt && endAt ? `${beginAt} - ${endAt}` : ""}
          </SpoqaText>
        </View>
      </MotionPressable>
    </View>
  );
}

export default TimeItem;
