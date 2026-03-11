import { View } from "react-native";

import { GoalEditorScreen } from "@/features/goal";

import { useLocalSearchParams } from "expo-router";

function Editor() {
  const params = useLocalSearchParams<{ goalId?: string }>();
  const goalId = Number(Array.isArray(params.goalId) ? params.goalId[0] : (params.goalId ?? 0));

  return (
    <View className="flex-1 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg">
      <GoalEditorScreen goalId={goalId} />
    </View>
  );
}

export default Editor;
