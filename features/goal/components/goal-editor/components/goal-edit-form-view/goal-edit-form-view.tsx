import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { Pressable, View } from "react-native";

import { Button, FormSection, FormTextInput, SpoqaText } from "@/components";
import { useWideLayout } from "@/hooks";
import { ArrowRightIcon } from "@/icons";
import type { GoalPrivacyType } from "@/types/response/goal/goal";

import { useGoalEditMutation } from "../../hooks";

export interface GoalEditFormViewProps {
  goalId: number;
  defaultTitle: string;
  pickedColor: string;
  privacyType: GoalPrivacyType;
  repeatTodoCount: number;
  redirectOnSuccess?: boolean;
  invalidateFeedOnSuccess?: boolean;
  onMutationSuccess?: () => void;
  onPressOpenColorSheet: () => void;
  onPressOpenRepeatManagement: () => void;
  onPressTerminateGoal: () => void;
  onPressDeleteGoal: () => void;
}

function GoalEditFormView({
  goalId,
  defaultTitle,
  pickedColor,
  privacyType,
  repeatTodoCount,
  redirectOnSuccess,
  invalidateFeedOnSuccess,
  onMutationSuccess,
  onPressOpenColorSheet,
  onPressOpenRepeatManagement,
  onPressTerminateGoal,
  onPressDeleteGoal,
}: GoalEditFormViewProps) {
  const { isWideLayout } = useWideLayout();
  const {
    methods,
    handleUpdateColor,
    handleSubmitGoalEdit,
    isEditPending,
    isTerminatePending,
    isDeletePending,
  } = useGoalEditMutation({
    goalId,
    defaultTitle,
    pickedColor,
    privacyType,
    redirectOnSuccess,
    invalidateFeedOnSuccess,
    onMutationSuccess,
  });
  const containerClassName = `flex-1 px-[2.4rem] pb-[2.4rem] pt-[0.8rem] ${
    isWideLayout ? "w-full max-w-[84rem] self-center" : ""
  }`;

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

  return (
    <FormProvider {...methods}>
      <View className={containerClassName}>
        <View className="gap-[1.2rem]">
          <FormTextInput
            control={methods.control}
            name="title"
            placeholder={"목표 제목을 입력하세요"}
            required="제목을 입력해주세요."
            rules={{
              validate: (value) => String(value ?? "").trim().length > 0 || "제목을 입력해주세요.",
            }}
          />

          <FormSection
            label={"색상"}
            rightContent={colorInput}
          />

          <FormSection
            label={"반복투두 관리"}
            rightContent={
              <View className="flex-row items-center gap-[0.4rem]">
                <SpoqaText className="text-size13 text-role-text-inverse dark:text-role-dark-text-inverse">{`${repeatTodoCount}개`}</SpoqaText>
                <ArrowRightIcon
                  size={14}
                  stroke="#FFFFFF"
                />
              </View>
            }
            onPress={onPressOpenRepeatManagement}
          />

          <View className="flex-row gap-[0.8rem]">
            <Button
              label={"종료하기"}
              className="flex-1"
              bodyClassName="bg-role-surface-canvas dark:bg-role-dark-surface-canvas"
              onPress={onPressTerminateGoal}
              isLoading={isTerminatePending}
              disabled={isTerminatePending || isDeletePending || isEditPending}
            />
            <Button
              label={"삭제하기"}
              className="flex-1"
              bodyClassName="bg-[#FFD9D9]"
              onPress={onPressDeleteGoal}
              isLoading={isDeletePending}
              disabled={isTerminatePending || isDeletePending || isEditPending}
            />
          </View>
        </View>

        <Button
          label={"목표 수정"}
          className="mt-auto"
          onPress={methods.handleSubmit(handleSubmitGoalEdit)}
          isLoading={isEditPending}
          disabled={isTerminatePending || isDeletePending || isEditPending}
        />
      </View>
    </FormProvider>
  );
}

export default GoalEditFormView;
