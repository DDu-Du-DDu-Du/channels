import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { BottomSheet, SpoqaText } from "@/components";
import { useToast } from "@/components/toast/hooks";
import { DDuDuReminderPanel } from "@/features/ddudu";
import { useBottomSheetAction } from "@/hooks";

export interface AlarmSheetProps {
  onClose: () => void;
  onConfirm?: (payload: { enabled: boolean; day: number; hour: number; minute: number }) => void;
  hasBeginTime?: boolean;
}

function AlarmSheet({ onClose, onConfirm, hasBeginTime = true }: AlarmSheetProps) {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();
  const { createToast } = useToast();
  const [enabled, setEnabled] = useState(false);
  const [dayBefore, setDayBefore] = useState(0);
  const [hourBefore, setHourBefore] = useState(0);
  const [minuteBefore, setMinuteBefore] = useState(0);
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  const handleToggleReminder = (nextEnabled: boolean) => {
    if (nextEnabled && !hasBeginTime) {
      const warning = "시작시간이 있어야 미리알림을 설정할 수 있어요.";
      setWarningMessage(warning);
      createToast(warning, { type: "warning" });
      return;
    }

    if (!nextEnabled) {
      setWarningMessage("");
    }

    setEnabled(nextEnabled);
  };

  const handleConfirm = () => {
    if (enabled && !hasBeginTime) {
      const warning = "시작시간을 먼저 설정해 주세요.";
      setWarningMessage(warning);
      createToast(warning, { type: "warning" });
      return;
    }

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
        <View className="mb-[0.6rem] px-[0.5rem] gap-[0.8rem]">
          <SpoqaText className="my-[0.6rem] font-spoqa-medium text-size15">미리알림 설정</SpoqaText>
          <DDuDuReminderPanel
            enabled={enabled}
            day={dayBefore}
            hour={hourBefore}
            minute={minuteBefore}
            warningMessage={warningMessage}
            onToggle={handleToggleReminder}
            onChangeDay={setDayBefore}
            onChangeHour={setHourBefore}
            onChangeMinute={setMinuteBefore}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={handleConfirm}
          className="z-1 mt-[1rem] h-[5rem] w-full items-center justify-center rounded-radius15 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg"
        >
          <SpoqaText
            weight="semiBold"
            className="text-role-text-inverse dark:text-role-dark-text-inverse"
          >
            확인
          </SpoqaText>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

export default AlarmSheet;
