import { useState } from "react";
import { LayoutChangeEvent } from "react-native";

interface UseGoalItemParams {
  id?: number;
  onPress?: (id?: number) => void;
}

function useGoalItem({ id, onPress }: UseGoalItemParams) {
  const [itemHeight, setItemHeight] = useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;

    setItemHeight(height);
  };

  const handlePress = () => {
    onPress?.(id);
  };

  return { itemHeight, handleLayout, handlePress };
}

export default useGoalItem;
