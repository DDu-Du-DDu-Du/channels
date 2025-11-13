import { useCallback, useRef, useState } from "react";
import type { TextInput } from "react-native";

import { remToPx } from "@/utils";

interface UsePeriodGoalMemoProps {
  onBlur?: () => void;
  minHeight?: number | string;
  maxHeight?: number | string;
}

function usePeriodGoalMemo({
  onBlur,
  minHeight = "4.6rem",
  maxHeight = "20rem",
}: UsePeriodGoalMemoProps) {
  const MIN_HEIGHT_PX = remToPx(minHeight);
  const MAX_HEIGHT_PX = remToPx(maxHeight);
  const inputRef = useRef<TextInput | null>(null);
  const [height, setHeight] = useState<number>(MIN_HEIGHT_PX);

  const handleFocus = useCallback(() => {
    setHeight(MAX_HEIGHT_PX);
  }, [MAX_HEIGHT_PX]);

  const handleBlur = useCallback(() => {
    setHeight(MIN_HEIGHT_PX);
    onBlur?.();
  }, [MIN_HEIGHT_PX, onBlur]);

  return {
    inputRef,
    handleFocus,
    handleBlur,
    height,
  };
}

export default usePeriodGoalMemo;
