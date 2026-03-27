import { View } from "react-native";

import SheetButton from "@/components/sheet-button/sheet-button";
import { DeleteIcon, EditIcon } from "@/icons";
import { remToPx } from "@/utils";

export interface TodoFixedRowsProps {
  type: "Todo" | "schedule";
  TodoId: number;
  handleEditTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  handleTodosheetToggleOff: () => void;
}

function TodoFixedRows({
  type,
  TodoId,
  handleEditTodo,
  onDeleteTodo,
  handleTodosheetToggleOff,
}: TodoFixedRowsProps) {
  const handleCurrentTodoEdit = () => {
    if (type === "Todo") {
      handleEditTodo(TodoId);
    }
    handleTodosheetToggleOff();
  };

  const handleCurrentTodoDelete = () => {
    onDeleteTodo(TodoId);
  };

  return (
    <View className="flex flex-col w-full max-w-[50rem] gap-[0.2rem] pb-[1rem]">
      <SheetButton
        Icon={<EditIcon size={24} />}
        title="수정하기"
        buttonType="sub"
        style={{ paddingHorizontal: remToPx(1) }}
        onPress={handleCurrentTodoEdit}
      />
      <SheetButton
        Icon={<DeleteIcon size={24} />}
        title="삭제하기"
        buttonType="sub"
        style={{ paddingHorizontal: remToPx(1) }}
        onPress={handleCurrentTodoDelete}
      />
    </View>
  );
}

export default TodoFixedRows;
