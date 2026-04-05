import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { View } from "react-native";

import SpoqaText from "../spoqa-text/spoqa-text";
import TextInput, { TextInputProps } from "../text-input/text-input";

export interface FormTextInputProps<TFieldValues extends FieldValues = FieldValues> extends Omit<
  TextInputProps,
  "value" | "onChangeText" | "onBlur"
> {
  name: Path<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  control?: Control<TFieldValues>;
  required?: boolean | string;
  showErrorMessage?: boolean;
  errorClassName?: string;
}

function FormTextInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  rules,
  control,
  required,
  showErrorMessage = true,
  errorClassName,
  ...inputProps
}: FormTextInputProps<TFieldValues>) {
  const formContext = useFormContext<TFieldValues>();
  const resolvedControl = control ?? formContext?.control;
  const requiredRule =
    required === undefined || required === false
      ? undefined
      : required === true
        ? "필수 입력 항목입니다."
        : required;
  const mergedRules = {
    ...rules,
    required: rules?.required ?? requiredRule,
  };

  if (!resolvedControl) {
    if (__DEV__) {
      throw new Error("[FormTextInput] control prop or FormProvider context is required.");
    }

    return null;
  }

  return (
    <Controller
      control={resolvedControl}
      name={name}
      rules={mergedRules}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View>
          <TextInput
            {...inputProps}
            value={typeof value === "string" ? value : ""}
            onChangeText={onChange}
            onBlur={onBlur}
          />
          {showErrorMessage && error?.message && (
            <SpoqaText
              className={`mt-[0.6rem] text-size12 text-role-status-error dark:text-role-dark-status-error ${errorClassName ?? ""}`}
            >
              {error.message}
            </SpoqaText>
          )}
        </View>
      )}
    />
  );
}

export default FormTextInput;
