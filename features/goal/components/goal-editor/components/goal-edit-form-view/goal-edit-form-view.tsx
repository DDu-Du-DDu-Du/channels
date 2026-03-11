import { useEffect } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { Pressable, View } from "react-native";

import { Button, FormSection, FormTitleInput, SpoqaText } from "@/components";
import { ArrowRightIcon } from "@/icons";
import type { GoalPrivacyType } from "@/types/response/goal/goal";

import { useGoalEditMutation } from "../../hooks";

export interface GoalEditFormViewProps {
  goalId: number;
  defaultTitle: string;
  pickedColor: string;
  privacyType: GoalPrivacyType;
  repeatDduduCount: number;
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
  repeatDduduCount,
  onPressOpenColorSheet,
  onPressOpenRepeatManagement,
  onPressTerminateGoal,
  onPressDeleteGoal,
}: GoalEditFormViewProps) {
  const { methods, handleUpdateColor, handleSubmitGoalEdit } = useGoalEditMutation({
    goalId,
    defaultTitle,
    pickedColor,
    privacyType,
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

  return (
    <FormProvider {...methods}>
      <View className="flex-1 px-[2.4rem] pb-[2.4rem] pt-[0.8rem]">
        <View className="gap-[1.2rem]">
          <Controller
            control={methods.control}
            name="title"
            rules={{
              validate: (value) => value.trim().length > 0 || "제목을 입력해주세요.",
            }}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <View>
                <FormTitleInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={"목표 제목을 입력하세요"}
                  required
                />
                {error?.message && (
                  <SpoqaText className="mt-[0.6rem] text-size12 text-role-status-error dark:text-role-dark-status-error">
                    {error.message}
                  </SpoqaText>
                )}
              </View>
            )}
          />

          <FormSection
            label={"색상"}
            rightContent={colorInput}
          />

          <FormSection
            label={"반복뚜두 관리"}
            rightContent={
              <View className="flex-row items-center gap-[0.4rem]">
                <SpoqaText className="text-size13 text-role-text-inverse dark:text-role-dark-text-inverse">{`${repeatDduduCount}개`}</SpoqaText>
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
            />
            <Button
              label={"삭제하기"}
              className="flex-1"
              bodyClassName="bg-[#FFD9D9]"
              onPress={onPressDeleteGoal}
            />
          </View>
        </View>

        <Button
          label={"목표 수정"}
          className="mt-auto"
          onPress={methods.handleSubmit(handleSubmitGoalEdit)}
        />
      </View>
    </FormProvider>
  );
}

export default GoalEditFormView;
