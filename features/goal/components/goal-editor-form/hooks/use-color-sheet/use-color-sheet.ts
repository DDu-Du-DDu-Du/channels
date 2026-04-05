import { useEffect, useState } from "react";

import { COLOR_LIST } from "@/components/color-sheet/color-sheet.constant";

interface UseColorSheetProps {
  color?: string;
  onPick?: (color: string) => void;
}

const normalizeColor = (color?: string) => {
  if (!color) {
    return undefined;
  }

  return color.startsWith("#") ? color : `#${color}`;
};

const getRandomColor = () => {
  return COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)];
};

function useColorSheet({ color, onPick }: UseColorSheetProps) {
  const [pickedColor, setPickedColor] = useState(() => normalizeColor(color) ?? getRandomColor());
  const [isColorSheetOpen, setIsColorSheetOpen] = useState(false);

  useEffect(() => {
    const normalizedColor = normalizeColor(color);
    if (normalizedColor) {
      setPickedColor(normalizedColor);
    }
  }, [color]);

  const handlePressOpenColorSheet = () => {
    setIsColorSheetOpen(true);
  };

  const handleCloseColorSheet = () => {
    setIsColorSheetOpen(false);
  };

  const handlePickColor = (color: string) => {
    setPickedColor(color);
    onPick?.(color);
  };

  const handleResetColor = () => {
    const normalizedColor = normalizeColor(color);
    setPickedColor(normalizedColor ?? getRandomColor());
  };

  return {
    pickedColor,
    isColorSheetOpen,
    handlePressOpenColorSheet,
    handleCloseColorSheet,
    handlePickColor,
    handleResetColor,
  };
}

export default useColorSheet;
