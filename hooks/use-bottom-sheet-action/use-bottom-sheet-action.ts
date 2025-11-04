import { useCallback, useRef } from "react";

import { type BottomSheetModal } from "@gorhom/bottom-sheet";

function useBottomSheetAction() {
  const ref = useRef<BottomSheetModal>(null);

  const openSheet = useCallback(() => {
    ref.current?.present();
  }, []);

  const closeSheet = useCallback(() => {
    ref.current?.dismiss();
  }, []);

  const snapToDefault = useCallback(() => {
    ref.current?.snapToIndex(0);
  }, []);

  const snapToMax = useCallback(() => {
    ref.current?.snapToIndex(1);
  }, []);

  return { ref, openSheet, closeSheet, snapToDefault, snapToMax };
}

export default useBottomSheetAction;
