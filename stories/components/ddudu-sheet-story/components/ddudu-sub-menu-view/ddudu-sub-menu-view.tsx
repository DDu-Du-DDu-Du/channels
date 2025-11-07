import React from "react";
import { View } from "react-native";

import { SpoqaText } from "@/components";
import DDuDuSubMenu from "@/components/ddudu-sheet/components/ddudu-sub-menu/ddudu-sub-menu";
import type { DDuDuDetailType } from "@/components/ddudu-sheet/ddudu-sheet.types";
import { formatDateToYYYYMMDD } from "@/utils";

export interface DDuDuSubMenuViewProps {
  dduduDetail?: DDuDuDetailType;
  handleSelectDifferentDate?: (type: "change" | "repeat", currentDate: string) => void;
  handleAlarmSetting?: () => void;
  onRepeatCurrentDate?: () => void;
}

function DDuDuSubMenuView({
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
  handleSelectDifferentDate,
  handleAlarmSetting,
  onRepeatCurrentDate,
}: DDuDuSubMenuViewProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <DDuDuSubMenu
        dduduDetail={dduduDetail}
        handleSelectDifferentDate={(t, d) => handleSelectDifferentDate?.(t, d)}
        handleAlarmSetting={() => handleAlarmSetting?.()}
        onRepeatCurrentDate={() => onRepeatCurrentDate?.()}
      />
      <SpoqaText className="mt-4 text-example_gray_700">Sub menu preview</SpoqaText>
    </View>
  );
}

export default DDuDuSubMenuView;
