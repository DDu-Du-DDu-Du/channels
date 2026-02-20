import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { ArrowLeftIcon, EditIcon } from "@/icons";

interface GoalDetailHeaderProps {
  goalName: string;
  handlePressBack: () => void;
  onPressEdit?: () => void;
}

function GoalDetailHeader({ goalName, handlePressBack, onPressEdit }: GoalDetailHeaderProps) {
  return (
    <View className="relative items-center justify-center">
      <Pressable
        onPress={handlePressBack}
        className="absolute left-0 top-0 size-[2.4rem] items-start justify-center"
        hitSlop={8}
      >
        <ArrowLeftIcon
          size={16}
          stroke="#FFFFFF"
        />
      </Pressable>

      {onPressEdit ? (
        <Pressable
          onPress={onPressEdit}
          className="absolute right-0 top-0 size-[2.4rem] items-end justify-center"
          hitSlop={8}
        >
          <EditIcon
            size={16}
            fill="#FFFFFF"
          />
        </Pressable>
      ) : null}

      <SpoqaText
        weight="bold"
        className="text-size15 text-white_100"
      >
        {goalName}
      </SpoqaText>
    </View>
  );
}

export default GoalDetailHeader;
