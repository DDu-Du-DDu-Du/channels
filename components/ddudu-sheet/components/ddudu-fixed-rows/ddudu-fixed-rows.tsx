import { View } from "react-native";

import SheetButton from "@/components/sheet-button/sheet-button";
import { DeleteIcon, EditIcon } from "@/icons";
import { remToPx } from "@/utils";

export interface DDuDuFixedRowsProps {
  type: "ddudu" | "schedule";
  dduduId: number;
  handleEditDDuDu: (id: number) => void;
  onDeleteDDuDu: (id: number) => void;
  handleDDuDuSheetToggleOff: () => void;
}

function DDuDuFixedRows({
  type,
  dduduId,
  handleEditDDuDu,
  onDeleteDDuDu,
  handleDDuDuSheetToggleOff,
}: DDuDuFixedRowsProps) {
  const handleCurrentDDuDuEdit = () => {
    if (type === "ddudu") {
      handleEditDDuDu(dduduId);
    }
    handleDDuDuSheetToggleOff();
  };

  const handleCurrentDDuDuDelete = () => {
    onDeleteDDuDu(dduduId);
  };

  return (
    <View className="flex flex-col w-full max-w-[50rem] gap-[0.2rem] pb-[1rem]">
      <SheetButton
        Icon={<EditIcon size={24} />}
        title="수정하기"
        buttonType="sub"
        style={{ paddingHorizontal: remToPx(1) }}
        onPress={handleCurrentDDuDuEdit}
      />
      <SheetButton
        Icon={<DeleteIcon size={24} />}
        title="삭제하기"
        buttonType="sub"
        style={{ paddingHorizontal: remToPx(1) }}
        onPress={handleCurrentDDuDuDelete}
      />
    </View>
  );
}

export default DDuDuFixedRows;
