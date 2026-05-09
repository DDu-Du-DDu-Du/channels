import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { ArrowLeftIcon } from "@/icons";

export interface TodosearchHeaderProps {
  onBackPress: () => void;
}

function TodosearchHeader({ onBackPress }: TodosearchHeaderProps) {
  const { t } = useTranslation();

  return (
    <View className="h-[5.2rem] w-full flex-row items-center justify-center px-2">
      <Pressable
        onPress={onBackPress}
        hitSlop={8}
        className="absolute left-2 z-10 h-[3.2rem] w-[3.2rem] items-center justify-center"
      >
        <ArrowLeftIcon
          size={16}
          stroke="#FFFFFF"
        />
      </Pressable>
      <SpoqaText
        weight="bold"
        className="text-size17 text-role-text-inverse dark:text-role-dark-text-inverse"
      >
        {t("navigation.todoSearch")}
      </SpoqaText>
    </View>
  );
}

export default TodosearchHeader;
