import { ActivityIndicator, Pressable, View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { useThemeColorToken } from "@/hooks/use-theme-color";

export interface ButtonProps {
  label: string;
  onPress: () => void;
  className?: string;
  bodyClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  isLoading?: boolean;
  loadingIndicatorColor?: string;
}

function Button({
  label,
  onPress,
  className,
  bodyClassName = "bg-role-surface-canvas dark:bg-role-dark-surface-canvas",
  labelClassName = "text-role-text-primary dark:text-role-dark-text-primary",
  disabled = false,
  isLoading = false,
  loadingIndicatorColor,
}: ButtonProps) {
  const defaultLoadingColor = useThemeColorToken("role.text.inverse");
  const resolvedLoadingColor = loadingIndicatorColor ?? defaultLoadingColor;
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={className}
    >
      <View
        className={`h-[5.6rem] w-full items-center justify-center rounded-radius15 px-[1.2rem] ${bodyClassName} ${
          isDisabled ? "opacity-60" : ""
        }`}
      >
        {isLoading ? (
          <ActivityIndicator color={resolvedLoadingColor} />
        ) : (
          <SpoqaText
            weight="semiBold"
            className={`text-size15 ${labelClassName}`}
          >
            {label}
          </SpoqaText>
        )}
      </View>
    </Pressable>
  );
}

export default Button;
