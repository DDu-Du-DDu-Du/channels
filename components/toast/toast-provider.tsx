import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { useToastStore } from "@/components/toast/store";

import { ToastItem } from "./components";

export interface ToastProviderProps {
  children: React.ReactNode;
}

function ToastProvider({ children }: ToastProviderProps) {
  const { toastList, removeToast } = useToastStore();

  return (
    <>
      {children}
      <View
        pointerEvents="box-none"
        style={styles.container}
      >
        <View style={styles.stack}>
          {toastList.map(({ id, message, deleteTime, type }) => (
            <ToastItem
              key={id}
              id={id}
              message={message}
              deleteTime={deleteTime}
              type={type}
              onClose={removeToast}
            />
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: Platform.select({ ios: 16, android: 16, default: 16 }),
    alignItems: "center",
  },
  stack: {
    maxWidth: 320,
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  stub: {},
});

export default ToastProvider;
