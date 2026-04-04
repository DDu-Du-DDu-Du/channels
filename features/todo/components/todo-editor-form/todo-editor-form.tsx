import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import Button from "@/components/button/Button";
import FormSection from "@/components/form-section/form-section";
import FormTitleInput from "@/components/form-title-input/form-title-input";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import TextInput from "@/components/text-input/text-input";
import TimeSet from "@/components/time-set/time-set";
import { ChevronRightIcon } from "@/icons";

import type { TodoEditorStateType } from "../../todo.types";
import TodoDetailToggle from "../todo-detail-toggle/todo-detail-toggle";
import TodoReminderListBox from "../todo-reminder-list-box/todo-reminder-list-box";

export interface TodoEditorFormProps {
  mode: "create" | "edit";
  state: TodoEditorStateType;
  titleWarning: string;
  isPending: boolean;
  onPressOpenCalendar: () => void;
  onPressOpenTimeSheet: () => void;
  onChangeTitle: (title: string) => void;
  onToggleDetail: () => void;
  onCreateReminder: (remindsAt: string) => Promise<void> | void;
  onUpdateReminder: (
    index: number,
    reminder: { id?: number; remindsAt: string; remindedAt?: string | null },
    remindsAt: string,
  ) => Promise<void> | void;
  onDeleteReminder: (
    index: number,
    reminder: { id?: number; remindsAt: string; remindedAt?: string | null },
  ) => Promise<void> | void;
  onChangeMemo: (memo: string) => void;
  onSubmit: () => void;
}

function TodoEditorForm({
  mode,
  state,
  titleWarning,
  isPending,
  onPressOpenCalendar,
  onPressOpenTimeSheet,
  onChangeTitle,
  onToggleDetail,
  onCreateReminder,
  onUpdateReminder,
  onDeleteReminder,
  onChangeMemo,
  onSubmit,
}: TodoEditorFormProps) {
  const titleMethods = useForm<{ title: string }>({
    defaultValues: { title: state.title },
  });
  const { control, getValues, setValue } = titleMethods;
  const watchedTitle = useWatch({
    control,
    name: "title",
  });

  useEffect(() => {
    if (watchedTitle !== state.title) {
      onChangeTitle(watchedTitle ?? "");
    }
  }, [onChangeTitle, state.title, watchedTitle]);

  useEffect(() => {
    if (getValues("title") !== state.title) {
      setValue("title", state.title, { shouldDirty: false, shouldTouch: false });
    }
  }, [getValues, setValue, state.title]);

  return (
    <View className="w-full gap-[1rem] px-[2.4rem] pb-[2.4rem]">
      <FormProvider {...titleMethods}>
        <FormTitleInput
          required
          name="title"
          placeholder="투두 제목"
        />
      </FormProvider>
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

          <TodoReminderListBox
            reminders={state.reminders}
            scheduledOn={state.scheduledOn}
            beginAt={state.beginAt}
            showTitle
            onCreateReminder={onCreateReminder}
            onUpdateReminder={onUpdateReminder}
            onDeleteReminder={onDeleteReminder}
          />

          <View className="rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas p-[1.2rem]">
            <SpoqaText className="mb-[0.8rem] text-size14 text-role-text-primary dark:text-role-dark-text-primary">
              메모 입력
            </SpoqaText>
            <TextInput
              value={state.memo}
              onChangeText={onChangeMemo}
              placeholder="메모를 입력해주세요"
              multiline
              textAlignVertical="top"
              className="h-[10rem] px-[1.2rem] py-[1rem] text-size14"
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
