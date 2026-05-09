import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { SelectChip } from "@/components";

export type RepeatTypeValue = "DAILY" | "WEEKLY" | "MONTHLY";

export interface RepeatTypePickerProps {
  value: RepeatTypeValue;
  onChange: (value: RepeatTypeValue) => void;
}

function RepeatTypePicker({ value, onChange }: RepeatTypePickerProps) {
  const { t } = useTranslation();

  return (
    <View className="rounded-radius15 border border-role-border-strong dark:border-role-dark-border-strong bg-role-surface-canvas dark:bg-role-dark-surface-canvas p-[0.8rem]">
      <View className="flex-row gap-[0.6rem]">
        <SelectChip
          label={t("repeatTodo.daily")}
          selected={value === "DAILY"}
          onPress={() => onChange("DAILY")}
          className="flex-1"
        />
        <SelectChip
          label={t("repeatTodo.weekly")}
          selected={value === "WEEKLY"}
          onPress={() => onChange("WEEKLY")}
          className="flex-1"
        />
        <SelectChip
          label={t("repeatTodo.monthly")}
          selected={value === "MONTHLY"}
          onPress={() => onChange("MONTHLY")}
          className="flex-1"
        />
      </View>
    </View>
  );
}

export default RepeatTypePicker;
