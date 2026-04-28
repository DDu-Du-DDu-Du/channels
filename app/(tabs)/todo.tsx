import { View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { TodoSearchScreen } from "@/features/todo-search";

function Todo() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title="투두 검색"
        rightContent={<HeaderRightActions />}
      />
      <TodoSearchScreen />
    </View>
  );
}

export default Todo;
