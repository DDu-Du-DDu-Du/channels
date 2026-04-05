import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import type { TodoDetailType } from "@/components/todo-sheet/todo-sheet.types";
import { parseUtc } from "@/utils";

import type { TodoEditorReminderType, TodoEditorSubmitPayloadType } from "../../../../todo.types";

export interface TodoEditorFormValues {
  goalId: number;
  title: string;
  scheduledOn: string;
  beginAt: string;
  endAt: string;
  isBeginTimeEnabled: boolean;
  isEndTimeEnabled: boolean;
  reminders: TodoEditorReminderType[];
  memo: string;
}

interface UseTodoEditorFormStateProps {
  mode: "create" | "edit";
  selectedDate: string;
  TodoDetail?: TodoDetailType;
  initialGoalId?: number;
  selectedDateFromSheet?: string;
  selectedGoalIdFromSheet?: number;
}

const parseTime = (time: string) => {
  if (!time) {
    return { hour: 0, min: 0 };
  }

  const [hourRaw = "0", minRaw = "0"] = time.split(":");
  const hour = Number(hourRaw);
  const min = Number(minRaw);

  return {
    hour: Number.isFinite(hour) ? hour : 0,
    min: Number.isFinite(min) ? min : 0,
  };
};

const sortReminders = (reminders: TodoEditorReminderType[]) =>
  [...reminders].sort((a, b) => new Date(a.remindsAt).getTime() - new Date(b.remindsAt).getTime());

const formatApiTime = (time: string | null | undefined) => {
  if (!time) {
    return "";
  }

  const [hour = "00", minute = "00", second = "00"] = time.split(":");
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
};

const buildInitialValues = ({
  selectedDate,
  TodoDetail,
  initialGoalId,
}: {
  selectedDate: string;
  TodoDetail?: TodoDetailType;
  initialGoalId?: number;
}): TodoEditorFormValues => {
  const beginAt = formatApiTime(TodoDetail?.beginAt);
  const endAt = formatApiTime(TodoDetail?.endAt);

  return {
    goalId: TodoDetail?.goalId ?? initialGoalId ?? 0,
    title: TodoDetail?.name ?? "",
    scheduledOn: TodoDetail?.scheduledOn ?? selectedDate,
    beginAt,
    endAt,
    isBeginTimeEnabled: Boolean(beginAt),
    isEndTimeEnabled: Boolean(endAt),
    reminders: sortReminders([...(TodoDetail?.reminders ?? [])]),
    memo: TodoDetail?.memo ?? "",
  };
};

