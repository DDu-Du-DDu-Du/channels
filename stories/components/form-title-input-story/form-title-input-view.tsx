import { useState } from "react";
import { View } from "react-native";

import { FormTitleInput } from "@/components";

export interface FormTitleInputViewProps {
  placeholder?: string;
  required?: boolean;
}

function FormTitleInputView({
  placeholder = "목표 제목을 입력하세요",
  required = false,
}: FormTitleInputViewProps) {
  const [value, setValue] = useState("");

  return (
    <View className="flex-1 items-center justify-center bg-main px-[2.4rem]">
      <View className="w-full">
        <FormTitleInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          required={required}
        />
      </View>
    </View>
  );
}

export default FormTitleInputView;
