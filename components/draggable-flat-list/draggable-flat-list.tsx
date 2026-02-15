import React, { useMemo, useRef } from "react";
import { FlatList, ListRenderItemInfo, StyleProp, View, ViewStyle } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import DraggableRow from "../draggable-row/draggable-row";

export type IdType = string | number;

export interface DraggableFlatListProps<T extends { id: IdType }> {
  data: T[];
  itemHeight: number;
  itemSpacing?: number;
  renderItem: (params: { item: T; index: number; dragging: boolean }) => React.ReactNode;
  onDragEnd?: (params: { data: T[] }) => void;
  scrollEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  autoScrollThreshold?: number;
  autoScrollStep?: number;
}

function DraggableFlatList<T extends { id: string | number; disabled?: boolean }>({
  data,
  itemHeight,
  itemSpacing = 0,
  renderItem,
  onDragEnd,
  scrollEnabled = true,
  style,
  contentContainerStyle,
  autoScrollThreshold = 48,
  autoScrollStep = 20,
}: DraggableFlatListProps<T>) {
  const rowHeight = itemHeight + itemSpacing;
  const listRef = useRef<FlatList<T>>(null);
  const scrollOffsetRef = useRef(0);
  const scrollContentHeightRef = useRef(0);
  const scrollContainerHeightRef = useRef(0);
  const scrollContainerTopRef = useRef(0);
  const listContainerRef = useRef<View>(null);
  const activeId = useSharedValue<IdType | null>(null);
  const activeIndex = useSharedValue<number>(-1);
  const hoverIndex = useSharedValue<number>(-1);
  const activeTranslationY = useSharedValue<number>(0);

  const handleReorder = React.useCallback(
    (from: number, to: number) => {
      if (!onDragEnd) return;
      if (from === -1 || to === -1 || from === to) {
        onDragEnd({ data });
        return;
      }

      const next = [...data];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);

      onDragEnd({ data: next });
    },
    [data, onDragEnd],
  );

  const handleAutoScroll = useMemo(
    () => (direction: "up" | "down") => {
      const containerHeight = scrollContainerHeightRef.current;
      const contentHeight = scrollContentHeightRef.current;

      if (!containerHeight || !contentHeight) {
        return;
      }

      const maxOffset = Math.max(0, contentHeight - containerHeight);
      const currentOffset = scrollOffsetRef.current ?? 0;
      const nextOffset =
        direction === "up"
          ? Math.max(0, currentOffset - autoScrollStep)
          : Math.min(maxOffset, currentOffset + autoScrollStep);

      if (nextOffset === currentOffset) {
        return;
      }

      scrollOffsetRef.current = nextOffset;
      listRef.current?.scrollToOffset({ offset: nextOffset, animated: false });
    },
    [autoScrollStep],
  );

  const renderRow = ({ item, index }: ListRenderItemInfo<T>) => (
    <DraggableRow<T>
      key={String(item.id)}
      id={String(item.id)}
      item={item}
      index={index}
      itemHeight={itemHeight}
      itemSpacing={itemSpacing}
      rowHeight={rowHeight}
      dataLength={data.length}
      renderItem={renderItem}
      enabled={!item.disabled}
      activeId={activeId}
      activeIndex={activeIndex}
      hoverIndex={hoverIndex}
      activeTranslationY={activeTranslationY}
      onReorder={handleReorder}
      onAutoScroll={handleAutoScroll}
      scrollContainerHeight={scrollContainerHeightRef.current}
      scrollContainerTop={scrollContainerTopRef.current}
      autoScrollThreshold={autoScrollThreshold}
    />
  );

  return (
    <View
      ref={listContainerRef}
      style={style}
    >
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderRow}
        style={{ flex: 1 }}
        contentContainerStyle={contentContainerStyle}
        scrollEnabled={scrollEnabled}
        scrollEventThrottle={16}
        onScroll={(event) => {
          scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
        }}
        onContentSizeChange={(_, height) => {
          scrollContentHeightRef.current = height;
        }}
        onLayout={(event) => {
          scrollContainerHeightRef.current = event.nativeEvent.layout.height;
          listContainerRef.current?.measureInWindow((_, y) => {
            scrollContainerTopRef.current = y;
          });
        }}
        getItemLayout={(_, index) => ({
          length: rowHeight,
          offset: rowHeight * index,
          index,
        })}
      />
    </View>
  );
}

export default DraggableFlatList;
