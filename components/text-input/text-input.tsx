import { Controller, FieldErrors, RegisterOptions, useFormContext } from "react-hook-form";
import { TextInput as RNTextInput } from "react-native";

import { useThemeColorToken } from "@/hooks/use-theme-color";

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
  const inputBg = useThemeColorToken("ui.input.default.bg");
  const inputText = useThemeColorToken("ui.input.default.text");
  const placeholderText = useThemeColorToken("ui.input.default.placeholder");
  const inputBorder = useThemeColorToken("ui.input.default.border");
  const inputFocusBorder = useThemeColorToken("ui.input.focus.border");
  const errorBorder = useThemeColorToken("role.status.error");

  const baseCls = multiline
    ? "w-full rounded-radius15 px-[1.2rem] text-size15"
    : "w-full h-[5.6rem] rounded-radius15 px-[1.2rem] text-size15";
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
          placeholderTextColor={placeholderText}
          maxLength={maxLength}
          multiline={multiline}
          textAlignVertical={textAlignVertical}
          style={{
            backgroundColor: inputBg,
            color: inputText,
            borderColor: hasError ? errorBorder : inputBorder,
            borderWidth: 1,
          }}
          className={`${baseCls} ${disabledCls} ${className ?? ""} ${inputClassName ?? ""}`}
          selectionColor={inputFocusBorder}
        />
      )}
    />
  );
}

export default TextInput;
