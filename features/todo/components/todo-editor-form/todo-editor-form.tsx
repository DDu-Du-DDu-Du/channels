import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import AnimatedSwitch from "@/components/animated-switch/animated-switch";
import Button from "@/components/button/button";
import FormTextInput from "@/components/form-text-input/form-text-input";
import MemberGuide from "@/components/member-guide/member-guide";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import TimePicker from "@/components/time-picker/time-picker";
import type { TodoDetailType } from "@/components/todo-sheet/todo-sheet.types";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import type { GoalType } from "@/types/response/goal/goal";

import type { TodoEditorSubmitPayloadType } from "../../todo.types";
import TodoDetailToggle from "../todo-detail-toggle/todo-detail-toggle";
import TodoReminderListBox from "../todo-reminder-list-box/todo-reminder-list-box";
import { type TodoEditorFormValues, useTodoEditorFormState } from "./hooks";

export interface TodoEditorFormProps {
  mode: "create" | "edit";
  isGuestSession: boolean;
  isPending: boolean;
  showGoalSelector: boolean;
  goalList: GoalType[];
  selectedDate: string;
  TodoDetail?: TodoDetailType;
  initialGoalId?: number;
  selectedDateFromSheet?: string;
  selectedGoalIdFromSheet?: number;
  onRequestOpenCalendar: () => void;
  onRequestOpenGoalSheet: () => void;
  onSubmitPayload: (
    payload: TodoEditorSubmitPayloadType,
  ) => Promise<boolean> | Promise<void> | void;
}

