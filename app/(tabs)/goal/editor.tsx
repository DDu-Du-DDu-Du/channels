import { useState } from "react";
import { View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { GoalEditorScreen } from "@/features/goal";

import { useLocalSearchParams } from "expo-router";

function Editor() {
  const params = useLocalSearchParams<{ goalId?: string }>();
  const goalId = Number(Array.isArray(params.goalId) ? params.goalId[0] : (params.goalId ?? 0));
  const [viewMode, setViewMode] = useState<"form" | "repeatList">("form");

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      {viewMode === "form" ? (
        <PageHeader
          title="목표수정"
          titleClassName="text-role-text-inverse dark:text-role-dark-text-inverse"
          rightContent={<HeaderRightActions />}
        />
      ) : null}
      <GoalEditorScreen
        goalId={goalId}
        onEditorViewModeChange={setViewMode}
      />
    </View>
  );
}

export default Editor;
