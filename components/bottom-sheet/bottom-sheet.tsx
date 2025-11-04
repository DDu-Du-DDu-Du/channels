import React, { useMemo } from "react";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import { useBottomSheetBackdrop } from "./hooks";

export interface BottomSheetProps {
  children: React.ReactNode;
  ref: React.RefObject<BottomSheetModal | null>;
  onClose?: () => void;
  defaultHeight?: string | number;
  maxHeight?: string | number;
  fitContent?: boolean;
}

function BottomSheet({
  children,
  ref,
  onClose,
  defaultHeight = "35%",
  maxHeight = "80%",
  fitContent = false,
}: BottomSheetProps) {
  const snapPoint = useMemo(
    () => (fitContent ? [] : [defaultHeight, maxHeight]),
    [defaultHeight, fitContent, maxHeight],
  );
  const bottomSheetBackdrop = useBottomSheetBackdrop({});

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoint}
      enableOverDrag={false}
      enableDynamicSizing={fitContent}
      enablePanDownToClose
      backdropComponent={bottomSheetBackdrop}
      onDismiss={onClose}
    >
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheetModal>
  );
}

export default BottomSheet;
