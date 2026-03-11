import { useEffect, useState } from "react";
import { Pressable } from "react-native";

import { DDuDuTimeSheet, FormSection, TimeSet } from "@/components";
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
    currentDDuDuTime,
    handleOpenTimeSheet,
    handleCloseTimeSheet,
    handleChangeDDuDuTime,
  } = useRepeatTimeSelect({ beginAt, endAt, onChangeBeginAt, onChangeEndAt });

  return (
    <>
      <FormSection
        label={"시간 설정"}
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
        beginLabel={"시작시간"}
        endLabel={"종료시간"}
      />

      {isTimeSheetOpen && (
        <DDuDuTimeSheet
          title={"시간 설정"}
          currentDDuDuTime={currentDDuDuTime}
          onChangeDDuDuTime={(selectedTime) =>
            handleChangeDDuDuTime(selectedTime, isBeginTimeEnabled, isEndTimeEnabled)
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
