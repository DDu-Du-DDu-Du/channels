import React from "react";
import { FlatList, ListRenderItemInfo, StyleProp, ViewStyle } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import DraggableRow from "../draggable-row/draggable-row";

export type IdType = string | number;

export interface DraggableFlatListProps<T extends { id: IdType }> {
  data: T[];
  /** 컨텐츠 높이 (고정) */
  itemHeight: number;
  /** 아래 간격 (marginBottom 같은 역할, 고정) */
  itemSpacing?: number;
  /** 렌더 함수: dragging 여부까지 내려줌 */
  renderItem: (params: { item: T; index: number; dragging: boolean }) => React.ReactNode;
  /** drag 완료 후, 최종 순서의 data를 전달 */
  onDragEnd?: (params: { data: T[] }) => void;
  enabled?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

function DraggableFlatList<T extends { id: string | number }>({
  data,
  itemHeight,
  itemSpacing = 0,
  renderItem,
  onDragEnd,
  enabled = true,
  style,
  contentContainerStyle,
}: DraggableFlatListProps<T>) {
  const rowHeight = itemHeight + itemSpacing;

  // 공통 상태 (UI thread)
  const activeId = useSharedValue<IdType | null>(null); // 드래그 중인 아이템 id
  const activeIndex = useSharedValue<number>(-1); // 시작 index
  const hoverIndex = useSharedValue<number>(-1); // 슬롯이 현재 위치한 index
  const activeTranslationY = useSharedValue<number>(0); // 드래그된 아이템의 추가 이동량

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
      enabled={enabled}
      activeId={activeId}
      activeIndex={activeIndex}
      hoverIndex={hoverIndex}
      activeTranslationY={activeTranslationY}
      onReorder={handleReorder}
    />
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderRow}
      style={style}
      contentContainerStyle={contentContainerStyle}
      scrollEnabled={enabled}
      getItemLayout={(_, index) => ({
        length: rowHeight,
        offset: rowHeight * index,
        index,
      })}
    />
  );
}

export default DraggableFlatList;
