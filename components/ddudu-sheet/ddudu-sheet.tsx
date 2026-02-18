import { useEffect } from "react";
import { View } from "react-native";

import { BottomSheet } from "@/components";
import { FEED_KEY } from "@/constants/query-key/query-key";
import { useBottomSheetAction } from "@/hooks";
import { getDDuDuDetail } from "@/service/feed/feed";
import { formatDateToYYYYMMDD } from "@/utils";
import { useQuery } from "@tanstack/react-query";

import { DDuDuActionGrid, DDuDuFixedRows } from "./components";
import type { DDuDuDetailType } from "./ddudu-sheet.types";

export interface DDuDuSheetProps {
  type?: "ddudu" | "schedule";
  dduduId: number;
  handleEditDDuDu: (id: number) => void;
  onDeleteDDuDu: (id: number) => void;
  handleDDuDuSheetToggleOff: () => void;
  handleSelectDifferentDate: (type: "change" | "repeat", currentDate: string) => void;
  handleAlarmSetting: (hasBeginAt: boolean) => void;
  handleDDuDuTimeSetting: (beginAt?: string, endAt?: string) => void;
  onRepeatCurrentDate: () => void;
  onChangeCurrentDate: () => void;
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
  onChangeCurrentDate,
}: DDuDuSheetProps) {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  const handleClose = () => {
    closeSheet();
    handleDDuDuSheetToggleOff();
  };

  const { data: dduduDetail } = useQuery<DDuDuDetailType | undefined>({
    queryKey: [FEED_KEY.DDUDU_DETAIL, dduduId],
    queryFn: () => getDDuDuDetail({ id: dduduId }),
    enabled: dduduId > 0,
  });

  const buildTopActions = (detail: DDuDuDetailType) => {
    const { scheduledOn, beginAt, endAt, status } = detail;
    const now = new Date();
    const today = formatDateToYYYYMMDD(now);
    const isToday = scheduledOn === today;

    let isPast = false;
    let isFuture = false;

    if (scheduledOn < today) {
      isPast = true;
    } else if (scheduledOn > today) {
      isFuture = true;
    } else if (!beginAt) {
      isFuture = true;
    } else {
      const currentDateTime = new Date(`${scheduledOn}T${beginAt}`);
      if (Number.isNaN(currentDateTime.getTime())) {
        isFuture = true;
      } else {
        isPast = currentDateTime <= now;
        isFuture = currentDateTime > now;
      }
    }

    const handleChangeToDifferentDate = () => {
      handleSelectDifferentDate("change", scheduledOn);
    };

    const handleRepeatToDifferentDate = () => {
      handleSelectDifferentDate("repeat", scheduledOn);
    };

    const handleOpenTimeSetting = () => {
      handleDDuDuTimeSetting(beginAt ?? undefined, endAt ?? undefined);
    };

    if (isPast && status === "UNCOMPLETED") {
      if (isToday) {
        return [
          {
            key: "change-another-day",
            title: "다른 날로 미루기",
            onPress: handleChangeToDifferentDate,
          },
          {
            key: "repeat-another-day",
            title: "다른 날 다시하기",
            onPress: handleRepeatToDifferentDate,
          },
          { key: "time-setting", title: "시간설정", onPress: handleOpenTimeSetting },
        ];
      }

      return [
        { key: "change-today", title: "오늘로 미루기", onPress: onChangeCurrentDate },
        {
          key: "change-another-day",
          title: "다른 날로 미루기",
          onPress: handleChangeToDifferentDate,
        },
        { key: "time-setting", title: "시간설정", onPress: handleOpenTimeSetting },
        { key: "repeat-today", title: "오늘 다시하기", onPress: onRepeatCurrentDate },
        {
          key: "repeat-another-day",
          title: "다른 날 다시하기",
          onPress: handleRepeatToDifferentDate,
        },
      ];
    }

    if (isPast && status === "COMPLETE") {
      if (isToday) {
        return [
          {
            key: "repeat-another-day",
            title: "다른 날 다시하기",
            onPress: handleRepeatToDifferentDate,
          },
          { key: "time-setting", title: "시간설정", onPress: handleOpenTimeSetting },
        ];
      }

      return [
        { key: "repeat-today", title: "오늘 다시하기", onPress: onRepeatCurrentDate },
        {
          key: "repeat-another-day",
          title: "다른 날 다시하기",
          onPress: handleRepeatToDifferentDate,
        },
        { key: "time-setting", title: "시간설정", onPress: handleOpenTimeSetting },
      ];
    }

    if (isFuture && status === "UNCOMPLETED") {
      return [
        { key: "change-date", title: "날짜 바꾸기", onPress: handleChangeToDifferentDate },
        { key: "copy-date", title: "복사하기", onPress: handleRepeatToDifferentDate },
        { key: "time-setting", title: "시간설정", onPress: handleOpenTimeSetting },
        {
          key: "alarm-setting",
          title: "미리알림",
          onPress: () => handleAlarmSetting(Boolean(beginAt)),
        },
      ];
    }

    if (isFuture && status === "COMPLETE") {
      return [
        { key: "change-date", title: "날짜 바꾸기", onPress: handleChangeToDifferentDate },
        { key: "copy-date", title: "복사하기", onPress: handleRepeatToDifferentDate },
        { key: "time-setting", title: "시간설정", onPress: handleOpenTimeSetting },
      ];
    }

    return [
      { key: "change-date", title: "날짜 바꾸기", onPress: handleChangeToDifferentDate },
      { key: "copy-date", title: "복사하기", onPress: handleRepeatToDifferentDate },
      { key: "time-setting", title: "시간설정", onPress: handleOpenTimeSetting },
    ];
  };

  return (
    <BottomSheet
      ref={ref}
      onClose={handleClose}
      fitContent
    >
      {dduduDetail && (
        <View className="w-full flex flex-col items-center gap-[1.4rem] px-[3rem] py-[1rem]">
          <DDuDuActionGrid actions={buildTopActions(dduduDetail)} />
          <DDuDuFixedRows
            type={type}
            dduduId={dduduId}
            handleEditDDuDu={handleEditDDuDu}
            onDeleteDDuDu={onDeleteDDuDu}
            handleDDuDuSheetToggleOff={handleClose}
          />
        </View>
      )}
    </BottomSheet>
  );
}

export default DDuDuSheet;
