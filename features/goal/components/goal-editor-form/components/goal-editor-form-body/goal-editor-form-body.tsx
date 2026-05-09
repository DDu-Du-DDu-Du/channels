import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { Button, FormSection, FormTextInput } from "@/components";
import { RepeatTodoCards, type RepeatTodoItemType } from "@/features/repeat-todo";
import { useWideLayout } from "@/hooks";
import { ArrowRightIcon } from "@/icons";

import { useGoalMutation } from "../../hooks";

export interface GoalEditorFormBodyProps {
  submitLabel: string;
  defaultTitle: string;
  pickedColor: string;
  repeatTodos: RepeatTodoItemType[];
  redirectOnSuccess?: boolean;
  successRedirect?: {
    pathname: "/feed" | "/stats";
    params?: {
      openGoalSheet?: string;
      yearMonth?: string;
    };
  };
  onSubmitSuccess?: () => void;
  onPressOpenColorSheet: () => void;
  onPressOpenRepeatSheet: () => void;
  onPressRepeatTodoCard: (index: number) => void;
  onPressDeleteRepeatTodoCard: (target: { id?: number; tempId?: string }) => void;
}

function GoalEditorFormBody({
  submitLabel,
  defaultTitle,
  pickedColor,
  repeatTodos,
  redirectOnSuccess,
  successRedirect,
  onSubmitSuccess,
  onPressOpenColorSheet,
  onPressOpenRepeatSheet,
  onPressRepeatTodoCard,
  onPressDeleteRepeatTodoCard,
}: GoalEditorFormBodyProps) {
  const { t } = useTranslation();
  const { isWideLayout } = useWideLayout();
  const { methods, handleUpdateColor, handleSubmitGoal, isPending } = useGoalMutation({
    defaultTitle,
    pickedColor,
    repeatTodos,
    redirectOnSuccess,
    successRedirect,
    onSubmitSuccess,
  });

  useEffect(() => {
    handleUpdateColor(pickedColor);
  }, [handleUpdateColor, pickedColor]);

  const colorInput = (
    <Pressable
      onPress={onPressOpenColorSheet}
      accessibilityRole="button"
      className="h-[4.2rem] w-[8.2rem] flex-row items-center justify-between rounded-radius10 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.1rem]"
    >
      <View
        className="h-[2.4rem] w-[2.4rem] rounded-circle"
        style={{
          backgroundColor: pickedColor,
        }}
      />
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
    </Pressable>
  );

  const repeatArrow = (
    <ArrowRightIcon
      size={14}
      stroke="#FFFFFF"
    />
  );
  const containerClassName = `flex-1 px-[2.4rem] pb-[2.4rem] pt-[0.8rem] ${
    isWideLayout ? "w-full max-w-[84rem] self-center" : ""
  }`;

  return (
    <FormProvider {...methods}>
      <View className={containerClassName}>
        <View className="gap-[1.2rem]">
          <FormTextInput
            control={methods.control}
            name="title"
            placeholder={t("goal.titlePlaceholder")}
            required={t("goal.titleRequired")}
            rules={{
              validate: (value) => String(value ?? "").trim().length > 0 || t("goal.titleRequired"),
            }}
          />

          <FormSection
            label={t("goal.color")}
            rightContent={colorInput}
          />

          <FormSection
            label={t("goal.createRepeatTodo")}
            rightContent={repeatArrow}
            onPress={onPressOpenRepeatSheet}
          />
        </View>

        <View className="flex-1 pt-[1.2rem]">
          <RepeatTodoCards
            repeatTodos={repeatTodos}
            onPressRepeatTodo={onPressRepeatTodoCard}
            onPressDeleteRepeatTodo={(repeatTodo) =>
              onPressDeleteRepeatTodoCard({
                id: repeatTodo.id,
                tempId: repeatTodo.tempId,
              })
            }
          />
        </View>

        <View className="pt-[1.2rem]">
          <Button
            label={submitLabel}
            onPress={methods.handleSubmit(handleSubmitGoal)}
            isLoading={isPending}
            disabled={isPending}
          />
        </View>
      </View>
    </FormProvider>
  );
}

export default GoalEditorFormBody;
