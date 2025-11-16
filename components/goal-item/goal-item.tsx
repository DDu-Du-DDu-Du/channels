import { Pressable, View } from "react-native";

import { PlusIcon } from "@/icons";
import { GoalType } from "@/types/response/goal/goal";

import SpoqaText from "../spoqa-text/spoqa-text";
import { useGoalItem } from "./hooks";

export interface GoalItemProps {
  type?: "create" | "management";
  goal: GoalType;
  height: number;
  onPress?: (id?: number) => void;
}

function GoalItem({ type = "management", goal, height, onPress }: GoalItemProps) {
  const { handlePress } = useGoalItem({ id: goal.id, onPress });
  return (
    <Pressable
      className="inline-flex items-center"
      onPress={handlePress}
    >
      <View
        className="inline-flex flex-row items-center px-[0.9rem] bg-sub_1 rounded-radius15 shadow-shadow_100"
        style={{ height: height }}
      >
        <SpoqaText
          weight="semiBold"
          className="pr-[0.8rem]"
          style={{ color: `#${goal.color}` }}
        >
          {goal.name}
        </SpoqaText>
        {type === "create" && (
          <View className="inline-flex items-center justify-center size-[2rem] bg-white_100 rounded-circle">
            <PlusIcon size={12} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default GoalItem;
