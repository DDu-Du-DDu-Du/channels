import { useCallback } from "react";

import {
  BottomSheetBackdrop as GorhomBackdrop,
  BottomSheetBackdropProps as GorhomBackdropProps,
} from "@gorhom/bottom-sheet";

export interface BottomSheetBackdropProps {
  openAlways?: boolean;
  opacity?: number;
  pressBehavior?: "none" | "close" | "collapse" | number;
  onPress?: () => void;
}

function useBottomSheetBackdrop({
  openAlways = true,
  opacity = 0.1,
  pressBehavior = "close",
  onPress,
}: BottomSheetBackdropProps) {
  return useCallback(
    (props: GorhomBackdropProps) => (
      <GorhomBackdrop
        {...props}
        opacity={opacity}
        disappearsOnIndex={openAlways ? -1 : 0}
        appearsOnIndex={openAlways ? 0 : 1}
        pressBehavior={pressBehavior}
        onPress={onPress}
      />
    ),
    [onPress, opacity, openAlways, pressBehavior],
  );
}

export default useBottomSheetBackdrop;
