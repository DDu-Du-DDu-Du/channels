import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { DDuDuSheet, SpoqaText } from "@/components";
import type { DDuDuDetailType } from "@/components/ddudu-sheet/ddudu-sheet.types";
import { FEED_KEY } from "@/constants/query-key/query-key";
import { formatDateToYYYYMMDD } from "@/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface DDuDuSheetViewProps {
  type?: "ddudu" | "schedule";
  dduduId?: number;
  handleEditDDuDu?: (id: number) => void;
  onDeleteDDuDu?: (id: number) => void;
  handleDDuDuSheetToggleOff?: () => void;
  handleSelectDifferentDate?: (type: "change" | "repeat", currentDate: string) => void;
  handleAlarmSetting?: () => void;
  handleDDuDuTimeSetting?: (beginAt?: string, endAt?: string) => void;
  onRepeatCurrentDate?: () => void;
}

function DDuDuSheetView({
  type = "ddudu",
  dduduId = 1,
  handleEditDDuDu,
  onDeleteDDuDu,
  handleDDuDuSheetToggleOff,
  handleSelectDifferentDate,
  handleAlarmSetting,
  handleDDuDuTimeSetting,
  onRepeatCurrentDate,
}: DDuDuSheetViewProps) {
  const [open, setOpen] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const detail: DDuDuDetailType = {
      id: dduduId,
      name: "Sample",
      status: "UNCOMPLETED",
      goalId: 1,
      repeatDduduId: 0,
      scheduledOn: formatDateToYYYYMMDD(new Date()),
      beginAt: null,
      endAt: null,
    };
    queryClient.setQueryData([FEED_KEY.DDUDU_DETAIL, dduduId], detail);
  }, [queryClient, dduduId]);

  return (
    <View className="flex-1 items-center justify-center p-4">
      {!open ? (
        <Pressable
          onPress={() => setOpen(true)}
          className="px-4 py-2 bg-example_gray_700 rounded-radius10"
        >
          <SpoqaText className="text-white">Open DDuDuSheet</SpoqaText>
        </Pressable>
      ) : (
        <QueryClientProvider client={queryClient}>
          <DDuDuSheet
            type={type}
            dduduId={dduduId}
            handleEditDDuDu={(id) => handleEditDDuDu?.(id)}
            onDeleteDDuDu={(id) => onDeleteDDuDu?.(id)}
            handleDDuDuSheetToggleOff={() => {
              handleDDuDuSheetToggleOff?.();
              setOpen(false);
            }}
            handleSelectDifferentDate={(t, d) => handleSelectDifferentDate?.(t, d)}
            handleAlarmSetting={() => handleAlarmSetting?.()}
            handleDDuDuTimeSetting={(b?, e?) => handleDDuDuTimeSetting?.(b, e)}
            onRepeatCurrentDate={() => onRepeatCurrentDate?.()}
          />
        </QueryClientProvider>
      )}
    </View>
  );
}

export default DDuDuSheetView;
