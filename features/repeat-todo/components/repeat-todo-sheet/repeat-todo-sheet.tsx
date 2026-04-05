import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";

import {
  BottomSheet,
  BottomSingleCalendar,
  Button,
  DateInputSet,
  FormHeader,
  FormTextInput,
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
  const closeReasonRef = useRef<"final-close" | "navigate-to-child-sheet">("final-close");
  const iconStroke = useThemeColorToken("ui.icon.default");
  const methods = useForm<{ title: string }>({
    defaultValues: {
      title: repeatTodo?.name ?? "",
    },
  });
  const {
    repeatType,
    startDate,
    endDate,
    beginAt,
    endAt,
    selectedWeekDays,
    selectedMonthDays,
    isLastDaySelected,
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

  useEffect(() => {
    handleFillForm(repeatTodo);
    methods.reset({ title: repeatTodo?.name ?? "" });
  }, [handleFillForm, methods, repeatTodo]);

  useEffect(() => {
    if (startDate > endDate) {
      setEndDate(startDate);
    }
  }, [endDate, setEndDate, startDate]);

  const handleResetSheetState = () => {
    handleResetForm();
    handleResetCalendar();
    methods.reset({ title: "" });
  };

  const handleDismissSheet = () => {
    if (closeReasonRef.current === "navigate-to-child-sheet") {
      closeReasonRef.current = "final-close";
      return;
    }

    handleResetSheetState();
    onDismiss?.();
  };

  const handleRequestCloseSheet = () => {
    closeReasonRef.current = "final-close";
    handleResetSheetState();
    onClose();
  };

  const handleConfirm = methods.handleSubmit(({ title }) => {
    const trimmedTitle = title.trim();
    const repeatTodoRequest: RepeatTodoRequestType = {
      name: trimmedTitle,
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
  });

  const handleOpenStartCalendarWithReason = () => {
    closeReasonRef.current = "navigate-to-child-sheet";
    handleOpenStartCalendar();
  };

  const handleOpenEndCalendarWithReason = () => {
    closeReasonRef.current = "navigate-to-child-sheet";
    handleOpenEndCalendar();
  };

  const handleCloseStartCalendarWithReopen = () => {
    handleCloseStartCalendar();
    closeReasonRef.current = "final-close";
    bottomSheetRef.current?.present();
  };

  const handleCloseEndCalendarWithReopen = () => {
    handleCloseEndCalendar();
    closeReasonRef.current = "final-close";
    bottomSheetRef.current?.present();
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

          <FormProvider {...methods}>
            <View className="gap-[1.2rem] px-[2rem] pb-[2rem]">
              <FormTextInput
                control={methods.control}
                name="title"
                placeholder={"투두 제목"}
                className="mt-[0.8rem]"
                required="제목을 입력해주세요"
                rules={{
                  validate: (value) =>
                    String(value ?? "").trim().length > 0 || "제목을 입력해주세요",
                }}
              />

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
                onPressStart={handleOpenStartCalendarWithReason}
                onPressEnd={handleOpenEndCalendarWithReason}
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
          </FormProvider>
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
            handleCloseStartCalendarWithReopen();
          }}
          showBackArrow
          handleCalendarSheetToggleOff={handleCloseStartCalendarWithReopen}
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
            handleCloseEndCalendarWithReopen();
          }}
          minDate={formatDateToYYYYMMDD(startDate)}
          showBackArrow
          handleCalendarSheetToggleOff={handleCloseEndCalendarWithReopen}
        />
      )}
    </>
  );
}

export default RepeatTodosheet;
