import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

import { FormSection, TimeSet, TodoTimeSheet } from "@/components";
import { ArrowRightIcon } from "@/icons";

import useRepeatTimeSelect from "./hooks/use-repeat-time-select/use-repeat-time-select";

export interface RepeatTimeSelectProps {
  beginAt?: string;
  endAt?: string;
  onChangeBeginAt: (value: string | undefined) => void;
  onChangeEndAt: (value: string | undefined) => void;
}

function RepeatTimeSelect({
  beginAt,
  endAt,
  onChangeBeginAt,
  onChangeEndAt,
}: RepeatTimeSelectProps) {
  const { t } = useTranslation();
  const [isBeginTimeEnabled, setIsBeginTimeEnabled] = useState(Boolean(beginAt));
  const [isEndTimeEnabled, setIsEndTimeEnabled] = useState(Boolean(endAt));

  useEffect(() => {
    const nextBeginEnabled = Boolean(beginAt);
    setIsBeginTimeEnabled(nextBeginEnabled);

    if (!nextBeginEnabled) {
      setIsEndTimeEnabled(false);
      return;
    }

    setIsEndTimeEnabled(Boolean(endAt));
  }, [beginAt, endAt]);

  const {
    isTimeSheetOpen,
    currentTodoTime,
    handleOpenTimeSheet,
    handleCloseTimeSheet,
    handleChangeTodoTime,
  } = useRepeatTimeSelect({ beginAt, endAt, onChangeBeginAt, onChangeEndAt });

  return (
    <>
      <FormSection
        label={t("repeatTodo.timeSetting")}
        labelClassName="text-size14 text-role-text-primary dark:text-role-dark-text-primary"
        rightContent={
          <Pressable onPress={handleOpenTimeSheet}>
            <ArrowRightIcon
              size={14}
              stroke="#000000"
            />
          </Pressable>
        }
      />

      <TimeSet
        beginAt={beginAt ? beginAt.slice(0, 5) : undefined}
        endAt={endAt ? endAt.slice(0, 5) : undefined}
        beginLabel={t("todo.timeSheet.startTime")}
        endLabel={t("todo.timeSheet.endTime")}
      />

      {isTimeSheetOpen && (
        <TodoTimeSheet
          title={t("repeatTodo.timeSetting")}
          currentTodoTime={currentTodoTime}
          onChangeTodoTime={(selectedTime) =>
            handleChangeTodoTime(selectedTime, isBeginTimeEnabled, isEndTimeEnabled)
          }
          onClose={handleCloseTimeSheet}
          showBackArrow
          onPressBack={handleCloseTimeSheet}
          defaultBeginTimeEnabled={isBeginTimeEnabled}
          defaultEndTimeEnabled={isEndTimeEnabled}
          onChangeBeginTimeEnabled={setIsBeginTimeEnabled}
          onChangeEndTimeEnabled={setIsEndTimeEnabled}
        />
      )}
    </>
  );
}

export default RepeatTimeSelect;
