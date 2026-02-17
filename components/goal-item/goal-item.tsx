import { Pressable, View } from "react-native";

import { PlusIcon } from "@/icons";
import { GoalType } from "@/types/response/goal/goal";
import { hexConvertForRGBA, remToPx } from "@/utils";

import SpoqaText from "../spoqa-text/spoqa-text";
import { useGoalItem } from "./hooks";

export interface GoalItemProps {
  className?: string;
  type?: "create" | "management";
  goal: GoalType;
  height?: number;
  isRounded?: boolean;
  onPress?: (id?: number) => void;
}

function GoalItem({
  className,
  type = "management",
  goal,
  height = remToPx(1.8) + 15,
  isRounded = true,
  onPress,
}: GoalItemProps) {
  const { handlePress } = useGoalItem({ id: goal.id, onPress });
  const isCreateType = type === "create";
  const leftBackgroundColor = hexConvertForRGBA({ hex: goal.color, alpha: 0.12 });
  const rightBackgroundColor = hexConvertForRGBA({ hex: goal.color, alpha: 0.2 });

  return (
    <View
      className={`${className} w-full flex-row overflow-hidden ${isRounded ? "rounded-radius15" : ""}`}
      style={{ height }}
    >
      <View
        className={`justify-center px-[1.5rem] ${isCreateType ? "w-[80%]" : "w-full"}`}
        style={{ backgroundColor: leftBackgroundColor }}
      >
        <SpoqaText
          weight="semiBold"
          className="pr-[0.8rem] text-size16"
          style={{ color: `#${goal.color}` }}
        >
          {goal.name}
        </SpoqaText>
      </View>
      {isCreateType && (
        <Pressable
          className="h-full w-[20%] items-center justify-center"
          style={{ backgroundColor: rightBackgroundColor }}
          onPress={handlePress}
        >
          <PlusIcon
            size={12}
            stroke={`#${goal.color}`}
          />
        </Pressable>
      )}
    </View>
  );
}

export default GoalItem;
