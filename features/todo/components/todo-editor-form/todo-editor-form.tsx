import { Pressable, TextInput as RNTextInput, View } from "react-native";

import { Button, FormSection, FormTitleInput, SpoqaText, TimeSet } from "@/components";
import { ChevronRightIcon } from "@/icons";

import type { TodoEditorStateType } from "../../todo.types";
import TodoDetailToggle from "../todo-detail-toggle/todo-detail-toggle";
import TodoReminderPanel from "../todo-reminder-panel/todo-reminder-panel";

export interface TodoEditorFormProps {
  mode: "create" | "edit";
  state: TodoEditorStateType;
  titleWarning: string;
  reminderWarning: string;
  isPending: boolean;
  onPressOpenCalendar: () => void;
  onPressOpenTimeSheet: () => void;
  onChangeTitle: (title: string) => void;
  onToggleDetail: () => void;
  onToggleReminder: (enabled: boolean) => void;
  onChangeReminderDay: (value: number) => void;
  onChangeReminderHour: (value: number) => void;
  onChangeReminderMinute: (value: number) => void;
  onChangeMemo: (memo: string) => void;
  onSubmit: () => void;
}

function TodoEditorForm({
  mode,
  state,
  titleWarning,
  reminderWarning,
  isPending,
  onPressOpenCalendar,
  onPressOpenTimeSheet,
  onChangeTitle,
  onToggleDetail,
  onToggleReminder,
  onChangeReminderDay,
  onChangeReminderHour,
  onChangeReminderMinute,
  onChangeMemo,
  onSubmit,
}: TodoEditorFormProps) {
  return (
    <View className="w-full gap-[1rem] px-[2.4rem] pb-[2.4rem]">
      <FormTitleInput
        required
        value={state.title}
        onChangeText={onChangeTitle}
        placeholder="투두 제목"
      />
      {titleWarning ? (
        <SpoqaText className="text-size13 text-role-status-error dark:text-role-dark-status-error">
          {titleWarning}
        </SpoqaText>
      ) : null}

      <Pressable
        className="rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.2rem] py-[1.2rem]"
        onPress={onPressOpenCalendar}
      >
        <SpoqaText className="mb-[0.4rem] text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
          날짜
        </SpoqaText>
        <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
          {state.scheduledOn}
        </SpoqaText>
      </Pressable>

      <TodoDetailToggle
        isOpen={state.detailOpen}
        onPress={onToggleDetail}
      />

      {state.detailOpen && (
        <View className="gap-[1rem]">
          <FormSection
            label="시간 설정"
            labelClassName="text-size14 text-role-text-primary dark:text-role-dark-text-primary"
            className="rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.2rem]"
            rightContent={
              <ChevronRightIcon
                size={14}
                fill="#505050"
              />
            }
            onPress={onPressOpenTimeSheet}
          />

          <TimeSet
            beginAt={state.beginAt || undefined}
            endAt={state.endAt || undefined}
            beginLabel="시작시간"
            endLabel="종료시간"
          />

          <TodoReminderPanel
            enabled={state.reminder.enabled}
            day={state.reminder.day}
            hour={state.reminder.hour}
            minute={state.reminder.minute}
            warningMessage={reminderWarning}
            onToggle={onToggleReminder}
            onChangeDay={onChangeReminderDay}
            onChangeHour={onChangeReminderHour}
            onChangeMinute={onChangeReminderMinute}
          />

          <View className="rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas p-[1.2rem]">
            <SpoqaText className="mb-[0.8rem] text-size14 text-role-text-primary dark:text-role-dark-text-primary">
              메모 입력
            </SpoqaText>
            <RNTextInput
              value={state.memo}
              onChangeText={onChangeMemo}
              placeholder="메모를 입력해주세요"
              multiline
              textAlignVertical="top"
              className="h-[10rem] rounded-radius15 bg-role-surface-panel dark:bg-role-dark-surface-panel px-[1.2rem] py-[1rem] text-size14"
            />
          </View>
        </View>
      )}

      <Button
        label={mode === "create" ? "투두 생성" : "투두 수정"}
        onPress={onSubmit}
        className="mt-[0.4rem]"
        bodyClassName={`bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg ${isPending ? "opacity-50" : ""}`}
        labelClassName="text-role-text-inverse dark:text-role-dark-text-inverse"
      />
    </View>
  );
}

export default TodoEditorForm;
