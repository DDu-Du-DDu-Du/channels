import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";

export interface ButtonProps {
  label: string;
  onPress: () => void;
  className?: string;
  bodyClassName?: string;
  labelClassName?: string;
}

function Button({
  label,
  onPress,
  className,
  bodyClassName = "bg-white_100",
  labelClassName = "text-black",
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={className}
    >
      <View
        className={`h-[5.6rem] w-full items-center justify-center rounded-radius15 px-[1.2rem] ${bodyClassName}`}
      >
        <SpoqaText
          weight="semiBold"
          className={`text-size15 ${labelClassName}`}
        >
          {label}
        </SpoqaText>
      </View>
    </Pressable>
  );
}

export default Button;
