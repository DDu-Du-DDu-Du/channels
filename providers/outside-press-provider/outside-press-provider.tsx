import React, { createContext, useCallback, useContext, useRef } from "react";
import { View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  GestureType,
} from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export type OutsidePressContextType = {
  outsideGesture: GestureType;
  onOutsidePress: (callback: (() => void) | null) => void;
};

const OutsidePressContext = createContext<OutsidePressContextType | null>(null);

export function useOutsidePressContext() {
  const context = useContext(OutsidePressContext);

  if (!context) {
    throw new Error("OutsidePressContext cannot be made without OutsidePressContextProvider");
  }

  return context;
}

function OutsidePressProvider({ children }: React.PropsWithChildren) {
  const ref = useRef(new Map<string, () => void>());
  const callbackRef = useSharedValue<string>("");
  const onOutsidePress = (callback: (() => void) | null) => {
    callbackRef.value = callback?.name ?? "";

    if (callback) {
      ref.current.set(callback.name, callback);
    }
  };
  const handleOutsidePress = useCallback((key: string) => {
    const callback = ref.current.get(key);
    if (callback) callback();
  }, []);

  const outsideGesture = Gesture.Tap()
    .maxDuration(9_000)
    .onEnd(() => {
      if (callbackRef.value.length) {
        scheduleOnRN(handleOutsidePress, callbackRef.value);
      }
    });

  return (
    <GestureHandlerRootView>
      <OutsidePressContext.Provider value={{ outsideGesture, onOutsidePress }}>
        <GestureDetector gesture={outsideGesture}>
          <View
            collapsable={false}
            style={{ flex: 1 }}
          >
            {children}
          </View>
        </GestureDetector>
      </OutsidePressContext.Provider>
    </GestureHandlerRootView>
  );
}

export default OutsidePressProvider;
