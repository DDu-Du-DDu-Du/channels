import { FormProvider, useForm } from "react-hook-form";
import { Pressable, View } from "react-native";

import { InputDate, SpoqaText } from "@/components";

export interface InputDateViewProps {
  type?: "single" | "range";
  mode?: "create" | "edit";
  onSubmit?: (data: any) => void;
}

function InputDateView({ type = "single", mode = "create", onSubmit }: InputDateViewProps) {
  const methods = useForm({ defaultValues: { startDate: undefined, endDate: undefined } });
  const handleSubmit = methods.handleSubmit((data) => onSubmit?.(data));

  return (
    <FormProvider {...methods}>
      <View className="flex-1 items-center justify-center p-4 gap-[1.2rem]">
        <View className="flex-row items-center gap-[0.8rem]">
          <InputDate
            type={type}
            mode={mode}
            labelStart="시작날짜"
            nameStart="startDate"
            labelEnd="종료날짜"
            nameEnd="endDate"
          />
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={handleSubmit}
          className="px-[1.2rem] py-[0.8rem] bg-main rounded-radius10"
        >
          <SpoqaText className="text-white">제출</SpoqaText>
        </Pressable>
      </View>
    </FormProvider>
  );
}

export default InputDateView;
