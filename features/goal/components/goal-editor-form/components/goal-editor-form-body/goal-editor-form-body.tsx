import { useEffect } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { Pressable, View } from "react-native";

import { Button, FormSection, FormTitleInput, SpoqaText } from "@/components";
import { ArrowRightIcon } from "@/icons";
import type { RepeatDduduRequestType } from "@/types/request/repeat-ddudu/repeat-ddudu";

import { useGoalMutation } from "../../hooks";
import RepeatDduduCards from "../repeat-ddudu-cards/repeat-ddudu-cards";

export interface GoalEditorFormBodyProps {
  submitLabel: string;
  defaultTitle: string;
  pickedColor: string;
  repeatDdudus: RepeatDduduRequestType[];
  onPressOpenColorSheet: () => void;
  onPressOpenRepeatSheet: () => void;
  onPressRepeatDduduCard: (index: number) => void;
}

function GoalEditorFormBody({
  submitLabel,
  defaultTitle,
  pickedColor,
  repeatDdudus,
  onPressOpenColorSheet,
  onPressOpenRepeatSheet,
  onPressRepeatDduduCard,
}: GoalEditorFormBodyProps) {
  const { methods, handleUpdateColor, handleSubmitGoal } = useGoalMutation({
    defaultTitle,
    pickedColor,
    repeatDdudus,
  });

  useEffect(() => {
    handleUpdateColor(pickedColor);
  }, [handleUpdateColor, pickedColor]);

  const colorInput = (
    <Pressable
      onPress={onPressOpenColorSheet}
      accessibilityRole="button"
      className="h-[4.2rem] w-[8.2rem] flex-row items-center justify-between rounded-radius10 bg-white_100 px-[1.1rem]"
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
                  <SpoqaText className="mt-[0.6rem] text-size12 text-example_red_500">
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
            label={"반복 뚜두 만들기"}
            rightContent={repeatArrow}
            onPress={onPressOpenRepeatSheet}
          />

          <RepeatDduduCards
            repeatDdudus={repeatDdudus}
            onPressRepeatDdudu={onPressRepeatDduduCard}
          />
        </View>

        <Button
          label={submitLabel}
          className="mt-auto"
          onPress={methods.handleSubmit(handleSubmitGoal)}
        />
      </View>
    </FormProvider>
  );
}

export default GoalEditorFormBody;
