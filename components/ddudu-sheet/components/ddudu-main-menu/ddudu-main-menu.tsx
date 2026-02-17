import { View } from "react-native";

import SheetButton from "@/components/sheet-button/sheet-button";
import { ClockIcon, DeleteIcon, EditIcon } from "@/icons";
import { formatDateToYYYYMMDD } from "@/utils";

import type { DDuDuDetailType } from "../../ddudu-sheet.types";

export interface DDuDuMainMenuProps {
  type: "ddudu" | "schedule";
  dduduId: number;
  dduduDetail: DDuDuDetailType;
  handleEditDDuDu: (id: number) => void;
  onDeleteDDuDu: (id: number) => void;
  handleDDuDuTimeSetting: (beginAt?: string, endAt?: string) => void;
  handleDDuDuSheetToggleOff: () => void;
}

function DDuDuMainMenu({
  type,
  dduduId,
  dduduDetail,
  handleEditDDuDu,
  onDeleteDDuDu,
  handleDDuDuTimeSetting,
  handleDDuDuSheetToggleOff,
}: DDuDuMainMenuProps) {
  const { beginAt, endAt, scheduledOn, status } = dduduDetail;
  const isDDuDuDateNow = formatDateToYYYYMMDD(new Date()) === scheduledOn;

  const handleCurrentDDuDuEdit = () => {
    handleEditDDuDu(dduduId);
    handleDDuDuSheetToggleOff();
  };

  const handleCurrentDDuDuDelete = () => {
    onDeleteDDuDu(dduduId);
  };

  const handleDDuDuTimeChange = () => {
    handleDDuDuTimeSetting(beginAt ?? undefined, endAt ?? undefined);
  };

  return (
    <View className="flex-row w-full gap-4 max-w-[50rem]">
      {type === "ddudu" && (
        <SheetButton
          Icon={<EditIcon size={24} />}
          title="수정하기"
          onPress={handleCurrentDDuDuEdit}
        />
      )}
      {(isDDuDuDateNow || status === "COMPLETE") && (
        <SheetButton
          Icon={<ClockIcon />}
          title="뚜두시간"
          onPress={handleDDuDuTimeChange}
        />
      )}
      <SheetButton
        Icon={<DeleteIcon size={24} />}
        title="삭제하기"
        onPress={handleCurrentDDuDuDelete}
      />
    </View>
  );
}

export default DDuDuMainMenu;
