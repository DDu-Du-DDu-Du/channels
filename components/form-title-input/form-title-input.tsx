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
    <View className={`relative rounded-radius15 bg-white_100 px-[1.2rem] ${className ?? ""}`}>
      {required && !value && (
        <View
          pointerEvents="none"
          className="absolute left-[1.2rem] top-1/2 z-10 -translate-y-1/2"
        >
          <SpoqaText className="text-size15 text-example_red_500">{"*"}</SpoqaText>
        </View>
      )}
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor="#B5B5B5"
        className={`h-[5.6rem] text-size15 text-black ${required ? "pl-[1.2rem]" : ""}`}
      />
    </View>
  );
}

export default FormTitleInput;
