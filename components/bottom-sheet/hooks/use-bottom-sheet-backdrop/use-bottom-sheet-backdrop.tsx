import { useCallback } from "react";

import {
  BottomSheetBackdrop as GorhomBackdrop,
  BottomSheetBackdropProps as GorhomBackdropProps,
} from "@gorhom/bottom-sheet";

export interface BottomSheetBackdropProps {
  openAlways?: boolean;
  opacity?: number;
}

function useBottomSheetBackdrop({ openAlways = true, opacity = 0.1 }: BottomSheetBackdropProps) {
  return useCallback(
    (props: GorhomBackdropProps) => (
      <GorhomBackdrop
        {...props}
        opacity={opacity}
        disappearsOnIndex={openAlways ? -1 : 0}
        appearsOnIndex={openAlways ? 0 : 1}
        pressBehavior="close"
      />
    ),
    [opacity, openAlways],
  );
}

export default useBottomSheetBackdrop;
