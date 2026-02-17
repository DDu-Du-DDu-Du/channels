import { useEffect, useMemo, useState } from "react";

import type { DDuDuDetailType } from "@/components/ddudu-sheet/ddudu-sheet.types";

import type { DDuDuEditorStateType, DDuDuEditorSubmitPayloadType } from "../../ddudu.types";

interface UseDDuDuEditorStateProps {
  mode: "create" | "edit";
  selectedDate: string;
  dduduDetail?: DDuDuDetailType;
}

const buildInitialState = ({
  selectedDate,
  dduduDetail,
}: {
  selectedDate: string;
  dduduDetail?: DDuDuDetailType;
}): DDuDuEditorStateType => {
  const formatApiTime = (time: string | null | undefined) => {
    if (!time) {
      return "";
    }

    const [hour = "00", minute = "00", second = "00"] = time.split(":");
    return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
  };

  const beginAt = formatApiTime(dduduDetail?.beginAt);
  const endAt = formatApiTime(dduduDetail?.endAt);

  return {
    title: dduduDetail?.name ?? "",
    scheduledOn: dduduDetail?.scheduledOn ?? selectedDate,
    detailOpen: false,
    beginAt,
    endAt,
    isBeginTimeEnabled: Boolean(beginAt),
    isEndTimeEnabled: Boolean(endAt),
    reminder: {
      enabled: false,
      day: 0,
      hour: 0,
      minute: 0,
    },
    memo: "",
  };
};

const useDDuDuEditorState = ({ mode, selectedDate, dduduDetail }: UseDDuDuEditorStateProps) => {
  const initialState = useMemo(
    () => buildInitialState({ selectedDate, dduduDetail }),
    [dduduDetail, selectedDate],
  );

  const [state, setState] = useState<DDuDuEditorStateType>(initialState);
  const [titleWarning, setTitleWarning] = useState("");
  const [reminderWarning, setReminderWarning] = useState("");

  useEffect(() => {
    setState(initialState);
    setTitleWarning("");
    setReminderWarning("");
  }, [initialState, mode]);

  const handleChangeTitle = (title: string) => {
    setState((prev) => ({ ...prev, title }));
    if (title.trim().length > 0) {
      setTitleWarning("");
    }
  };

  const handleChangeDate = (scheduledOn: string) => {
    setState((prev) => ({ ...prev, scheduledOn }));
  };

  const handleToggleDetail = () => {
    setState((prev) => ({ ...prev, detailOpen: !prev.detailOpen }));
  };

  const handleChangeTime = (beginAt: string, endAt: string) => {
    setState((prev) => ({
      ...prev,
      beginAt,
      endAt,
      isBeginTimeEnabled: Boolean(beginAt),
      isEndTimeEnabled: Boolean(endAt),
    }));
  };

  const handleChangeBeginTimeEnabled = (enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      isBeginTimeEnabled: enabled,
      isEndTimeEnabled: enabled ? prev.isEndTimeEnabled : false,
      beginAt: enabled ? prev.beginAt : "",
      endAt: enabled ? prev.endAt : "",
      reminder: {
        ...prev.reminder,
        enabled: enabled ? prev.reminder.enabled : false,
      },
    }));

    if (!enabled) {
      setReminderWarning("");
    }
  };

  const handleChangeEndTimeEnabled = (enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      isEndTimeEnabled: enabled,
      endAt: enabled ? prev.endAt : "",
    }));
  };

  const handleToggleReminder = (enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      reminder: {
        ...prev.reminder,
        enabled,
      },
    }));

    if (!enabled) {
      setReminderWarning("");
    }
  };

  const handleChangeReminderValue = (field: "day" | "hour" | "minute", value: number) => {
    setState((prev) => ({
      ...prev,
      reminder: {
        ...prev.reminder,
        [field]: value,
      },
    }));
  };

  const handleChangeMemo = (memo: string) => {
    setState((prev) => ({ ...prev, memo }));
  };

  const handleSetReminderWarning = (message: string) => {
    setReminderWarning(message);
  };

  const getSubmitPayload = (): DDuDuEditorSubmitPayloadType | null => {
    if (!state.title.trim()) {
      setTitleWarning("제목을 입력해주세요.");
      return null;
    }

    return {
      title: state.title.trim(),
      scheduledOn: state.scheduledOn,
      beginAt: state.beginAt,
      endAt: state.endAt,
      isBeginTimeEnabled: state.isBeginTimeEnabled,
      isEndTimeEnabled: state.isEndTimeEnabled,
      reminder: state.reminder,
      memo: state.memo,
    };
  };

  return {
    state,
    titleWarning,
    reminderWarning,
    handleChangeTitle,
    handleChangeDate,
    handleToggleDetail,
    handleChangeTime,
    handleChangeBeginTimeEnabled,
    handleChangeEndTimeEnabled,
    handleToggleReminder,
    handleChangeReminderValue,
    handleChangeMemo,
    handleSetReminderWarning,
    getSubmitPayload,
  };
};

export default useDDuDuEditorState;
