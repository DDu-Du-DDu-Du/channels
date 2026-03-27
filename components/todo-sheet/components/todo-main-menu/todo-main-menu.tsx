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
          title="수정하기"
          onPress={handleCurrentTodoEdit}
        />
      )}
      {(isTodoDateNow || status === "COMPLETE") && (
        <SheetButton
          Icon={<ClockIcon />}
          title="투두시간"
          onPress={handleTodoTimeChange}
        />
      )}
      <SheetButton
        Icon={<DeleteIcon size={24} />}
        title="삭제하기"
        onPress={handleCurrentTodoDelete}
      />
    </View>
  );
}

export default TodoMainMenu;
