import { TextInput as RNTextInput, TextInputProps, View } from "react-native";

import SpoqaText from "../spoqa-text/spoqa-text";

export type FormTitleInputProps = Pick<
  TextInputProps,
  "value" | "onChangeText" | "onBlur" | "placeholder" | "className"
> & {
  required?: boolean;
};

function FormTitleInput({
  value,
  onChangeText,
  onBlur,
  placeholder,
  className,
  required = false,
}: FormTitleInputProps) {
  return (
    <View
      className={`relative rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.2rem] ${className ?? ""}`}
    >
      {required && !value && (
        <View
          className="absolute left-[1.2rem] top-1/2 z-10 -translate-y-1/2"
          style={{ pointerEvents: "none" }}
        >
          <SpoqaText className="text-size15 text-role-status-error dark:text-role-dark-status-error">
            {"*"}
          </SpoqaText>
        </View>
      )}
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor="#B5B5B5"
        className={`h-[5.6rem] text-size15 text-role-text-primary dark:text-role-dark-text-primary ${required ? "pl-[1.2rem]" : ""}`}
      />
    </View>
  );
}

export default FormTitleInput;
