import { View } from "react-native";

import { GoalEditorForm } from "@/features/goal";

function Create() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <GoalEditorForm
        pageTitle="목표등록"
        submitLabel="목표 등록"
      />
    </View>
  );
}

export default Create;
