import React, { useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import { useBottomSheetBackdrop } from "./hooks";

export interface BottomSheetProps {
  children: React.ReactNode;
  ref: React.RefObject<BottomSheetModal | null>;
  onClose?: () => void;
  onBackdropPress?: () => void;
  defaultHeight?: string | number;
  maxHeight?: string | number;
  fitContent?: boolean;
  maxWidth?: number; // responsive max width (e.g., 768)
  enablePanDownToClose?: boolean;
  backdropPressBehavior?: "none" | "close" | "collapse" | number;
}

function BottomSheet({
  children,
  ref,
  onClose,
  onBackdropPress,
  defaultHeight = "35%",
  maxHeight = "80%",
  fitContent = false,
  maxWidth = 700,
  enablePanDownToClose = true,
  backdropPressBehavior = "close",
}: BottomSheetProps) {
  const snapPoint = useMemo(
    () => (fitContent ? [] : [defaultHeight, maxHeight]),
    [defaultHeight, fitContent, maxHeight],
  );
  const bottomSheetBackdrop = useBottomSheetBackdrop({
    pressBehavior: backdropPressBehavior,
    onPress: onBackdropPress,
  });
  const { width: screenWidth } = useWindowDimensions();
  const isWide = screenWidth > maxWidth || Platform.OS === "web";
  const sideMargin = isWide ? Math.max(0, (screenWidth - maxWidth) / 2) : 0;

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoint}
      enableOverDrag={false}
      enableDynamicSizing={fitContent}
      enablePanDownToClose={enablePanDownToClose}
      detached={isWide}
      style={isWide ? { marginHorizontal: sideMargin } : undefined}
      backdropComponent={bottomSheetBackdrop}
      onDismiss={onClose}
    >
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheetModal>
  );
}

export default BottomSheet;
