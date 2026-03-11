import { View } from "react-native";

import QuestionIcon from "@/icons/question-icon/question-icon";

export interface ExampleIconProps {
  size?: number;
}

function ExampleIcon({ size = 32 }: ExampleIconProps) {
  const iconSize = size * 0.6;

  return (
    <View
      className="bg-role-surface-muted dark:bg-role-dark-surface-muted rounded-circle items-center justify-center"
      style={{ width: size, height: size }}
    >
      <QuestionIcon
        size={iconSize}
        fill="#B6B6B6"
      />
    </View>
  );
}

export default ExampleIcon;