function TodoEditorForm({
  mode,
  isGuestSession,
  isPending,
  showGoalSelector,
  goalList,
  selectedDate,
  TodoDetail,
  initialGoalId,
  selectedDateFromSheet,
  selectedGoalIdFromSheet,
  onRequestOpenCalendar,
  onRequestOpenGoalSheet,
  onSubmitPayload,
}: TodoEditorFormProps) {
  const { t } = useTranslation();
  const switchOffTrackColor = useThemeColorToken("role.border.default");
  const switchOnTrackColor = useThemeColorToken("role.status.success");
  const switchThumbColor = useThemeColorToken("role.surface.canvas");
  const enabledPickerBgColor = useThemeColorToken("role.surface.canvas");
  const disabledPickerBgColor = useThemeColorToken("role.surface.subtle");

  const {
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
  } = useTodoEditorFormState({
    mode,
    selectedDate,
    TodoDetail,
    initialGoalId,
    selectedDateFromSheet,
    selectedGoalIdFromSheet,
  });

  const selectedGoal = goalList.find((goal) => goal.id === goalId);

  const handleSubmitEditor = async () => {
    if (isPending || isTimeRangeInvalid) {
      return;
    }

    const payload = getSubmitPayload();
    if (!payload) {
      return;
    }

    await onSubmitPayload(payload);
  };

  const renderGoalSelector = () => (
    <Pressable
      className="rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.2rem] py-[1.2rem]"
      onPress={onRequestOpenGoalSheet}
    >
      <View className="flex-row items-center justify-between">
        <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
          목표
        </SpoqaText>

        <View className="h-[4.2rem] min-w-[12rem] flex-row items-center justify-between rounded-radius10 bg-role-surface-subtle px-[1.1rem] dark:bg-role-dark-surface-subtle">
          <View className="flex-row items-center gap-[0.7rem]">
            {selectedGoal ? (
              <View
                className="size-[1rem] rounded-circle"
                style={{ backgroundColor: `#${selectedGoal.color}` }}
              />
            ) : null}
            <SpoqaText className="text-size13 text-role-text-primary dark:text-role-dark-text-primary">
              {selectedGoal?.name ?? "목표 선택"}
            </SpoqaText>
          </View>

          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 4,
              borderRightWidth: 4,
              borderTopWidth: 6,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderTopColor: "#B5B5B5",
            }}
          />
        </View>
      </View>
    </Pressable>
  );

  return (
    <FormProvider {...methods}>
      <View className="w-full gap-[1rem] px-[2.4rem] pb-[1.6rem]">
        <FormTextInput<TodoEditorFormValues>
          control={methods.control}
          name="title"
          placeholder={t("todo.titlePlaceholder")}
          required={t("goal.titleRequired")}
          rules={{
            validate: (value) => String(value ?? "").trim().length > 0 || t("goal.titleRequired"),
          }}
          showErrorMessage={false}
        />
        {titleWarning ? (
          <SpoqaText className="mt-[-0.4rem] text-size13 text-role-status-error dark:text-role-dark-status-error">
            {titleWarning}
          </SpoqaText>
        ) : null}

        <Pressable
          className="rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.2rem] py-[1.2rem]"
          onPress={onRequestOpenCalendar}
        >
          <SpoqaText className="mb-[0.4rem] text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
            {t("calendar.startDate")}
          </SpoqaText>
          <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
            {scheduledOn}
          </SpoqaText>
        </Pressable>

        <TodoDetailToggle
          isOpen={detailOpen}
          onPress={handleToggleDetail}
        />

        {detailOpen && (
          <View className="gap-[1rem]">
            <View className="rounded-radius15 bg-role-surface-canvas p-[1.2rem] dark:bg-role-dark-surface-canvas">
              <View className="mb-[0.8rem] flex-row items-center gap-[0.8rem]">
                <SpoqaText className="text-size13 text-role-text-primary dark:text-role-dark-text-primary">
                  {t("todo.timeSheet.startTime")}
                </SpoqaText>
                <AnimatedSwitch
                  value={isBeginTimeEnabled}
                  onValueChange={handleChangeBeginTimeEnabled}
                  offBackgroundColor={switchOffTrackColor}
                  onBackgroundColor={switchOnTrackColor}
                  thumbColor={switchThumbColor}
                />
              </View>

              <View
                className="flex-row items-center gap-[0.5rem] rounded-radius10 px-[0.4rem] py-[1rem]"
                style={{
                  backgroundColor: isBeginTimeEnabled
                    ? enabledPickerBgColor
                    : disabledPickerBgColor,
                }}
                pointerEvents={isBeginTimeEnabled ? "auto" : "none"}
              >
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

            <View className="rounded-radius15 bg-role-surface-canvas p-[1.2rem] dark:bg-role-dark-surface-canvas">
              <View className="mb-[0.8rem] flex-row items-center gap-[0.8rem]">
                <SpoqaText className="text-size13 text-role-text-primary dark:text-role-dark-text-primary">
                  {t("todo.timeSheet.endTime")}
                </SpoqaText>
                <AnimatedSwitch
                  value={isEndTimeEnabled}
                  onValueChange={handleChangeEndTimeEnabled}
                  offBackgroundColor={switchOffTrackColor}
                  onBackgroundColor={switchOnTrackColor}
                  thumbColor={switchThumbColor}
                  disabled={!isBeginTimeEnabled}
                />
              </View>

              <View
                className="flex-row items-center gap-[0.5rem] rounded-radius10 px-[0.4rem] py-[1rem]"
                style={{
                  backgroundColor:
                    isBeginTimeEnabled && isEndTimeEnabled
                      ? enabledPickerBgColor
                      : disabledPickerBgColor,
                }}
                pointerEvents={isBeginTimeEnabled && isEndTimeEnabled ? "auto" : "none"}
              >
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

            {isTimeRangeInvalid && isBeginTimeEnabled && isEndTimeEnabled ? (
              <SpoqaText className="text-size12 text-role-status-error dark:text-role-dark-status-error">
                {t("todo.timeSheet.invalidRange")}
              </SpoqaText>
            ) : null}

            {isGuestSession ? (
              <View className="rounded-radius15 bg-role-surface-canvas px-[1.2rem] py-[1.2rem] dark:bg-role-dark-surface-canvas">
                <SpoqaText className="mb-[0.8rem] text-size14 text-role-text-primary dark:text-role-dark-text-primary">
                  {t("todo.reminder.title")}
                </SpoqaText>
                <MemberGuide className="w-full items-center py-[0.4rem]" />
              </View>
            ) : (
              <TodoReminderListBox
                reminders={reminders}
                scheduledOn={scheduledOn}
                beginAt={beginAt}
                showTitle
                onCreateReminder={handleCreateReminder}
                onUpdateReminder={handleUpdateReminder}
                onDeleteReminder={handleDeleteReminder}
              />
            )}

            <View className="rounded-radius15 bg-role-surface-canvas p-[1.2rem] dark:bg-role-dark-surface-canvas">
              <SpoqaText className="mb-[0.8rem] text-size14 text-role-text-primary dark:text-role-dark-text-primary">
                {t("todo.memoPlaceholder")}
              </SpoqaText>
              <FormTextInput<TodoEditorFormValues>
                control={methods.control}
                name="memo"
                placeholder={t("todo.memoPlaceholder")}
                multiline
                textAlignVertical="top"
                className="h-[10rem] px-[1.2rem] py-[1rem] text-size14"
              />
            </View>

            {showGoalSelector ? renderGoalSelector() : null}
          </View>
        )}

        <Button
          label={mode === "create" ? t("todo.create") : t("todo.edit")}
          onPress={handleSubmitEditor}
          className="mt-[0.4rem]"
          bodyClassName="bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg"
          labelClassName="text-role-text-inverse dark:text-role-dark-text-inverse"
          isLoading={isPending}
          disabled={isPending}
        />
      </View>
    </FormProvider>
  );
}

export default TodoEditorForm;
