import { useTranslation } from "react-i18next";
import { View } from "react-native";

import SheetButton from "@/components/sheet-button/sheet-button";
import { ClockIcon, DeleteIcon, EditIcon } from "@/icons";
import { formatDateToYYYYMMDD } from "@/utils";

import type { TodoDetailType } from "../../todo-sheet.types";

export interface TodoMainMenuProps {
  type: "Todo" | "schedule";
  TodoId: number;
  TodoDetail: TodoDetailType;
  handleEditTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  handleTodoTimeSetting: (beginAt?: string, endAt?: string) => void;
  handleTodosheetToggleOff: () => void;
}

function TodoMainMenu({
  type,
  TodoId,
  TodoDetail,
  handleEditTodo,
  onDeleteTodo,
  handleTodoTimeSetting,
  handleTodosheetToggleOff,
}: TodoMainMenuProps) {
  const { t } = useTranslation();
  const { beginAt, endAt, scheduledOn, status } = TodoDetail;
  const isTodoDateNow = formatDateToYYYYMMDD(new Date()) === scheduledOn;

  const handleCurrentTodoEdit = () => {
    handleEditTodo(TodoId);
    handleTodosheetToggleOff();
  };

  const handleCurrentTodoDelete = () => {
    onDeleteTodo(TodoId);
  };

  const handleTodoTimeChange = () => {
    handleTodoTimeSetting(beginAt ?? undefined, endAt ?? undefined);
  };

  return (
    <View className="flex-row w-full gap-4 max-w-[50rem]">
      {type === "Todo" && (
        <SheetButton
          Icon={<EditIcon size={24} />}
          title={t("todo.actions.edit")}
          onPress={handleCurrentTodoEdit}
        />
      )}
      {(isTodoDateNow || status === "COMPLETE") && (
        <SheetButton
          Icon={<ClockIcon />}
          title={t("todo.actions.todoTime")}
          onPress={handleTodoTimeChange}
        />
      )}
      <SheetButton
        Icon={<DeleteIcon size={24} />}
        title={t("todo.actions.delete")}
        onPress={handleCurrentTodoDelete}
      />
    </View>
  );
}

export default TodoMainMenu;
