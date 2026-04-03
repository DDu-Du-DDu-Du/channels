import React, { useState } from "react";
import { Pressable, View } from "react-native";

import { AlarmSheet, SpoqaText } from "@/components";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export interface AlarmSheetViewProps {
  onClose?: () => void;
  todoId?: number;
}

function AlarmSheetView({ onClose, todoId = 1 }: AlarmSheetViewProps) {
  const [open, setOpen] = useState(false);

  return (
    <BottomSheetModalProvider>
      <View className="flex-1 items-center justify-center p-4">
        {!open ? (
          <Pressable
            onPress={() => setOpen(true)}
            className="px-4 py-2 bg-role-surface-muted dark:bg-role-dark-surface-muted rounded-radius10"
          >
            <SpoqaText className="text-role-text-inverse dark:text-role-dark-text-inverse">
              Open AlarmSheet
            </SpoqaText>
          </Pressable>
        ) : (
          <AlarmSheet
            todoId={todoId}
            onClose={() => {
              onClose?.();
              setOpen(false);
            }}
          />
        )}
      </View>
    </BottomSheetModalProvider>
  );
}

export default AlarmSheetView;
