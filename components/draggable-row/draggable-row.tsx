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
  index: number; // FlatList에서 내려오는 "원래 index"
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
}: DraggableRowProps<T>) {
  const rowIndex = index; // worklet에서 캡쳐해서 사용
  const scale = useSharedValue(1);

  const gesture = useMemo(() => {
    const longPress = Gesture.LongPress()
      .enabled(enabled)
      .minDuration(300) // 0.3초
      .onStart(() => {
        if (!enabled) {
          return;
        }

        activeId.value = id;
        activeIndex.value = rowIndex;
        hoverIndex.value = rowIndex;
        activeTranslationY.value = 0;
        scale.value = withSpring(1.1);
      });

    const pan = Gesture.Pan()
      .enabled(enabled)
      .onUpdate((event) => {
        if (activeId.value !== id) return;

        // drag되는 아이템 Y 이동
        activeTranslationY.value = event.translationY;

        // 현재 드래그 위치가 가리키는 "슬롯 index"
        const rawIndex = activeIndex.value + activeTranslationY.value / rowHeight;
        const nextHover = clamp(Math.round(rawIndex), 0, dataLength - 1);

        hoverIndex.value = nextHover;
      })
      .onEnd(() => {
        if (activeId.value !== id) {
          return;
        }

        const from = activeIndex.value;
        const to = hoverIndex.value;
        const delta = to - from;

        const finalOffset = delta * rowHeight;

        // 드래그된 아이템을 최종 위치까지 spring 이동
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

    return Gesture.Simultaneous(longPress, pan);
  }, [
    activeId,
    activeIndex,
    activeTranslationY,
    dataLength,
    enabled,
    hoverIndex,
    id,
    onReorder,
    rowHeight,
    rowIndex,
    scale,
  ]);

  const animatedStyle = useAnimatedStyle(() => {
    const dragging = activeId.value === id;
    const hasActive = activeId.value !== null;

    const from = activeIndex.value;
    const to = hoverIndex.value;

    let offset = 0;

    if (dragging) {
      // ✅ 드래그 중인 아이템: 자신 row에서 activeTranslationY 만큼 이동
      offset = activeTranslationY.value;
    } else if (hasActive && from !== -1 && to !== -1) {
      // ✅ 나머지 아이템: 슬롯 사이에 있는 애들만 rowHeight 한 칸씩 위/아래로 이동
      if (rowIndex > from && rowIndex <= to) {
        // 아래로 드래그 → (from, to] 범위 아이템은 한 칸 위로
        offset = -rowHeight;
      } else if (rowIndex < from && rowIndex >= to) {
        // 위로 드래그 → [to, from) 범위 아이템은 한 칸 아래로
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
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        {/* 고정 height + marginBottom = rowHeight */}
        <Animated.View
          style={{
            height: itemHeight,
            marginBottom: itemSpacing,
          }}
        >
          {renderItem({
            item,
            index: rowIndex,
            dragging: activeId.value === id,
          })}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

export default DraggableRow;