function useTodoEditorFormState({
  mode,
  selectedDate,
  TodoDetail,
  initialGoalId,
  selectedDateFromSheet,
  selectedGoalIdFromSheet,
}: UseTodoEditorFormStateProps) {
  const initialValues = useMemo(
    () => buildInitialValues({ selectedDate, TodoDetail, initialGoalId }),
    [TodoDetail, initialGoalId, selectedDate],
  );

  const methods = useForm<TodoEditorFormValues>({
    defaultValues: initialValues,
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [titleWarning, setTitleWarning] = useState("");

  const goalId = useWatch({ control: methods.control, name: "goalId" }) ?? 0;
  const title = useWatch({ control: methods.control, name: "title" }) ?? "";
  const scheduledOn = useWatch({ control: methods.control, name: "scheduledOn" }) ?? "";
  const beginAt = useWatch({ control: methods.control, name: "beginAt" }) ?? "";
  const endAt = useWatch({ control: methods.control, name: "endAt" }) ?? "";
  const isBeginTimeEnabled =
    useWatch({ control: methods.control, name: "isBeginTimeEnabled" }) ?? false;
  const isEndTimeEnabled =
    useWatch({ control: methods.control, name: "isEndTimeEnabled" }) ?? false;
  const reminders = useWatch({ control: methods.control, name: "reminders" }) ?? [];
  const memo = useWatch({ control: methods.control, name: "memo" }) ?? "";

  const { hour: beginHour, min: beginMin } = useMemo(() => parseTime(beginAt), [beginAt]);
  const { hour: endHour, min: endMin } = useMemo(() => parseTime(endAt), [endAt]);

  const isTimeRangeInvalid = useMemo(() => {
    if (!isBeginTimeEnabled || !isEndTimeEnabled) {
      return false;
    }

    const begin = beginHour * 60 + beginMin;
    const end = endHour * 60 + endMin;
    return end < begin;
  }, [beginHour, beginMin, endHour, endMin, isBeginTimeEnabled, isEndTimeEnabled]);

  useEffect(() => {
    methods.reset(initialValues);
    setTitleWarning("");
  }, [initialValues, methods, mode]);

  useEffect(() => {
    if (title.trim().length > 0) {
      setTitleWarning("");
    }
  }, [title]);

  useEffect(() => {
    if (!selectedDateFromSheet) {
      return;
    }

    if (methods.getValues("scheduledOn") !== selectedDateFromSheet) {
      methods.setValue("scheduledOn", selectedDateFromSheet);
    }
  }, [methods, selectedDateFromSheet]);

  useEffect(() => {
    if (selectedGoalIdFromSheet === undefined) {
      return;
    }

    if (methods.getValues("goalId") !== selectedGoalIdFromSheet) {
      methods.setValue("goalId", selectedGoalIdFromSheet);
    }
  }, [methods, selectedGoalIdFromSheet]);

  const handleToggleDetail = () => {
    setDetailOpen((prev) => !prev);
  };

  const handleSetBeginAt = (nextBeginAt: string) => {
    methods.setValue("beginAt", nextBeginAt);
    methods.setValue("isBeginTimeEnabled", true);

    const nextStartAt = new Date(`${methods.getValues("scheduledOn")}T${nextBeginAt}`);
    if (Number.isNaN(nextStartAt.getTime())) {
      return;
    }

    const filteredReminders = methods.getValues("reminders").filter((reminder) => {
      try {
        return parseUtc(reminder.remindsAt).getTime() < nextStartAt.getTime();
      } catch {
        return true;
      }
    });

    methods.setValue("reminders", filteredReminders);
  };

  const handleChangeBeginHour = (hour: number) => {
    const nextBeginAt = `${hour.toString().padStart(2, "0")}:${beginMin.toString().padStart(2, "0")}:00`;
    handleSetBeginAt(nextBeginAt);
  };

  const handleChangeBeginMin = (min: number) => {
    const nextBeginAt = `${beginHour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:00`;
    handleSetBeginAt(nextBeginAt);
  };

  const handleChangeEndHour = (hour: number) => {
    const nextEndAt = `${hour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}:00`;
    methods.setValue("endAt", nextEndAt);
    methods.setValue("isEndTimeEnabled", true);
  };

  const handleChangeEndMin = (min: number) => {
    const nextEndAt = `${endHour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:00`;
    methods.setValue("endAt", nextEndAt);
    methods.setValue("isEndTimeEnabled", true);
  };

  const handleChangeBeginTimeEnabled = (enabled: boolean) => {
    methods.setValue("isBeginTimeEnabled", enabled);
    if (!enabled) {
      methods.setValue("isEndTimeEnabled", false);
      methods.setValue("beginAt", "");
      methods.setValue("endAt", "");
      methods.setValue("reminders", []);
    }
  };

  const handleChangeEndTimeEnabled = (enabled: boolean) => {
    if (!methods.getValues("isBeginTimeEnabled") && enabled) {
      return;
    }

    methods.setValue("isEndTimeEnabled", enabled);
    if (!enabled) {
      methods.setValue("endAt", "");
    }
  };

  const handleCreateReminder = async (remindsAt: string) => {
    const nextReminders = sortReminders([...methods.getValues("reminders"), { remindsAt }]);
    methods.setValue("reminders", nextReminders);
  };

  const handleUpdateReminder = async (
    index: number,
    reminder: TodoEditorReminderType,
    remindsAt: string,
  ) => {
    const nextReminders = sortReminders(
      methods
        .getValues("reminders")
        .map((item, itemIndex) => (itemIndex === index ? { ...reminder, remindsAt } : item)),
    );
    methods.setValue("reminders", nextReminders);
  };

  const handleDeleteReminder = async (index: number, _reminder: TodoEditorReminderType) => {
    const nextReminders = methods
      .getValues("reminders")
      .filter((_, itemIndex) => itemIndex !== index);
    methods.setValue("reminders", nextReminders);
  };

  const getSubmitPayload = (): TodoEditorSubmitPayloadType | null => {
    const values = methods.getValues();

    if (!values.title.trim()) {
      setTitleWarning("제목을 입력해주세요.");
      return null;
    }

    return {
      goalId: values.goalId,
      title: values.title.trim(),
      scheduledOn: values.scheduledOn,
      beginAt: values.beginAt,
      endAt: values.endAt,
      isBeginTimeEnabled: values.isBeginTimeEnabled,
      isEndTimeEnabled: values.isEndTimeEnabled,
      reminders: values.reminders,
      memo: values.memo,
    };
  };

  return {
    methods,
    detailOpen,
    titleWarning,
    isTimeRangeInvalid,
    goalId,
    scheduledOn,
    beginAt,
    isBeginTimeEnabled,
    isEndTimeEnabled,
    reminders,
    memo,
    beginHour,
    beginMin,
    endHour,
    endMin,
    handleToggleDetail,
    handleChangeBeginHour,
    handleChangeBeginMin,
    handleChangeEndHour,
    handleChangeEndMin,
    handleChangeBeginTimeEnabled,
    handleChangeEndTimeEnabled,
    handleCreateReminder,
    handleUpdateReminder,
    handleDeleteReminder,
    getSubmitPayload,
  };
}

export default useTodoEditorFormState;
