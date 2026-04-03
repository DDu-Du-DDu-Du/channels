import { useEffect, useMemo, useState } from "react";

import type { TodoDetailType } from "@/components/todo-sheet/todo-sheet.types";

import type {
  TodoEditorReminderType,
  TodoEditorStateType,
  TodoEditorSubmitPayloadType,
} from "../../todo.types";

interface UseTodoEditorStateProps {
  mode: "create" | "edit";
  selectedDate: string;
  TodoDetail?: TodoDetailType;
}

const buildInitialState = ({
  selectedDate,
  TodoDetail,
}: {
  selectedDate: string;
  TodoDetail?: TodoDetailType;
}): TodoEditorStateType => {
  const formatApiTime = (time: string | null | undefined) => {
    if (!time) {
      return "";
    }

    const [hour = "00", minute = "00", second = "00"] = time.split(":");
    return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
  };

  const beginAt = formatApiTime(TodoDetail?.beginAt);
  const endAt = formatApiTime(TodoDetail?.endAt);
  const reminders = [...(TodoDetail?.reminders ?? [])].sort(
    (a, b) => new Date(a.remindsAt).getTime() - new Date(b.remindsAt).getTime(),
  );

  return {
    title: TodoDetail?.name ?? "",
    scheduledOn: TodoDetail?.scheduledOn ?? selectedDate,
    detailOpen: false,
    beginAt,
    endAt,
    isBeginTimeEnabled: Boolean(beginAt),
    isEndTimeEnabled: Boolean(endAt),
    reminders,
    memo: TodoDetail?.memo ?? "",
  };
};

const useTodoEditorState = ({ mode, selectedDate, TodoDetail }: UseTodoEditorStateProps) => {
  const initialState = useMemo(
    () => buildInitialState({ selectedDate, TodoDetail }),
    [TodoDetail, selectedDate],
  );

  const [state, setState] = useState<TodoEditorStateType>(initialState);
  const [titleWarning, setTitleWarning] = useState("");

  useEffect(() => {
    setState((prev) => ({
      ...initialState,
      detailOpen: prev.detailOpen,
    }));
    setTitleWarning("");
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
    }));
  };

  const handleChangeEndTimeEnabled = (enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      isEndTimeEnabled: enabled,
      endAt: enabled ? prev.endAt : "",
    }));
  };

  const sortReminders = (reminders: TodoEditorReminderType[]) =>
    [...reminders].sort(
      (a, b) => new Date(a.remindsAt).getTime() - new Date(b.remindsAt).getTime(),
    );

  const handleAppendReminder = (reminder: TodoEditorReminderType) => {
    setState((prev) => ({
      ...prev,
      reminders: sortReminders([...prev.reminders, reminder]),
    }));
  };

  const handleUpdateReminder = (index: number, reminder: TodoEditorReminderType) => {
    setState((prev) => ({
      ...prev,
      reminders: sortReminders(
        prev.reminders.map((item, itemIndex) => (itemIndex === index ? reminder : item)),
      ),
    }));
  };

  const handleRemoveReminder = (index: number) => {
    setState((prev) => ({
      ...prev,
      reminders: prev.reminders.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSetReminders = (reminders: TodoEditorReminderType[]) => {
    setState((prev) => ({
      ...prev,
      reminders: sortReminders(reminders),
    }));
  };

  const handleChangeMemo = (memo: string) => {
    setState((prev) => ({ ...prev, memo }));
  };

  const getSubmitPayload = (): TodoEditorSubmitPayloadType | null => {
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
      reminders: state.reminders,
      memo: state.memo,
    };
  };

  return {
    state,
    titleWarning,
    handleChangeTitle,
    handleChangeDate,
    handleToggleDetail,
    handleChangeTime,
    handleChangeBeginTimeEnabled,
    handleChangeEndTimeEnabled,
    handleAppendReminder,
    handleUpdateReminder,
    handleRemoveReminder,
    handleSetReminders,
    handleChangeMemo,
    getSubmitPayload,
  };
};

export default useTodoEditorState;
