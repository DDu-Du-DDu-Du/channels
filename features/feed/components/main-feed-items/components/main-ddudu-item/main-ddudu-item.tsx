import { Pressable, View } from "react-native";

import { ShakingCheckIcon, SpoqaText } from "@/components";
import { OptionIcon } from "@/icons";
import { hexConvertForRGBA } from "@/utils";

export interface MainDDuDuItemProps {
  id: number;
  ddudu: string;
  status: "UNCOMPLETED" | "COMPLETE";
  color: string;
  onDDuDuCompleteToggle: (id: number) => void;
  onTextPress?: (id: number) => void;
  handleToggleOn: () => void;
}

function MainDDuDuItem({
  id,
  ddudu,
  status,
  color,
  onDDuDuCompleteToggle,
  onTextPress,
  handleToggleOn,
}: MainDDuDuItemProps) {
  const isComplete = status === "COMPLETE";

  const handleEditMode = () => {
    onTextPress?.(id);
  };

  const handlePressComplete = () => {
    onDDuDuCompleteToggle(id);
  };

  const leftBackgroundColor = hexConvertForRGBA({ hex: color, alpha: 0.12 });
  const rightBackgroundColor = hexConvertForRGBA({ hex: color, alpha: 0.2 });

  return (
    <View className="w-full flex-row overflow-hidden">
      <Pressable
        className="w-[80%] flex-row items-center"
        style={{ backgroundColor: leftBackgroundColor }}
        onPress={handleEditMode}
      >
        <View className="w-[25%] items-center justify-center py-[0.9rem]">
          <ShakingCheckIcon
            isChecked={isComplete}
            color={color}
            size={24}
            onPress={handlePressComplete}
          />
        </View>
        <View className="w-[75%] py-[0.9rem] pl-[0.6rem] pr-[1.1rem]">
          <SpoqaText
            weight="regular"
            className="text-size14 text-role-text-primary dark:text-role-dark-text-primary"
            numberOfLines={1}
          >
            {ddudu}
          </SpoqaText>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="h-full w-[20%] items-center justify-center"
        style={{ backgroundColor: rightBackgroundColor }}
        onPress={handleToggleOn}
      >
        <OptionIcon fill={`#${color}`} />
      </Pressable>
    </View>
  );
}

export default MainDDuDuItem;
