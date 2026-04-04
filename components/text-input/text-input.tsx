import { Controller, FieldErrors, RegisterOptions, useFormContext } from "react-hook-form";
import {
  NativeSyntheticEvent,
  StyleProp,
  TextInputProps as RNTextInputProps,
  TextStyle,
  TextInput as RNTextInput,
  TextInputSubmitEditingEventData,
} from "react-native";

import { useThemeColorToken } from "@/hooks/use-theme-color";

interface BaseTextInputProps {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  maxLength?: number;
  multiline?: boolean;
  textAlignVertical?: "auto" | "top" | "center" | "bottom";
  autoFocus?: boolean;
  returnKeyType?: "default" | "done" | "go" | "next" | "search" | "send";
  onSubmitEditing?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  style?: StyleProp<TextStyle>;
}

interface FormTextInputProps extends BaseTextInputProps {
  name: string;
  options?: RegisterOptions;
  value?: never;
  onChangeText?: never;
  onBlur?: never;
}

interface ControlledTextInputProps extends BaseTextInputProps {
  name?: never;
  options?: never;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: RNTextInputProps["onBlur"];
}

export type TextInputProps = FormTextInputProps | ControlledTextInputProps;

function TextInput({
  name,
  options,
  placeholder,
  disabled,
  className,
  inputClassName,
  maxLength,
  multiline,
  textAlignVertical,
  value,
  onChangeText,
  onBlur,
  autoFocus,
  returnKeyType,
  onSubmitEditing,
  style,
}: TextInputProps) {
  const isFormMode = typeof name === "string";
  const formContext = useFormContext();
  const hasError =
    isFormMode && formContext
      ? Boolean((formContext.formState.errors as FieldErrors)?.[name])
      : false;
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
  const inputClassNames = `${baseCls} ${disabledCls} ${className ?? ""} ${inputClassName ?? ""}`;

  if (isFormMode && !formContext) {
    if (__DEV__) {
      throw new Error("[TextInput] Form mode requires FormProvider/useFormContext.");
    }

    return null;
  }

  if (!isFormMode && (value === undefined || !onChangeText)) {
    if (__DEV__) {
      throw new Error("[TextInput] Controlled mode requires value and onChangeText.");
    }

    return null;
  }

  const baseInputStyle = {
    backgroundColor: inputBg,
    color: inputText,
    borderWidth: 1,
  };

  if (!isFormMode) {
    return (
      <RNTextInput
        value={value ?? ""}
        onChangeText={onChangeText}
        onBlur={onBlur}
        editable={!disabled}
        placeholder={placeholder}
        placeholderTextColor={placeholderText}
        maxLength={maxLength}
        multiline={multiline}
        textAlignVertical={textAlignVertical}
        autoFocus={autoFocus}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        style={[
          { ...baseInputStyle, borderColor: inputBorder },
          style,
        ]}
        className={inputClassNames}
        selectionColor={inputFocusBorder}
      />
    );
  }

  return (
    <Controller
      control={formContext.control}
      name={name}
      rules={options ?? {}}
      render={({ field: { value, onChange, onBlur } }) => (
        <RNTextInput
          value={typeof value === "string" ? value : ""}
          onChangeText={(nextValue) => onChange(nextValue)}
          onBlur={onBlur}
          editable={!disabled}
          placeholder={placeholder}
          placeholderTextColor={placeholderText}
          maxLength={maxLength}
          multiline={multiline}
          textAlignVertical={textAlignVertical}
          autoFocus={autoFocus}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          style={[
            { ...baseInputStyle, borderColor: hasError ? errorBorder : inputBorder },
            style,
          ]}
          className={inputClassNames}
          selectionColor={inputFocusBorder}
        />
      )}
    />
  );
}

export default TextInput;
