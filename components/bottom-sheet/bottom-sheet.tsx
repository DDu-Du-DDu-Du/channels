import React, { useMemo } from "react";
import { Platform, StyleProp, ViewStyle, useWindowDimensions } from "react-native";

import { useThemeColorToken } from "@/hooks/use-theme-color";
import { BottomSheetModal, BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";

import { useBottomSheetBackdrop } from "./hooks";

export interface BottomSheetProps {
  children: React.ReactNode;
  ref: React.RefObject<BottomSheetModal | null>;
  onClose?: () => void;
  onBackdropPress?: () => void;
  defaultHeight?: string | number;
  maxHeight?: string | number;
  fitContent?: boolean;
  enableScroll?: boolean;
  maxWidth?: number; // responsive max width (e.g., 768)
  enablePanDownToClose?: boolean;
  backdropPressBehavior?: "none" | "close" | "collapse" | number;
  backdropOpacity?: number;
  backgroundStyle?: StyleProp<ViewStyle>;
  handleIndicatorStyle?: StyleProp<ViewStyle>;
  handleStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

function BottomSheet({
  children,
  ref,
  onClose,
  onBackdropPress,
  defaultHeight = "35%",
  maxHeight = "80%",
  fitContent = false,
  enableScroll = false,
  maxWidth = 700,
  enablePanDownToClose = true,
  backdropPressBehavior = "close",
  backdropOpacity = 0.1,
  backgroundStyle,
  handleIndicatorStyle,
  handleStyle,
  containerStyle,
}: BottomSheetProps) {
  const surfacePanel = useThemeColorToken("role.surface.panel");
  const borderDefault = useThemeColorToken("role.border.default");
  const snapPoint = useMemo(
    () => (fitContent ? [] : [defaultHeight, maxHeight]),
    [defaultHeight, fitContent, maxHeight],
  );
  const bottomSheetBackdrop = useBottomSheetBackdrop({
    pressBehavior: backdropPressBehavior,
    onPress: onBackdropPress,
    opacity: backdropOpacity,
  });
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isWide = screenWidth > maxWidth || Platform.OS === "web";
  const sideMargin = isWide ? Math.max(0, (screenWidth - maxWidth) / 2) : 0;
  const resolvedMaxDynamicContentSize = useMemo(() => {
    if (!fitContent) {
      return undefined;
    }

    if (typeof maxHeight === "number") {
      return maxHeight;
    }

    if (typeof maxHeight === "string" && maxHeight.endsWith("%")) {
      const ratio = Number.parseFloat(maxHeight.replace("%", ""));
      if (!Number.isNaN(ratio)) {
        return (screenHeight * ratio) / 100;
      }
    }

    return screenHeight * 0.8;
  }, [fitContent, maxHeight, screenHeight]);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoint}
      enableOverDrag={false}
      enableDynamicSizing={fitContent}
      maxDynamicContentSize={resolvedMaxDynamicContentSize}
      enablePanDownToClose={enablePanDownToClose}
      detached={isWide}
      style={[isWide ? { marginHorizontal: sideMargin } : undefined, containerStyle]}
      backgroundStyle={[{ backgroundColor: surfacePanel }, backgroundStyle]}
      handleStyle={handleStyle}
      handleIndicatorStyle={[{ backgroundColor: borderDefault }, handleIndicatorStyle]}
      backdropComponent={bottomSheetBackdrop}
      onDismiss={onClose}
    >
      {enableScroll ? (
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          {children}
        </BottomSheetScrollView>
      ) : (
        <BottomSheetView>{children}</BottomSheetView>
      )}
    </BottomSheetModal>
  );
}

export default BottomSheet;
