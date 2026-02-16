import { FlatList, View } from "react-native";

import type { RepeatDduduItemType } from "@/features/repeat-ddudu/repeat-ddudu.types";

import SwipeableRepeatDduduCard from "../swipeable-repeat-ddudu-card/swipeable-repeat-ddudu-card";

export interface RepeatDduduCardsProps {
  repeatDdudus: RepeatDduduItemType[];
  onPressRepeatDdudu?: (index: number) => void;
  onPressDeleteRepeatDdudu?: (item: RepeatDduduItemType, index: number) => void;
}

function RepeatDduduCards({
  repeatDdudus,
  onPressRepeatDdudu,
  onPressDeleteRepeatDdudu,
}: RepeatDduduCardsProps) {
  if (!repeatDdudus.length) {
    return null;
  }

  return (
    <View className="flex-1">
      <FlatList
        data={repeatDdudus}
        keyExtractor={(item, index) =>
          item.id?.toString() ?? item.tempId ?? `${item.name}-${index}`
        }
        contentContainerStyle={{ rowGap: 8 }}
        renderItem={({ item, index }) => (
          <SwipeableRepeatDduduCard
            repeatDdudu={item}
            onPress={() => onPressRepeatDdudu?.(index)}
            onPressDelete={() => onPressDeleteRepeatDdudu?.(item, index)}
          />
        )}
      />
    </View>
  );
}

export default RepeatDduduCards;
