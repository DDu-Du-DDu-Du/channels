import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { TodoSearchScreen } from "@/features/todo-search";

function Todo() {
  const { t } = useTranslation();
  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title={t("navigation.todoSearch")}
        rightContent={<HeaderRightActions />}
      />
      <TodoSearchScreen />
    </View>
  );
}

export default Todo;
