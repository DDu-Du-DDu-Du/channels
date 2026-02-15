import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, TextInput, View } from "react-native";

import { OptionIcon } from "@/icons";
import type { MainDDuDusType } from "@/types/response/feed/feed";

import { useUpdateDDuDuMutation } from "./hooks";
import type { DDuDuInputType } from "./main-ddudu-input.types";

interface MainDDuDuInputProps {
  type?: "create" | "edit";
  goalId: number;
  color: string;
  dduduItem?: MainDDuDusType;
  selectedDDuDuDate: string;
  onCloseDDuDuInput: () => void;
}

function MainDDuDuInput({
  type = "create",
  goalId,
  color,
  dduduItem,
  selectedDDuDuDate,
  onCloseDDuDuInput,
}: MainDDuDuInputProps) {
  const { control, handleSubmit, reset } = useForm<DDuDuInputType>({
    defaultValues: { ddudu: dduduItem?.name ?? "" },
  });

  useEffect(() => {
    reset({ ddudu: dduduItem?.name ?? "" });
  }, [dduduItem?.name, reset]);

  const { onValid } = useUpdateDDuDuMutation({
    type,
    goalId,
    dduduItem,
    selectedDDuDuDate,
    reset,
    onCloseDDuDuInput,
  });

  const isSubmittingRef = useRef(false);
  const handleSubmitForm = handleSubmit(onValid, () => onCloseDDuDuInput());
  const handleSubmitOnce = () => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    Promise.resolve(handleSubmitForm()).finally(() => {
      isSubmittingRef.current = false;
    });
    console.log("blur?");
  };

  return (
    <View className="flex-row items-center justify-between">
      <View
        className="w-[2rem] h-[2rem] rounded-circle border-2 bg-white mr-[1rem]"
        style={{ borderColor: `#${color}` }}
      />
      <View className="flex-1">
        <Controller
          control={control}
          name="ddudu"
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={() => {
                onBlur();
                handleSubmitOnce();
              }}
              placeholder="Add a ddudu"
              autoFocus
              className="w-full py-[0.5rem] px-[0.5rem] border-b"
              style={{ borderColor: `#${color}` }}
              returnKeyType="done"
            />
          )}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        className="ml-[0.5rem] p-[0.5rem] pr-[0]"
        onPress={handleSubmitOnce}
      >
        <OptionIcon />
      </Pressable>
    </View>
  );
}

export default MainDDuDuInput;
