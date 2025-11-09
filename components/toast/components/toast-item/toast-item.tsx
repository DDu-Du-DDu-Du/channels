import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  BounceInDown,
  Easing,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { ToastType } from "@/components/toast/toast-provider.type";
import { CloseIcon } from "@/icons";

import { useToastTypeColor } from "./hooks";

export interface ToastItemProps {
  id: string;
  message: string;
  deleteTime: number;
  type: ToastType;
  onClose: (id: string) => void;
}

const toastHeight = 54;
const toastWidth = 250;

function ToastItem({ id, message, deleteTime, type, onClose }: ToastItemProps) {
  const progress = useSharedValue(1);
  const fillColor = useToastTypeColor({ type });

  useEffect(() => {
    progress.value = withTiming(0, { duration: deleteTime, easing: Easing.linear });
  }, [deleteTime, progress]);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.value }],
  }));

  return (
    <Animated.View
      entering={BounceInDown.duration(200)}
      exiting={FadeOut}
    >
      <Animated.View style={styles.card}>
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          style={styles.closeBtn}
          onPress={() => onClose(id)}
        >
          <CloseIcon
            size={16}
            fill="#B6B6B6"
          />
        </Pressable>

        <View style={styles.messageBox}>
          <Animated.Text
            numberOfLines={2}
            style={styles.message}
          >
            {message}
          </Animated.Text>
        </View>

        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { backgroundColor: fillColor }, barStyle]} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: toastWidth,
    height: toastHeight,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    // simple shadow
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  closeBtn: {
    position: "absolute",
    top: 2,
    right: 2,
    padding: 6,
    zIndex: 1,
  },
  messageBox: {
    width: toastWidth,
    height: toastHeight - 4,
    paddingTop: 14,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  message: {
    fontSize: 14,
  },
  barTrack: {
    width: "100%",
    height: 5,
    backgroundColor: "#9CA3AF", // example_gray_500 approx
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  barFill: {
    width: "100%",
    height: "100%",
    transformOrigin: "left",
  },
});

export default ToastItem;
