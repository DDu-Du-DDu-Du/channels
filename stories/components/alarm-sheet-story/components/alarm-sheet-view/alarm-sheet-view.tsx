import React, { useState } from "react";
import { Pressable, View } from "react-native";

import { AlarmSheet, SpoqaText } from "@/components";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export interface AlarmSheetViewProps {
  onClose?: () => void;
  onConfirm?: (payload: { enabled: boolean; day: number; hour: number; minute: number }) => void;
}

function AlarmSheetView({ onClose, onConfirm }: AlarmSheetViewProps) {
  const [open, setOpen] = useState(false);

  return (
    <BottomSheetModalProvider>
      <View className="flex-1 items-center justify-center p-4">
        {!open ? (
          <Pressable
            onPress={() => setOpen(true)}
            className="px-4 py-2 bg-example_gray_700 rounded-radius10"
          >
            <SpoqaText className="text-white">Open AlarmSheet</SpoqaText>
          </Pressable>
        ) : (
          <AlarmSheet
            isShow
            onClose={() => {
              onClose?.();
              setOpen(false);
            }}
            onConfirm={(p) => onConfirm?.(p)}
          />
        )}
      </View>
    </BottomSheetModalProvider>
  );
}

export default AlarmSheetView;
