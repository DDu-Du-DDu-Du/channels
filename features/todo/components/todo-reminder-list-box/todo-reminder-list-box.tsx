import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

import { ShakingCheckIcon } from "@/components";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { CalendarIcon, ClockIcon, DeleteIcon, PlusIcon } from "@/icons";
import { parseUtc } from "@/utils";

import type { TodoEditorReminderType } from "../../todo.types";
import ReminderTimeSheet from "../reminder-time-sheet/reminder-time-sheet";

const QUICK_REMINDER_OPTIONS = [
  { label: "1분 전", minutes: 1 },
  { label: "5분 전", minutes: 5 },
  { label: "10분 전", minutes: 10 },
  { label: "30분 전", minutes: 30 },
  { label: "1시간 전", minutes: 60 },
];

interface EditingReminderState {
  originalIndex: number;
  reminder: TodoEditorReminderType;
}

export interface TodoReminderListBoxProps {
  reminders: TodoEditorReminderType[];
  scheduledOn: string;
  beginAt?: string;
  showTitle?: boolean;
  onCreateReminder: (remindsAt: string) => Promise<void> | void;
  onUpdateReminder: (
    index: number,
    reminder: TodoEditorReminderType,
    remindsAt: string,
  ) => Promise<void> | void;
  onDeleteReminder: (index: number, reminder: TodoEditorReminderType) => Promise<void> | void;
}

const getReminderKey = (reminder: TodoEditorReminderType, index: number) =>
  `${reminder.id ?? "local"}-${reminder.remindsAt}-${index}`;

