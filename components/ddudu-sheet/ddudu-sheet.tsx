import { useEffect } from "react";
import { View } from "react-native";

import { BottomSheet } from "@/components";
import { FEED_KEY } from "@/constants/query-key/query-key";
import { useBottomSheetAction } from "@/hooks";
import { getDDuDuDetail } from "@/service/feed/feed";
import { useQuery } from "@tanstack/react-query";

import { DDuDuMainMenu, DDuDuSubMenu } from "./components";
import type { DDuDuDetailType } from "./ddudu-sheet.types";

export interface DDuDuSheetProps {
  type?: "ddudu" | "schedule";
  dduduId: number;
  handleEditDDuDu: (id: number) => void;
  onDeleteDDuDu: (id: number) => void;
  handleDDuDuSheetToggleOff: () => void;
  handleSelectDifferentDate: (type: "change" | "repeat", currentDate: string) => void;
  handleAlarmSetting: () => void;
  handleDDuDuTimeSetting: (beginAt?: string, endAt?: string) => void;
  onRepeatCurrentDate: () => void;
}

function DDuDuSheet({
  type = "ddudu",
  dduduId,
  handleEditDDuDu,
  onDeleteDDuDu,
  handleDDuDuSheetToggleOff,
  handleSelectDifferentDate,
  handleAlarmSetting,
  handleDDuDuTimeSetting,
  onRepeatCurrentDate,
}: DDuDuSheetProps) {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  const handleClose = () => {
    closeSheet();
    handleDDuDuSheetToggleOff();
  };

  // TODO(auth): Wire access token/session and enable query when auth is ready.
  const { data: dduduDetail } = useQuery<DDuDuDetailType | undefined>({
    queryKey: [FEED_KEY.DDUDU_DETAIL, dduduId],
    queryFn: () => getDDuDuDetail({ accessToken: "", id: dduduId }),
    enabled: false,
  });

  return (
    <BottomSheet
      ref={ref}
      onClose={handleClose}
      fitContent
    >
      {dduduDetail && (
        <View className="w-full flex flex-col items-center gap-[2rem] px-[3rem] py-[1rem]">
          <DDuDuMainMenu
            type={type}
            dduduId={dduduId}
            dduduDetail={dduduDetail}
            handleEditDDuDu={handleEditDDuDu}
            onDeleteDDuDu={onDeleteDDuDu}
            handleDDuDuTimeSetting={handleDDuDuTimeSetting}
            handleDDuDuSheetToggleOff={handleClose}
          />
          <DDuDuSubMenu
            dduduDetail={dduduDetail}
            handleSelectDifferentDate={handleSelectDifferentDate}
            handleAlarmSetting={handleAlarmSetting}
            onRepeatCurrentDate={onRepeatCurrentDate}
          />
        </View>
      )}
    </BottomSheet>
  );
}

export default DDuDuSheet;
