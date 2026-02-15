import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";
import { OptionIcon } from "@/icons";

export interface MainDDuDuItemProps {
  id: number;
  ddudu: string;
  status: "UNCOMPLETED" | "COMPLETE";
  color: string;
  onDDuDuCompleteToggle: (id: number) => void;
  onTextPress: (id: number) => void;
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

  const handleDDuDuCompleteToggle = () => {
    onDDuDuCompleteToggle(id);
  };

  const handleEditMode = () => {
    onTextPress(id);
  };

  return (
    <View className="flex-row items-center justify-between">
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isComplete }}
        className="relative items-center justify-center w-[2rem] h-[2rem] rounded-circle border-2 bg-white mr-[1rem]"
        style={{ borderColor: `#${color}` }}
        onPress={handleDDuDuCompleteToggle}
      >
        {isComplete && (
          <View
            className="w-[1rem] h-[1rem] rounded-circle"
            style={{ backgroundColor: `#${color}` }}
          />
        )}
      </Pressable>
      <Pressable
        className="flex-1 py-[0.5rem] px-[0.5rem]"
        onPress={handleEditMode}
      >
        <SpoqaText
          weight="regular"
          className={isComplete ? "line-through" : ""}
        >
          {ddudu}
        </SpoqaText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="ml-[0.5rem] p-[0.5rem] pr-[0]"
        onPress={handleToggleOn}
      >
        <OptionIcon fill="#ccc" />
      </Pressable>
    </View>
  );
}

export default MainDDuDuItem;
