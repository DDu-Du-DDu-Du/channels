import { Pressable, View } from "react-native";

import { PlusIcon } from "@/icons";
import { GoalType } from "@/types/response/goal/goal";
import { remToPx } from "@/utils";

import SpoqaText from "../spoqa-text/spoqa-text";
import { useGoalItem } from "./hooks";

export interface GoalItemProps {
  className?: string;
  type?: "create" | "management";
  goal: GoalType;
  height?: number;
  onPress?: (id?: number) => void;
}

function GoalItem({
  className,
  type = "management",
  goal,
  height = remToPx(1.8) + 15,
  onPress,
}: GoalItemProps) {
  const { handlePress } = useGoalItem({ id: goal.id, onPress });
  return (
    <View className={`${className} flex-row items-center justify-between`}>
      <View
        className="inline-flex flex-row items-center px-[1.5rem]"
        style={{ height: height }}
      >
        <SpoqaText
          weight="semiBold"
          className="pr-[0.8rem] text-size15"
          style={{ color: `#${goal.color}` }}
        >
          {goal.name}
        </SpoqaText>
      </View>
      {type === "create" && (
        <Pressable
          className="inline-flex items-center justify-center size-[2.3rem] bg-white_100 rounded-circle"
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
