import React from "react";
import { View } from "react-native";

export interface IconViewerProps {
  label?: string;
  children: React.ReactNode;
}

function IconViewer({ children }: IconViewerProps) {
  return (
    <View className="flex-1 w-full items-center justify-center">
      <View
        className="items-center justify-center w-[6rem] h-[6rem] rounded-[0.5rem]"
        style={{ borderColor: "#4c4c4cff", borderWidth: 1 }}
      >
        {children}
      </View>
    </View>
  );
}

export default IconViewer;
