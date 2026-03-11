import { useEffect, useState } from "react";
import { View } from "react-native";

import {
  BottomSheet,
  BottomSingleCalendar,
  Button,
  DateInputSet,
  FormHeader,
  FormTitleInput,
  SpoqaText,
} from "@/components";
import type { RepeatDduduRequestType } from "@/types/request/repeat-ddudu/repeat-ddudu";
import { formatDateToYYYYMMDD } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { RepeatTimeSelect, RepeatTypeSelect } from "./components";
import { useRepeatDduduCalendar, useRepeatDduduForm } from "./hooks";

export interface RepeatDduduSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  onClose: () => void;
  onDismiss?: () => void;
  repeatDdudu?: RepeatDduduRequestType;
  sheetTitle: string;
  submitLabel?: string;
  onSubmit?: (repeatDdudu: RepeatDduduRequestType) => void;
}

function RepeatDduduSheet({
  bottomSheetRef,
  onClose,
  onDismiss,
  repeatDdudu,
  sheetTitle,
  submitLabel = "반복 생성",
  onSubmit,
}: RepeatDduduSheetProps) {
  const {
    title,
    repeatType,
    startDate,
    endDate,
    beginAt,
    endAt,
    selectedWeekDays,
    selectedMonthDays,
    isLastDaySelected,
    setTitle,
    setRepeatType,
    setStartDate,
    setEndDate,
    setBeginAt,
    setEndAt,
    handleToggleWeekDay,
    handleToggleMonthDay,
    handleToggleLastDay,
    handleResetForm,
    handleFillForm,
  } = useRepeatDduduForm();

  const {
    isStartCalendarOpen,
    isEndCalendarOpen,
    handleOpenStartCalendar,
    handleOpenEndCalendar,
    handleCloseStartCalendar,
    handleCloseEndCalendar,
    handleResetCalendar,
  } = useRepeatDduduCalendar();

  const [isTitleError, setIsTitleError] = useState(false);

  useEffect(() => {
    handleFillForm(repeatDdudu);
    setIsTitleError(false);
  }, [handleFillForm, repeatDdudu]);

  useEffect(() => {
    if (startDate > endDate) {
      setEndDate(startDate);
    }
  }, [endDate, setEndDate, startDate]);

  const handleDismissSheet = () => {
    handleResetForm();
    handleResetCalendar();
    setIsTitleError(false);
    onDismiss?.();
  };

  const handleRequestCloseSheet = () => {
    handleResetForm();
    handleResetCalendar();
    setIsTitleError(false);
    onClose();
  };

  const handleChangeTitle = (text: string) => {
    setTitle(text);

    if (text.trim().length > 0) {
      setIsTitleError(false);
    }
  };

  const handleConfirm = () => {
    if (!title.trim()) {
      setIsTitleError(true);
      return;
    }

    const repeatDduduRequest: RepeatDduduRequestType = {
      name: title,
      repeatType,
      startDate: formatDateToYYYYMMDD(startDate),
      endDate: formatDateToYYYYMMDD(endDate),
      beginAt,
      endAt,
      repeatDaysOfWeek: repeatType === "WEEKLY" ? selectedWeekDays : undefined,
      repeatDaysOfMonth:
        repeatType === "MONTHLY"
          ? (selectedMonthDays as RepeatDduduRequestType["repeatDaysOfMonth"])
          : undefined,
      lastDayOfMonth: repeatType === "MONTHLY" ? isLastDaySelected : undefined,
    };

    onSubmit?.(repeatDduduRequest);
    handleRequestCloseSheet();
  };

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        onClose={handleDismissSheet}
        defaultHeight="90%"
        maxHeight="90%"
      >
        <FormHeader
          title={sheetTitle}
          onPressBack={handleRequestCloseSheet}
          iconStroke="#000000"
          titleClassName="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
          className="px-[2rem] pb-[0.8rem] pt-[1.6rem]"
        />

        <View className="gap-[1.2rem] px-[2rem] pb-[2rem]">
          <View>
            <FormTitleInput
              value={title}
              onChangeText={handleChangeTitle}
              placeholder={"뚜두 제목"}
              className="mt-[0.8rem]"
            />
            {isTitleError && (
              <SpoqaText className="mt-[0.6rem] text-size12 text-role-status-error dark:text-role-dark-status-error">
                {"제목을 입력해주세요"}
              </SpoqaText>
            )}
          </View>

          <RepeatTypeSelect
            repeatType={repeatType}
            onChangeRepeatType={setRepeatType}
            selectedWeekDays={selectedWeekDays}
            onToggleWeekDay={handleToggleWeekDay}
            selectedMonthDays={selectedMonthDays}
            onToggleMonthDay={handleToggleMonthDay}
            isLastDaySelected={isLastDaySelected}
            onToggleLastDay={handleToggleLastDay}
          />

          <DateInputSet
            startDate={formatDateToYYYYMMDD(startDate)}
            endDate={formatDateToYYYYMMDD(endDate)}
            startLabel={"시작일"}
            endLabel={"종료일"}
            onPressStart={handleOpenStartCalendar}
            onPressEnd={handleOpenEndCalendar}
          />

          <RepeatTimeSelect
            beginAt={beginAt}
            endAt={endAt}
            onChangeBeginAt={setBeginAt}
            onChangeEndAt={setEndAt}
          />

          <Button
            label={submitLabel}
            bodyClassName="bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg"
            labelClassName="text-role-text-inverse dark:text-role-dark-text-inverse"
            onPress={handleConfirm}
          />
        </View>
      </BottomSheet>

      {isStartCalendarOpen && (
        <BottomSingleCalendar
          currentDate={formatDateToYYYYMMDD(startDate)}
          selectedDate={startDate}
          setSelected={(nextDate) => {
            if (nextDate) {
              setStartDate(nextDate);
            }
          }}
          onChangeDDuDuDate={(nextDate) => {
            setStartDate(nextDate);
            if (endDate < nextDate) {
              setEndDate(nextDate);
            }
            handleCloseStartCalendar();
          }}
          showBackArrow
          handleCalendarSheetToggleOff={handleCloseStartCalendar}
        />
      )}

      {isEndCalendarOpen && (
        <BottomSingleCalendar
          currentDate={formatDateToYYYYMMDD(endDate)}
          selectedDate={endDate}
          setSelected={(nextDate) => {
            if (nextDate) {
              setEndDate(nextDate);
            }
          }}
          onChangeDDuDuDate={(nextDate) => {
            setEndDate(nextDate);
            handleCloseEndCalendar();
          }}
          minDate={formatDateToYYYYMMDD(startDate)}
          showBackArrow
          handleCalendarSheetToggleOff={handleCloseEndCalendar}
        />
      )}
    </>
  );
}

export default RepeatDduduSheet;
