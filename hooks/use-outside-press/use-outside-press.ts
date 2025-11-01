import { useEffect, useMemo } from "react";
import { Gesture } from "react-native-gesture-handler";

import {
  OutsidePressContextType,
  useOutsidePressContext,
} from "@/providers/outside-press-provider/outside-press-provider";

function useOutsidePress(enabled: boolean = false, callback: () => void) {
  const { outsideGesture, onOutsidePress }: OutsidePressContextType = useOutsidePressContext();

  useEffect(() => {
    onOutsidePress(enabled ? callback : null);
  }, [callback, enabled, onOutsidePress]);

  return useMemo(
    () => Gesture.Tap().blocksExternalGesture(outsideGesture).maxDuration(10_000).enabled(enabled),
    [enabled, outsideGesture],
  );
}

export default useOutsidePress;
