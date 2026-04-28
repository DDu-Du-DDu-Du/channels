import { View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { GoalEditorForm } from "@/features/goal";

function Create() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="목표등록"
        titleClassName="text-role-text-inverse dark:text-role-dark-text-inverse"
        rightContent={<HeaderRightActions />}
      />
      <GoalEditorForm submitLabel="목표 등록" />
    </View>
  );
}

export default Create;
