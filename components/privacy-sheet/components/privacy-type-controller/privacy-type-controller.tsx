import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";

import type { PrivacyItemType } from "../../privacy-sheet.types";
import { SheetRadioItem } from "../index";

interface PrivacyTypeControllerProps {
  name?: string;
  list: PrivacyItemType[];
}

function PrivacyTypeController({ name = "privacyType", list }: PrivacyTypeControllerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <View className="mb-[2.1rem] px-[0.4rem]">
          {list.map(({ id, icon, label, value: v }) => (
            <SheetRadioItem
              key={id}
              icon={icon}
              label={label}
              checked={value === v}
              onPress={() => onChange(v)}
            />
          ))}
        </View>
      )}
    />
  );
}

export default PrivacyTypeController;
