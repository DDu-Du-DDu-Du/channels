import { useEffect } from "react";
import { Pressable, View } from "react-native";

import { BottomSheet, SpoqaText } from "@/components";
import { DDuDuTimeRangeType, DDuDuTimeType } from "@/features/feed/feed.types";
import { useBottomSheetAction } from "@/hooks";

import TimePicker from "../time-picker/time-picker";
import { DDUDU_TIME_SHEET } from "./ddudu-time-sheet.constant";
import { useTimeUpdate } from "./hooks";

export interface DDuDuTimeSheetProps {
  currentDDuDuTime: DDuDuTimeType;
  onChangeDDuDuTime: (selectedTime: DDuDuTimeRangeType) => void;
  onClose: () => void;
}

function DDuDuTimeSheet({ currentDDuDuTime, onChangeDDuDuTime, onClose }: DDuDuTimeSheetProps) {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();
  const {
    beginHour,
    beginMin,
    endHour,
    endMin,
    isErrorMessage,
    handleDDuDuTimeChange,
    handleChangeBeginHour,
    handleChangeBeginMin,
    handleChangeEndHour,
    handleChangeEndMin,
  } = useTimeUpdate({ currentDDuDuTime, onChangeDDuDuTime });

  useEffect(() => {
    openSheet();
  }, [openSheet]);

  const handleConfirm = () => {
    handleDDuDuTimeChange();
    closeSheet();
    onClose();
  };

  return (
    <BottomSheet
      ref={ref}
      onClose={onClose}
      fitContent
      enablePanDownToClose={false}
    >
      <View className="w-full max-w-[50rem] p-[2.4rem]">
        <View className="mb-[1.2rem]">
          <SpoqaText
            weight="medium"
            className="mb-[0.6rem] text-size15"
          >
            뚜두시간 설정
          </SpoqaText>
          <View className="flex-row flex-wrap justify-center bg-white_100 p-[1.6rem] rounded-radius10 gap-[1.5rem]">
            <View className="mr-[1rem]">
              <SpoqaText className="text-size13 mb-[1rem]">시작시간</SpoqaText>
              <View className="flex-row items-center gap-[0.5rem]">
                <TimePicker
                  type="hour"
                  onChange={handleChangeBeginHour}
                  value={beginHour}
                  width={50}
                />
                <TimePicker
                  type="min"
                  onChange={handleChangeBeginMin}
                  value={beginMin}
                  width={50}
                />
              </View>
            </View>
            <View>
              <SpoqaText className="text-size13 mb-[1rem]">종료시간</SpoqaText>
              <View className="flex-row item-center gap-[0.5rem]">
                <TimePicker
                  type="hour"
                  onChange={handleChangeEndHour}
                  value={endHour}
                  width={50}
                />
                <TimePicker
                  type="min"
                  onChange={handleChangeEndMin}
                  value={endMin}
                  width={50}
                />
              </View>
            </View>
          </View>
          {isErrorMessage ? (
            <SpoqaText className="text-example_red_500 mt-[0.8rem]">
              {DDUDU_TIME_SHEET.TIME_RANGE_ERROR_MESSAGE}
            </SpoqaText>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleConfirm}
          className="h-[5rem] w-full items-center justify-center rounded-radius15 bg-main z-1"
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

export default DDuDuTimeSheet;
