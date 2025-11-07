import React from "react";
import { View } from "react-native";

import { SpoqaText } from "@/components";
import DDuDuMainMenu from "@/components/ddudu-sheet/components/ddudu-main-menu/ddudu-main-menu";
import type { DDuDuDetailType } from "@/components/ddudu-sheet/ddudu-sheet.types";
import { formatDateToYYYYMMDD } from "@/utils";

export interface DDuDuMainMenuViewProps {
  type?: "ddudu" | "schedule";
  dduduId?: number;
  dduduDetail?: DDuDuDetailType;
  handleEditDDuDu?: (id: number) => void;
  onDeleteDDuDu?: (id: number) => void;
  handleDDuDuTimeSetting?: (beginAt?: string, endAt?: string) => void;
  handleDDuDuSheetToggleOff?: () => void;
}

function DDuDuMainMenuView({
  type = "ddudu",
  dduduId = 1,
  dduduDetail = {
    id: 1,
    name: "Sample",
    status: "UNCOMPLETED",
    goalId: 1,
    repeatDduduId: 0,
    scheduledOn: formatDateToYYYYMMDD(new Date()),
    beginAt: null,
    endAt: null,
  },
  handleEditDDuDu,
  onDeleteDDuDu,
  handleDDuDuTimeSetting,
  handleDDuDuSheetToggleOff,
}: DDuDuMainMenuViewProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <DDuDuMainMenu
        type={type}
        dduduId={dduduId}
        dduduDetail={dduduDetail}
        handleEditDDuDu={(id) => handleEditDDuDu?.(id)}
        onDeleteDDuDu={(id) => onDeleteDDuDu?.(id)}
        handleDDuDuTimeSetting={(b?, e?) => handleDDuDuTimeSetting?.(b, e)}
        handleDDuDuSheetToggleOff={() => handleDDuDuSheetToggleOff?.()}
      />
      <SpoqaText className="mt-4 text-example_gray_700">Main menu preview</SpoqaText>
    </View>
  );
}

export default DDuDuMainMenuView;
