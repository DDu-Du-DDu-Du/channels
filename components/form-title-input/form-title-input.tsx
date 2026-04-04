import { type ComponentProps, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { View } from "react-native";

import SpoqaText from "../spoqa-text/spoqa-text";
import TextInput from "../text-input/text-input";

interface FormTitleInputBaseProps {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
  multiline?: boolean;
  textAlignVertical?: "auto" | "top" | "center" | "bottom";
  autoFocus?: boolean;
  returnKeyType?: "default" | "done" | "go" | "next" | "search" | "send";
  style?: ComponentProps<typeof TextInput>["style"];
  onSubmitEditing?: ComponentProps<typeof TextInput>["onSubmitEditing"];
  required?: boolean;
}

interface FormTitleInputFormModeProps extends FormTitleInputBaseProps {
  name: string;
  options?: ComponentProps<typeof TextInput> extends { options?: infer T } ? T : never;
  value?: never;
  onChangeText?: never;
  onBlur?: never;
}

interface FormTitleInputControlledModeProps extends FormTitleInputBaseProps {
  name?: never;
  options?: never;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: ComponentProps<typeof TextInput> extends { onBlur?: infer T } ? T : never;
}

export type FormTitleInputProps = FormTitleInputFormModeProps | FormTitleInputControlledModeProps;

function FormTitleInput({ required = false, className, ...inputProps }: FormTitleInputProps) {
  const formContext = useFormContext();
  const fieldName = "name" in inputProps ? inputProps.name : undefined;
  const watchedValue = fieldName && formContext ? formContext.watch(fieldName) : undefined;

  const currentValue = useMemo(() => {
    if ("value" in inputProps) {
      return inputProps.value ?? "";
    }

    return typeof watchedValue === "string" ? watchedValue : "";
  }, [inputProps, watchedValue]);

  return (
    <View
      className={`relative rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.2rem] ${className ?? ""}`}
    >
      {required && !currentValue && (
        <View
          className="absolute left-[1.2rem] top-1/2 z-10 -translate-y-1/2"
          style={{ pointerEvents: "none" }}
        >
          <SpoqaText className="text-size15 text-role-status-error dark:text-role-dark-status-error">
            {"*"}
          </SpoqaText>
        </View>
      )}
      {"name" in inputProps
        ? (() => {
            const formProps = inputProps as FormTitleInputFormModeProps;

            return (
              <TextInput
                name={formProps.name}
                options={formProps.options}
                placeholder={formProps.placeholder}
                disabled={formProps.disabled}
                maxLength={formProps.maxLength}
                multiline={formProps.multiline}
                textAlignVertical={formProps.textAlignVertical}
                autoFocus={formProps.autoFocus}
                returnKeyType={formProps.returnKeyType}
                onSubmitEditing={formProps.onSubmitEditing}
                style={formProps.style}
                className={`h-[5.6rem] ${required ? "pl-[1.2rem]" : ""}`}
              />
            );
          })()
        : (() => {
            const controlledProps = inputProps as FormTitleInputControlledModeProps;

            return (
              <TextInput
                value={controlledProps.value}
                onChangeText={controlledProps.onChangeText}
                onBlur={controlledProps.onBlur}
                placeholder={controlledProps.placeholder}
                disabled={controlledProps.disabled}
                maxLength={controlledProps.maxLength}
                multiline={controlledProps.multiline}
                textAlignVertical={controlledProps.textAlignVertical}
                autoFocus={controlledProps.autoFocus}
                returnKeyType={controlledProps.returnKeyType}
                onSubmitEditing={controlledProps.onSubmitEditing}
                style={controlledProps.style}
                className={`h-[5.6rem] ${required ? "pl-[1.2rem]" : ""}`}
              />
            );
          })()}
    </View>
  );
}

export default FormTitleInput;
