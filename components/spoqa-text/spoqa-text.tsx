import React from "react";
import { Text } from "react-native";

type FontWeight = "thin" | "regular" | "medium" | "semiBold" | "bold";

const fontWeights = {
  thin: "font-spoqa-thin",
  regular: "font-spoqa-regular",
  medium: "font-spoqa-medium",
  semiBold: "font-spoqa-semiBold",
  bold: "font-spoqa-bold",
};

export interface SpoqaTextProps {
  children: React.ReactNode;
  className?: string;
  weight?: FontWeight;
}

function SpoqaText({ children, className, weight = "regular", ...others }: SpoqaTextProps) {
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
