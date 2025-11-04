import { Pressable, View } from "react-native";

interface ColorPickerInputProps {
  color: string;
  isChecked: boolean;
  disabled?: boolean;
  onPress: (color: string) => void;
}

function ColorPickerInput({ color, isChecked, disabled, onPress }: ColorPickerInputProps) {
  const handlePress = () => {
    if (disabled) {
      return;
    }

    onPress(color);
  };

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: isChecked, disabled: !!disabled }}
      onPress={handlePress}
      className="items-center justify-center"
    >
      <View
        className="h-[3.2rem] w-[3.2rem] rounded-circle"
        style={{
          backgroundColor: color,
          opacity: disabled ? 0.35 : 1,
          boxShadow: [
            { offsetX: 0, offsetY: 0, blurRadius: isChecked ? 6 : 0, color: "#767676ff" },
          ],
        }}
      />
    </Pressable>
  );
}

export default ColorPickerInput;
