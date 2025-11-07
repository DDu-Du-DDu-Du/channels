import React from "react";
import { Text, TextProps } from "react-native";

type FontWeight = "thin" | "regular" | "medium" | "semiBold" | "bold";

const fontWeights = {
  thin: "font-spoqa-thin",
  regular: "font-spoqa-regular",
  medium: "font-spoqa-medium",
  semiBold: "font-spoqa-semiBold",
  bold: "font-spoqa-bold",
};

export interface SpoqaTextProps extends TextProps {
  children: React.ReactNode;
  weight?: FontWeight;
}

function SpoqaText({ children, className, weight = "medium", ...others }: SpoqaTextProps) {
  return (
    <Text
      className={`${fontWeights[weight]} ${className ?? ""}`}
      {...others}
    >
      {children}
    </Text>
  );
}

export default SpoqaText;
