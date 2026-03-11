import { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, ListRenderItemInfo, View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";

export interface WheelPickerProps {
  data: (string | number)[];
  value: number;
  onChange: (index: number) => void;
  itemHeight?: number;
  visibleCount?: number;
  initValue?: string | number;
  width?: number;
}

function WheelPicker({
  data,
  value,
  onChange,
  itemHeight = 44,
  visibleCount = 3,
  initValue = 0,
  width = 50,
}: WheelPickerProps) {
  const half = Math.floor(visibleCount / 2);
  const scrollY = useRef(new Animated.Value(0)).current;
  const listRef = useRef<any>(null);
  const initValueIndex = data.indexOf(initValue ?? 0);
  const isSnappingRef = useRef(false);

  const computeIndexFromOffset = useCallback(
    (offsetY: number) => {
      const i = Math.round(offsetY / itemHeight);
      return Math.max(0, Math.min(data.length - 1, i));
    },
    [data.length, itemHeight],
  );

  useEffect(() => {
    const targetOffset = value * itemHeight;
    listRef.current?.scrollToOffset?.({ offset: targetOffset, animated: false });
  }, [value, itemHeight]);

  const handleEnd = useCallback(
    (e: any) => {
      if (isSnappingRef.current) {
        isSnappingRef.current = false;
        return;
      }

      const offsetY = e?.nativeEvent?.contentOffset?.y ?? 0;
      const i = computeIndexFromOffset(offsetY);
      const targetOffset = i * itemHeight;
      const diff = Math.abs(offsetY - targetOffset);

      if (i !== value) {
        onChange(i);
      }

      if (diff > 0.5) {
        isSnappingRef.current = true;
        listRef.current?.scrollToOffset?.({ offset: targetOffset, animated: true });
      }
    },
    [computeIndexFromOffset, onChange, value, itemHeight],
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<string | number>) => {
      const inputRange = [(index - 2) * itemHeight, (index - 1) * itemHeight, index * itemHeight];
      const scale = scrollY.interpolate({
        inputRange,
        outputRange: [1, 1, 1],
      });

      return (
        <Animated.View
          style={{
            height: itemHeight,
            transform: [{ scale }],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SpoqaText
            weight={index === value ? "semiBold" : "regular"}
            className={
              index === value
                ? "text-size15"
                : "text-size13 text-role-text-tertiary dark:text-role-dark-text-tertiary"
            }
          >
            {String(item)}
          </SpoqaText>
        </Animated.View>
      );
    },
    [itemHeight, scrollY, value],
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  );

  const initialIndex = useMemo(() => {
    const base = value ?? (initValueIndex >= 0 ? initValueIndex : 0);
    return Math.max(0, Math.min(data.length - 1, base));
  }, [value, initValueIndex, data.length]);

  return (
    <View style={{ height: itemHeight * visibleCount }}>
      <Animated.FlatList
        ref={listRef}
        data={data}
        keyExtractor={(_: any, i: number) => `wheel-${i}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="normal"
        bounces={false}
        onMomentumScrollEnd={handleEnd}
        // Only snap on momentum end to allow free flings
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        initialScrollIndex={initialIndex}
        nestedScrollEnabled
        style={{
          width: width,
          alignSelf: "center",
        }}
        contentContainerStyle={{
          paddingVertical: itemHeight * half,
          alignItems: "center",
        }}
      />
    </View>
  );
}

export default WheelPicker;
