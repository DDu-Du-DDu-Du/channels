import { FormProvider, useForm } from "react-hook-form";
import { Pressable, View } from "react-native";

import { FormTextInput, SpoqaText } from "@/components";

export interface TextInputViewProps {
  placeholder?: string;
  disabled?: boolean;
  showError?: boolean;
  onSubmit?: (data: any) => void;
}

function TextInputView({
  placeholder,
  disabled = false,
  showError = false,
  onSubmit,
}: TextInputViewProps) {
  const methods = useForm({ defaultValues: { title: "" } });
  const submit = methods.handleSubmit((data) => onSubmit?.(data));

  return (
    <FormProvider {...methods}>
      <View className="flex-1 items-center justify-center p-4 gap-[1.2rem] w-full max-w-[40rem]">
        <FormTextInput
          name="title"
          rules={showError ? { required: true } : {}}
          placeholder={placeholder}
          editable={!disabled}
        />
        <Pressable
          accessibilityRole="button"
          onPress={submit}
          className="px-[1.2rem] py-[0.8rem] bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg rounded-radius10"
        >
          <SpoqaText className="text-role-text-inverse dark:text-role-dark-text-inverse">
            제출
          </SpoqaText>
        </Pressable>
      </View>
    </FormProvider>
  );
}

export default TextInputView;
