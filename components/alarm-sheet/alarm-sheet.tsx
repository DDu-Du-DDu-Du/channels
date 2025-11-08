import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { BottomSheet, SpoqaText } from "@/components";
import { useBottomSheetAction } from "@/hooks";

import { AlarmPickersRow, AlarmToggleRow } from "./components";

export interface AlarmSheetProps {
  onClose: () => void;
  onConfirm?: (payload: { enabled: boolean; day: number; hour: number; minute: number }) => void;
}

function AlarmSheet({ onClose, onConfirm }: AlarmSheetProps) {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();
  const [enabled, setEnabled] = useState(false);
  const [dayBefore, setDayBefore] = useState(0);
  const [hourBefore, setHourBefore] = useState(0);
  const [minuteBefore, setMinuteBefore] = useState(0);

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  const handleConfirm = () => {
    const payload = {
      enabled,
      day: dayBefore,
      hour: hourBefore,
      minute: minuteBefore,
    };
    onConfirm?.(payload);
    closeSheet();
    onClose();
  };

  return (
    <BottomSheet
      ref={ref}
      onClose={onClose}
      fitContent
    >
      <View className="w-full max-w-[50rem] p-[1rem]">
        <View className="mb-[0.6rem] px-[0.5rem]">
          <SpoqaText className="my-[0.6rem] font-spoqa-medium text-size15">알림설정</SpoqaText>
          <AlarmToggleRow
            enabled={enabled}
            onToggle={setEnabled}
          />
        </View>
        {enabled && (
          <AlarmPickersRow
            onDayChange={setDayBefore}
            onHourChange={setHourBefore}
            onMinuteChange={setMinuteBefore}
          />
        )}
        <Pressable
          accessibilityRole="button"
          onPress={handleConfirm}
          className="mt-[1rem] h-[5rem] w-full items-center justify-center rounded-radius15 bg-main z-1"
        >
          <SpoqaText
            weight="semiBold"
            className="text-white"
          >
            확인
          </SpoqaText>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

export default AlarmSheet;
