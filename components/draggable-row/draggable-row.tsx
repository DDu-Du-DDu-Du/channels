import { useMemo } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  clamp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { IdType } from "../draggable-flat-list/draggable-flat-list";

interface DraggableRowProps<T> {
  id: IdType;
  item: T;
  index: number;
  rowHeight: number;
  itemHeight: number;
  itemSpacing: number;
  dataLength: number;
  renderItem: (params: { item: T; index: number; dragging: boolean }) => React.ReactNode;
  enabled: boolean;
  activeId: SharedValue<IdType | null>;
  activeIndex: SharedValue<number>;
  hoverIndex: SharedValue<number>;
  activeTranslationY: SharedValue<number>;
  onReorder: (from: number, to: number) => void;
  onAutoScroll?: (direction: "up" | "down") => void;
  scrollContainerHeight?: number;
  scrollContainerTop?: number;
  autoScrollThreshold?: number;
}

function DraggableRow<T>({
  id,
  item,
  index,
  itemHeight,
  itemSpacing,
  rowHeight,
  dataLength,
  renderItem,
  enabled,
  activeId,
  activeIndex,
  hoverIndex,
  activeTranslationY,
  onReorder,
  onAutoScroll,
  scrollContainerHeight = 0,
  scrollContainerTop = 0,
  autoScrollThreshold = 48,
}: DraggableRowProps<T>) {
  const rowIndex = index;
  const scale = useSharedValue(1);
  const TIME_TO_ACTIVATE_DRAG = 300;
  const lastAutoScrollTs = useSharedValue(0);

  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .enabled(enabled)
      .activateAfterLongPress(TIME_TO_ACTIVATE_DRAG)
      .onStart(() => {
        activeId.value = id;
        activeIndex.value = rowIndex;
        hoverIndex.value = rowIndex;
        activeTranslationY.value = 0;
        scale.value = withSpring(1.05);
      })
      .onUpdate((event) => {
        if (activeId.value !== id) return;

        activeTranslationY.value = event.translationY;

        const rawIndex = activeIndex.value + activeTranslationY.value / rowHeight;
        const nextHover = clamp(Math.round(rawIndex), 0, dataLength - 1);

        hoverIndex.value = nextHover;

        if (!onAutoScroll || !scrollContainerHeight) {
          return;
        }

        const now = performance.now();
        if (now - lastAutoScrollTs.value < 50) {
          return;
        }

        const upperEdge = autoScrollThreshold;
        const lowerEdge = scrollContainerHeight - autoScrollThreshold;
        const pointerY = event.absoluteY - scrollContainerTop;

        if (pointerY <= upperEdge) {
          lastAutoScrollTs.value = now;
          scheduleOnRN(onAutoScroll, "up");
        } else if (pointerY >= lowerEdge) {
          lastAutoScrollTs.value = now;
          scheduleOnRN(onAutoScroll, "down");
        }
      })
      .onEnd(() => {
        if (activeId.value !== id) {
          return;
        }

        const from = activeIndex.value;
        const to = hoverIndex.value;
        const delta = to - from;

        const finalOffset = delta * rowHeight;

        scale.value = withSpring(1.0);
        activeTranslationY.value = withSpring(finalOffset, {}, (finished) => {
          "worklet";
          if (finished) {
            scheduleOnRN(onReorder, from, to);

            activeId.value = null;
            activeIndex.value = -1;
            hoverIndex.value = -1;
            activeTranslationY.value = 0;
          }
        });
      })
      .onFinalize(() => {
        if (activeId.value === id) {
          scale.value = withSpring(1.0);
        }

        if (activeIndex.value === hoverIndex.value) {
          activeTranslationY.value = withSpring(0, {}, (finished) => {
            if (finished) {
              activeId.value = null;
              activeIndex.value = -1;
              hoverIndex.value = -1;
            }
          });
        }

        if (activeIndex.value === -1 || hoverIndex.value === -1) {
          activeId.value = null;
          activeIndex.value = -1;
          hoverIndex.value = -1;
        }
      });

    return pan;
  }, [
    enabled,
    activeId,
    id,
    activeIndex,
    rowIndex,
    hoverIndex,
    activeTranslationY,
    scale,
    rowHeight,
    dataLength,
    onAutoScroll,
    scrollContainerHeight,
    scrollContainerTop,
    lastAutoScrollTs,
    autoScrollThreshold,
    onReorder,
  ]);

  const animatedStyle = useAnimatedStyle(() => {
    const dragging = activeId.value === id;
    const hasActive = activeId.value !== null;

    const from = activeIndex.value;
    const to = hoverIndex.value;

    let offset = 0;

    if (dragging) {
      offset = activeTranslationY.value;
    } else if (hasActive && from !== -1 && to !== -1) {
      if (rowIndex > from && rowIndex <= to) {
        offset = -rowHeight;
      } else if (rowIndex < from && rowIndex >= to) {
        offset = rowHeight;
      } else {
        offset = 0;
      }
    } else {
      offset = 0;
    }

    let translateY = 0;

    if (dragging || hasActive) {
      translateY = withSpring(offset, { duration: 200, dampingRatio: 1.5 });
    }

    return {
      transform: [{ translateY }, { scale: scale.value }],
      zIndex: dragging ? 10 : 0,
      opacity: dragging ? 0.7 : 1,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        <Animated.View
          style={{
            height: itemHeight,
            marginBottom: itemSpacing,
          }}
        >
          {renderItem({
            item,
            index: rowIndex,
            dragging: false,
          })}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

export default DraggableRow;
