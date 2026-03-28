import { View } from "react-native";

import { PageHeader } from "@/components";
import { GoalEditorForm } from "@/features/goal";

function Create() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="목표등록"
        titleClassName="text-size15 text-role-text-inverse dark:text-role-dark-text-inverse"
      />
      <GoalEditorForm submitLabel="목표 등록" />
    </View>
  );
}

export default Create;
