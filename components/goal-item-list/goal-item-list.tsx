import { useState } from "react";

import { GoalType } from "@/types/response/goal/goal";
import { remToPx } from "@/utils";

import DraggableFlatList from "../draggable-flat-list/draggable-flat-list";
import GoalItem from "../goal-item/goal-item";

export interface GoalItemListProps {
  initialData?: GoalType[];
  type: "create" | "management";
}

function GoalItemList({ initialData = [], type }: GoalItemListProps) {
  const [data, setData] = useState(initialData);
  const height = remToPx(1.8) + 15;
  const marginBottom = remToPx(1.6);

  const handleDragEnd = ({ data }: { data: GoalType[] }) => {
    setData(data);
  };

  const renderItem = ({ item }: { item: GoalType }) => {
    return (
      <GoalItem
        type={type}
        goal={item}
        height={height}
      />
    );
  };

  return (
    <DraggableFlatList
      data={data}
      itemHeight={height}
      itemSpacing={marginBottom}
      onDragEnd={handleDragEnd}
      renderItem={renderItem}
    />
  );
}

export default GoalItemList;
