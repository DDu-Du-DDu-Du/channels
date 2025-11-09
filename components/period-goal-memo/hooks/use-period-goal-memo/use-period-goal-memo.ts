import { useCallback, useRef, useState } from "react";
import type { TextInput } from "react-native";

interface UsePeriodGoalMemoProps {
  onBlur?: () => void;
}

// Assumes 1rem = 10px as used across design tokens
const REM_BASE_PX = 10;
const MIN_REM = 4.6;
const MAX_REM = 20;
const MIN_HEIGHT_PX = MIN_REM * REM_BASE_PX;
const MAX_HEIGHT_PX = MAX_REM * REM_BASE_PX;

function usePeriodGoalMemo({ onBlur }: UsePeriodGoalMemoProps) {
  const inputRef = useRef<TextInput | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [height, setHeight] = useState<number>(MIN_HEIGHT_PX);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setHeight(MAX_HEIGHT_PX);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setHeight(MIN_HEIGHT_PX);
    inputRef.current?.blur();
    onBlur?.();
  }, [onBlur]);

  const handleOutsidePress = useCallback(() => {
    setHeight(MIN_HEIGHT_PX);
    inputRef.current?.blur();
  }, []);

  return {
    inputRef,
    isFocused,
    handleFocus,
    handleBlur,
    handleOutsidePress,
    height,
  } as const;
}

export default usePeriodGoalMemo;
