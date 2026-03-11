import { Pressable, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { SpoqaText } from "@/components";
import type { RepeatDduduItemType } from "@/features/repeat-ddudu/repeat-ddudu.types";
import { ArrowLeftIcon, DeleteIcon } from "@/icons";

import { buildRepeatDduduDescription } from "../../utils/repeat-ddudu-format/repeat-ddudu-format";

export interface SwipeableRepeatDduduCardProps {
  repeatDdudu: RepeatDduduItemType;
  onPress: () => void;
  onPressDelete: () => void;
}

function SwipeableRepeatDduduCard({
  repeatDdudu,
  onPress,
  onPressDelete,
}: SwipeableRepeatDduduCardProps) {
  return (
    <Swipeable
      friction={2}
      rightThreshold={30}
      renderRightActions={() => (
        <Pressable
          onPress={onPressDelete}
          className="ml-[0.8rem] w-[20%] min-w-[6.4rem] items-center justify-center rounded-radius15 bg-[#FFD9D9]"
        >
          <DeleteIcon
            size={18}
            fill="#D54646"
          />
        </Pressable>
      )}
    >
      <Pressable
        onPress={onPress}
        className="rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.2rem] py-[1rem]"
      >
        <View className="flex-row items-start justify-between gap-[0.8rem]">
          <View className="flex-1">
            <SpoqaText
              weight="medium"
              className="text-size14 text-role-text-primary dark:text-role-dark-text-primary"
            >
              {repeatDdudu.name}
            </SpoqaText>
            <SpoqaText className="mt-[0.4rem] text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
              {buildRepeatDduduDescription(repeatDdudu)}
            </SpoqaText>
          </View>
          <View className="pt-[0.2rem]">
            <ArrowLeftIcon
              size={12}
              stroke="#B5B5B5"
            />
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
}

export default SwipeableRepeatDduduCard;
