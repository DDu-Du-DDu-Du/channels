import { View } from "react-native";

import { FormHeader } from "@/components";

export interface FormHeaderViewProps {
  title?: string;
  onPressBack?: () => void;
}

function FormHeaderView({ title = "목표등록", onPressBack }: FormHeaderViewProps) {
  return (
    <View className="flex-1 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg">
      <FormHeader
        title={title}
        onPressBack={onPressBack ?? (() => {})}
      />
    </View>
  );
}

export default FormHeaderView;
