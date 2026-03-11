import { Controller, FieldErrors, RegisterOptions, useFormContext } from "react-hook-form";
import { TextInput as RNTextInput } from "react-native";

export interface TextInputProps {
  name: string;
  options?: RegisterOptions;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  maxLength?: number;
  multiline?: boolean;
  textAlignVertical?: "auto" | "top" | "center" | "bottom";
}

function TextInput({
  name,
  options = {},
  placeholder,
  disabled,
  className,
  inputClassName,
  maxLength,
  multiline,
  textAlignVertical,
}: TextInputProps) {
  const { control, formState } = useFormContext();
  const hasError = Boolean((formState.errors as FieldErrors)?.[name]);

  const baseCls = multiline
    ? "w-full bg-role-surface-panel dark:bg-role-dark-surface-panel rounded-radius15 px-[1.2rem] text-size15"
    : "w-full h-[5.6rem] bg-role-surface-panel dark:bg-role-dark-surface-panel rounded-radius15 px-[1.2rem] text-size15";
  const errorCls = hasError
    ? " border-role-status-error dark:border-role-dark-status-error border-[0.1rem]"
    : "";
  const disabledCls = disabled ? " opacity-40" : "";

  return (
    <Controller
      control={control}
      name={name}
      rules={options}
      render={({ field: { value, onChange, onBlur } }) => (
        <RNTextInput
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          editable={!disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          multiline={multiline}
          textAlignVertical={textAlignVertical}
          className={`${baseCls} ${errorCls} ${disabledCls} ${className ?? ""} ${inputClassName ?? ""}`}
        />
      )}
    />
  );
}

export default TextInput;
