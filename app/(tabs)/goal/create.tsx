import { View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { GoalEditorForm } from "@/features/goal";

function Create() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="목표등록"
        titleClassName="text-size15 text-role-text-inverse dark:text-role-dark-text-inverse"
        className="px-[2.4rem] pb-[1.6rem] pt-[2rem]"
        rightContent={<HeaderRightActions />}
      />
      <GoalEditorForm submitLabel="목표 등록" />
    </View>
  );
}

export default Create;
