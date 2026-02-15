import { View } from "react-native";

import { FormSection } from "@/components";
import { ArrowRightIcon } from "@/icons";

export interface FormSectionViewProps {
  label?: string;
  withPress?: boolean;
  onPress?: () => void;
}

function FormSectionView({
  label = "반복 뚜두 만들기",
  withPress = true,
  onPress,
}: FormSectionViewProps) {
  return (
    <View className="flex-1 items-center justify-center bg-main px-[2.4rem]">
      <FormSection
        label={label}
        rightContent={
          <ArrowRightIcon
            size={14}
            stroke="#FFFFFF"
          />
        }
        onPress={withPress ? (onPress ?? (() => {})) : undefined}
      />
    </View>
  );
}

export default FormSectionView;
