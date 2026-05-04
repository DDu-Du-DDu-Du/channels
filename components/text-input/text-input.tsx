import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleProp,
  TextStyle,
} from "react-native";

import { useThemeColorToken } from "@/hooks/use-theme-color";

export type TextInputProps = RNTextInputProps & {
  className?: string;
  style?: StyleProp<TextStyle>;
};

function TextInput({
  className,
  multiline,
  style,
  placeholderTextColor,
  selectionColor,
  ...props
}: TextInputProps) {
  const inputBg = useThemeColorToken("ui.input.default.bg");
  const inputText = useThemeColorToken("ui.input.default.text");
  const defaultPlaceholderText = useThemeColorToken("ui.input.default.placeholder");
  const inputBorder = useThemeColorToken("ui.input.default.border");
  const defaultInputFocusBorder = useThemeColorToken("ui.input.focus.border");

  const baseCls = multiline
    ? "w-full rounded-radius15 px-[1.2rem] text-size15 outline-none"
    : "w-full h-[5.6rem] rounded-radius15 px-[1.2rem] text-size15 outline-none";
  const inputClassNames = `${baseCls} ${className ?? ""}`;

  const baseInputStyle = {
    backgroundColor: inputBg,
    color: inputText,
    borderWidth: 1,
    borderColor: inputBorder,
  };

  return (
    <RNTextInput
      {...props}
      multiline={multiline}
      placeholderTextColor={placeholderTextColor ?? defaultPlaceholderText}
      selectionColor={selectionColor ?? defaultInputFocusBorder}
      style={[baseInputStyle, style]}
      className={inputClassNames}
    />
  );
}

export default TextInput;
