import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";

import { BottomSingleCalendar, SpoqaText } from "@/components";
import { formatDateToYYYYMMDD } from "@/utils";

export interface BottomSingleCalendarViewProps {
  handleCalendarSheetToggleOff?: () => void;
  onChangeDDuDuDate?: (selectedDate: Date) => void;
  noInitialSelected?: boolean;
}

function BottomSingleCalendarView({
  handleCalendarSheetToggleOff,
  onChangeDDuDuDate,
  noInitialSelected = false,
}: BottomSingleCalendarViewProps) {
  const [open, setOpen] = useState(false);
  const today = useMemo(() => new Date(), []);
  const [selected, setSelected] = useState<Date | undefined>(noInitialSelected ? undefined : today);
  const currentDate = useMemo(() => formatDateToYYYYMMDD(today), [today]);

  return (
    <View className="flex-1 items-center justify-center p-4">
      {!open ? (
        <Pressable
          onPress={() => setOpen(true)}
          className="px-4 py-2 bg-example_gray_700 rounded-radius10"
        >
          <SpoqaText className="text-white">달력 시트 열기</SpoqaText>
        </Pressable>
      ) : (
        <BottomSingleCalendar
          currentDate={currentDate}
          selectedDate={selected}
          setSelected={setSelected}
          onChangeDDuDuDate={(date) => {
            onChangeDDuDuDate?.(date);
          }}
          handleCalendarSheetToggleOff={() => {
            handleCalendarSheetToggleOff?.();
            setOpen(false);
          }}
        />
      )}
    </View>
  );
}

export default BottomSingleCalendarView;
