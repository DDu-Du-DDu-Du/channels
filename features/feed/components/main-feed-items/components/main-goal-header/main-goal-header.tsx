import { GoalItem } from "@/components";
import type { MainDailyListType } from "@/types/response/feed/feed";

export interface MainGoalHeaderProps {
  goal: MainDailyListType["goal"];
  height?: number;
  onPress: (id?: number) => void;
}

function MainGoalHeader({ goal, height, onPress }: MainGoalHeaderProps) {
  return (
    <GoalItem
      type="create"
      goal={goal}
      height={height}
      onPress={onPress}
    />
  );
}

export default MainGoalHeader;
