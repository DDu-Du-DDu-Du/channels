import { View } from "react-native";

import GoalItemList from "@/components/goal-item-list/goal-item-list";
import type { GoalType } from "@/types/response/goal/goal";

const BASE_GOALS: GoalType[] = [
  { id: 1, name: "Goal 1", status: "IN_PROGRESS", color: "FF8A3D", priority: 1 },
  { id: 2, name: "Goal 2", status: "IN_PROGRESS", color: "4CAF50", priority: 2 },
  { id: 3, name: "Goal 3", status: "IN_PROGRESS", color: "2196F3", priority: 3 },
  { id: 4, name: "Goal 4", status: "IN_PROGRESS", color: "9C27B0", priority: 4 },
];

export interface GoalItemListViewProps {
  type?: "create" | "management";
}

function GoalItemListView({ type = "management" }: GoalItemListViewProps) {
  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <View className="w-full max-w-[40rem]">
        <GoalItemList
          type={type}
          initialData={BASE_GOALS}
        />
      </View>
    </View>
  );
}

export default GoalItemListView;