const formatReminderDateTime = (remindsAt: string): { date: string; time: string } | null => {
  let localDate: Date;
  try {
    localDate = parseUtc(remindsAt);
  } catch {
    return null;
  }

  const year = localDate.getFullYear();
  const month = `${localDate.getMonth() + 1}`.padStart(2, "0");
  const day = `${localDate.getDate()}`.padStart(2, "0");
  const hour = `${localDate.getHours()}`.padStart(2, "0");
  const minute = `${localDate.getMinutes()}`.padStart(2, "0");

  return {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`,
  };
};

function TodoReminderListBox({
  reminders,
  scheduledOn,
  beginAt,
  showTitle = false,
  onCreateReminder,
  onUpdateReminder,
  onDeleteReminder,
}: TodoReminderListBoxProps) {
  const spinnerColor = useThemeColorToken("role.text.primary");
  const checkboxCheckColor = useThemeColorToken("ui.checkbox.check");
  const checkboxUncheckColor = useThemeColorToken("ui.checkbox.uncheck");
  const [includeSentReminder, setIncludeSentReminder] = useState(false);
  const [quickLoadingMinutes, setQuickLoadingMinutes] = useState<number | null>(null);
  const [deleteLoadingKey, setDeleteLoadingKey] = useState("");
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<EditingReminderState | null>(null);
  const [addWarning, setAddWarning] = useState("");

  const visibleReminders = useMemo(
    () =>
      reminders
        .map((reminder, index) => ({ reminder, originalIndex: index }))
        .filter(({ reminder }) => includeSentReminder || !reminder.remindedAt),
    [includeSentReminder, reminders],
  );

  const isQuickDisabled = !beginAt;

  const handlePressQuickCreate = async (minutes: number) => {
    if (isQuickDisabled || !beginAt) {
      return;
    }
    setAddWarning("");

    const [startHour = "00", startMinute = "00"] = beginAt.split(":");
    const todoStartDateTime = new Date(`${scheduledOn}T${startHour}:${startMinute}:00`);
    if (Number.isNaN(todoStartDateTime.getTime())) {
      return;
    }

    const remindsAt = new Date(todoStartDateTime.getTime() - minutes * 60 * 1000).toISOString();
    setQuickLoadingMinutes(minutes);

    try {
      await onCreateReminder(remindsAt);
    } finally {
      setQuickLoadingMinutes(null);
    }
  };

  const handleDeleteReminder = async (index: number, reminder: TodoEditorReminderType) => {
    const targetKey = getReminderKey(reminder, index);
    setDeleteLoadingKey(targetKey);
    try {
      await onDeleteReminder(index, reminder);
    } finally {
      setDeleteLoadingKey("");
    }
  };

  const handlePressAdd = () => {
    if (!beginAt) {
      setAddWarning("미리알림 추가 전, 투두의 시작시간을 먼저 정해주세요");
      return;
    }

    setAddWarning("");
    setIsCreateSheetOpen(true);
  };

  return (
    <View className="rounded-radius15 bg-role-surface-canvas px-[1.2rem] py-[1.2rem] dark:bg-role-dark-surface-canvas">
      {showTitle ? (
        <SpoqaText className="mb-[0.8rem] text-size14 text-role-text-primary dark:text-role-dark-text-primary">
          미리알림
        </SpoqaText>
      ) : null}

      <View className="mb-[0.9rem] gap-[0.8rem]">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-[0.8rem]">
            {addWarning ? (
              <SpoqaText className="text-size12 text-role-text-invalid dark:text-role-dark-text-invalid">
                {addWarning}
              </SpoqaText>
            ) : null}
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="mr-[0.5rem]">
              <ShakingCheckIcon
                isChecked={includeSentReminder}
                color={checkboxCheckColor}
                uncheckedColor={checkboxUncheckColor}
                size={18}
                borderStrokeAlpha={0.6}
                onPress={() => setIncludeSentReminder((prev) => !prev)}
              />
            </View>
            <SpoqaText className="text-size13 text-role-text-primary dark:text-role-dark-text-primary">
              발송된 미리알림 포함
            </SpoqaText>
          </View>

          <Pressable
            onPress={handlePressAdd}
            className="h-[2.8rem] w-[2.8rem] items-center justify-center rounded-radius10 bg-role-surface-canvas dark:bg-role-dark-surface-canvas"
          >
            <PlusIcon
              size={14}
              fill="#303030"
            />
          </Pressable>
        </View>

        <View className="flex-row items-center gap-[0.3rem]">
          {QUICK_REMINDER_OPTIONS.map((option) => (
            <Pressable
              key={option.minutes}
              disabled={isQuickDisabled || quickLoadingMinutes !== null}
              onPress={() => handlePressQuickCreate(option.minutes)}
              className={`h-[3.2rem] min-w-[5.2rem] items-center justify-center rounded-radius10 bg-role-surface-canvas px-[0.8rem] dark:bg-role-dark-surface-canvas ${isQuickDisabled ? "opacity-40" : ""}`}
            >
              <SpoqaText className="text-size12 text-role-text-primary dark:text-role-dark-text-primary">
                {option.label}
              </SpoqaText>
              {quickLoadingMinutes === option.minutes ? (
                <View className="absolute inset-0 items-center justify-center rounded-radius10 bg-role-surface-canvas dark:bg-role-dark-surface-canvas">
                  <ActivityIndicator
                    size="small"
                    color={spinnerColor}
                  />
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>
      </View>

      <View className="gap-[0.6rem]">
        {visibleReminders.map((item) => {
          const key = getReminderKey(item.reminder, item.originalIndex);
          const isSent = Boolean(item.reminder.remindedAt);
          const isDeleteLoading = deleteLoadingKey === key;
          const formatted = formatReminderDateTime(item.reminder.remindsAt);
          const dateLabel = formatted?.date ?? "";
          const timeLabel = formatted?.time ?? "";

          return (
            <View
              key={key}
              className={`px-[0.5rem] ${isSent ? "opacity-45" : ""}`}
            >
              <View className="flex-row items-center justify-between py-[0.8rem]">
                <Pressable
                  disabled={isSent}
                  onPress={() =>
                    setEditingReminder({
                      originalIndex: item.originalIndex,
                      reminder: item.reminder,
                    })
                  }
                  className="flex-1 pr-[0.8rem]"
                >
                  <View className="gap-[0.4rem]">
                    <View className="flex-row items-center">
                      <CalendarIcon
                        size={14}
                        stroke="#8A8A8A"
                        strokeWidth={1.8}
                      />
                      <SpoqaText className="ml-[0.5rem] text-size14 text-role-text-primary dark:text-role-dark-text-primary">
                        {dateLabel}
                      </SpoqaText>
                    </View>
                    <View className="flex-row items-center">
                      <ClockIcon
                        size={14}
                        fill="#8A8A8A"
                      />
                      <SpoqaText className="ml-[0.5rem] text-size14 text-role-text-primary dark:text-role-dark-text-primary">
                        {timeLabel}
                      </SpoqaText>
                      {isSent ? (
                        <View className="ml-[0.6rem] rounded-radius10 bg-role-surface-canvas px-[0.5rem] py-[0.1rem] dark:bg-role-dark-surface-canvas">
                          <SpoqaText className="text-size11 text-role-text-secondary dark:text-role-dark-text-secondary">
                            발송됨
                          </SpoqaText>
                        </View>
                      ) : null}
                    </View>
                    {!formatted ? (
                      <SpoqaText className="text-size11 text-role-text-secondary dark:text-role-dark-text-secondary">
                        시간 형식 오류
                      </SpoqaText>
                    ) : null}
                  </View>
                </Pressable>
                <Pressable
                  disabled={isSent || isDeleteLoading}
                  onPress={() => handleDeleteReminder(item.originalIndex, item.reminder)}
                  className="h-[2.6rem] w-[2.6rem] items-center justify-center rounded-radius10 bg-[#FFD9D9]"
                >
                  {isDeleteLoading ? (
                    <ActivityIndicator
                      size="small"
                      color="#D54646"
                    />
                  ) : (
                    <DeleteIcon
                      size={13}
                      fill="#D54646"
                    />
                  )}
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      {isCreateSheetOpen && (
        <ReminderTimeSheet
          mode="create"
          scheduledOn={scheduledOn}
          beginAt={beginAt}
          onClose={() => setIsCreateSheetOpen(false)}
          onSubmit={onCreateReminder}
        />
      )}

      {editingReminder && (
        <ReminderTimeSheet
          mode="edit"
          scheduledOn={scheduledOn}
          beginAt={beginAt}
          initialRemindsAt={editingReminder.reminder.remindsAt}
          onClose={() => setEditingReminder(null)}
          onSubmit={(remindsAt) =>
            onUpdateReminder(editingReminder.originalIndex, editingReminder.reminder, remindsAt)
          }
        />
      )}
    </View>
  );
}

export default TodoReminderListBox;
