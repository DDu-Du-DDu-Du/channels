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
import { useThemeColorToken } from "@/hooks/use-theme-color";
import type { RepeatTodoRequestType } from "@/types/request/repeat-todo/repeat-todo";
import { formatDateToYYYYMMDD } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { RepeatTimeSelect, RepeatTypeSelect } from "./components";
import { useRepeatTodoCalendar, useRepeatTodoForm } from "./hooks";

export interface RepeatTodosheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  onClose: () => void;
  onDismiss?: () => void;
  repeatTodo?: RepeatTodoRequestType;
  sheetTitle: string;
  submitLabel?: string;
  onSubmit?: (repeatTodo: RepeatTodoRequestType) => void;
}

function RepeatTodosheet({
  bottomSheetRef,
  onClose,
  onDismiss,
  repeatTodo,
  sheetTitle,
  submitLabel = "반복 생성",
  onSubmit,
}: RepeatTodosheetProps) {
  const iconStroke = useThemeColorToken("ui.icon.default");
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
  } = useRepeatTodoForm();

  const {
    isStartCalendarOpen,
    isEndCalendarOpen,
    handleOpenStartCalendar,
    handleOpenEndCalendar,
    handleCloseStartCalendar,
    handleCloseEndCalendar,
    handleResetCalendar,
  } = useRepeatTodoCalendar();

  const [isTitleError, setIsTitleError] = useState(false);

  useEffect(() => {
    handleFillForm(repeatTodo);
    setIsTitleError(false);
  }, [handleFillForm, repeatTodo]);

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

    const repeatTodoRequest: RepeatTodoRequestType = {
      name: title,
      repeatType,
      startDate: formatDateToYYYYMMDD(startDate),
      endDate: formatDateToYYYYMMDD(endDate),
      beginAt,
      endAt,
      repeatDaysOfWeek: repeatType === "WEEKLY" ? selectedWeekDays : undefined,
      repeatDaysOfMonth:
        repeatType === "MONTHLY"
          ? (selectedMonthDays as RepeatTodoRequestType["repeatDaysOfMonth"])
          : undefined,
      lastDayOfMonth: repeatType === "MONTHLY" ? isLastDaySelected : undefined,
    };

    onSubmit?.(repeatTodoRequest);
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
        <View className="bg-role-surface-panel dark:bg-role-dark-surface-panel">
          <FormHeader
            title={sheetTitle}
            onPressBack={handleRequestCloseSheet}
            iconStroke={iconStroke}
            titleClassName="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
            className="px-[2rem] pb-[0.8rem] pt-[1.6rem]"
          />

          <View className="gap-[1.2rem] px-[2rem] pb-[2rem]">
            <View>
              <FormTitleInput
                value={title}
                onChangeText={handleChangeTitle}
                placeholder={"투두 제목"}
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
          onChangeTodoDate={(nextDate) => {
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
          onChangeTodoDate={(nextDate) => {
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

export default RepeatTodosheet;
