import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Pressable, View } from "react-native";

import { InputRadio, SpoqaText } from "@/components";

const OPTIONS = [
  { id: "opt1", label: "옵션 1" },
  { id: "opt2", label: "옵션 2" },
  { id: "opt3", label: "옵션 3" },
];

export interface InputRadioViewProps {
  onSubmit?: (data: any) => void;
}

function InputRadioView({ onSubmit }: InputRadioViewProps) {
  const methods = useForm({ defaultValues: { radio: OPTIONS[0].id } });
  const submit = methods.handleSubmit((data) => onSubmit?.(data));

  return (
    <FormProvider {...methods}>
      <View className="flex-1 items-center justify-center p-4 gap-[1.2rem]">
        <InputRadio
          name="radio"
          options={OPTIONS}
        />
        <Pressable
          accessibilityRole="button"
          onPress={submit}
          className="px-[1.2rem] py-[0.8rem] bg-main rounded-radius10"
        >
          <SpoqaText className="text-white">제출</SpoqaText>
        </Pressable>
      </View>
    </FormProvider>
  );
}

export default InputRadioView;
