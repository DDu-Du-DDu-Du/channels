import { View } from "react-native";

import { TodoSearchScreen } from "@/features/todo-search";

function Todo() {
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <TodoSearchScreen />
    </View>
  );
}

export default Todo;
