import { Pressable } from "react-native";

interface Props {
  open: boolean;
  onPress: () => void;
}

function Backdrop({ open, onPress }: Props) {
  if (!open) {
    return;
  }

  return (
    <Pressable
      className="absolute inset-0 cursor-default w-screen h-screen"
      onPress={onPress}
    />
  );
}

export default Backdrop;
