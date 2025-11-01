import { PropsWithChildren } from "react";
import { GestureDetector } from "react-native-gesture-handler";

import { useOutsidePress } from "@/hooks";

interface OutsidePressBackdropProps {
  open: boolean;
  onOutsidePress: () => void;
}

function OutsidePressBackdrop({
  open,
  onOutsidePress,
  children,
}: PropsWithChildren<OutsidePressBackdropProps>) {
  const gesture = useOutsidePress(open, onOutsidePress);

  return <GestureDetector gesture={gesture}>{children}</GestureDetector>;
}

export default OutsidePressBackdrop;
