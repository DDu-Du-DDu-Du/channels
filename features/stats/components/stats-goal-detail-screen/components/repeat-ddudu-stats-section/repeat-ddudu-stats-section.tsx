import { useMemo, useState } from "react";
import { View } from "react-native";

import { SpoqaText } from "@/components";
import { useToast } from "@/components/toast/hooks";
import {
  RepeatDduduItemType,
  RepeatDduduSheet,
  useRepeatDduduMutation,
  useRepeatSheet,
} from "@/features/repeat-ddudu";
import { RepeatDduduRequestType } from "@/types/request/repeat-ddudu/repeat-ddudu";
import { StatsDetailRepeatDduduItemType } from "@/types/response/stats/stats";

import RepeatDduduBarRow from "../repeat-ddudu-bar-row/repeat-ddudu-bar-row";

interface RepeatDduduStatsSectionProps {
  goalId: number;
  repeatDduduStats?: StatsDetailRepeatDduduItemType[];
  repeatDduduItems?: RepeatDduduItemType[];
  goalColor: string;
}

function RepeatDduduStatsSection({
  goalId,
  repeatDduduStats = [],
  repeatDduduItems = [],
  goalColor,
}: RepeatDduduStatsSectionProps) {
  const { createToast } = useToast();
  const { ref, closeSheet, handlePressOpenRepeatSheet } = useRepeatSheet();
  const { handleEditRepeatDdudu } = useRepeatDduduMutation({ goalId });

  const [selectedRepeatDdudu, setSelectedRepeatDdudu] = useState<RepeatDduduItemType>();

  const sorted = useMemo(
    () => [...repeatDduduStats].sort((a, b) => b.completedCount - a.completedCount),
    [repeatDduduStats],
  );

  const maxCount = Math.max(...sorted.map((item) => item.completedCount), 0);

  const handlePressRow = (item: StatsDetailRepeatDduduItemType) => {
    const matched = repeatDduduItems.find((repeatDdudu) => repeatDdudu?.id === item.repeatDduduId);

    if (!matched) {
      createToast("반복뚜두 상세를 불러오지 못했어요", { type: "danger" });
      return;
    }

    setSelectedRepeatDdudu(matched);
    handlePressOpenRepeatSheet();
  };

  const handleCloseRepeatSheet = () => {
    closeSheet();
    setSelectedRepeatDdudu(undefined);
  };

  const handleSubmitRepeatDdudu = (repeatDdudu: RepeatDduduRequestType) => {
    if (!selectedRepeatDdudu?.id) {
      createToast("반복뚜두를 수정할 수 없어요", { type: "danger" });
      return;
    }

    handleEditRepeatDdudu(selectedRepeatDdudu.id, { ...repeatDdudu });
  };

  return (
    <>
      <View className="mt-[1.2rem] rounded-radius15 bg-role-surface-panel dark:bg-role-dark-surface-panel px-[1.4rem] py-[1.4rem]">
        <View className="items-center">
          <View className="rounded-circle bg-role-surface-panel dark:bg-role-dark-surface-panel px-[1.2rem] py-[0.5rem]">
            <SpoqaText
              weight="semiBold"
              className="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
            >
              반복투두
            </SpoqaText>
          </View>
        </View>

        <View className="mt-[1.2rem] border-t border-role-border-default dark:border-role-dark-border-default pt-[1rem]">
          {sorted.length === 0 ? (
            <SpoqaText className="text-center text-size13 text-role-text-tertiary dark:text-role-dark-text-tertiary">
              데이터가 없어요
            </SpoqaText>
          ) : (
            <View className="gap-[0.9rem]">
              {sorted.map((item, index) => {
                const ratio = maxCount > 0 ? item.completedCount / maxCount : 0;
                const widthPercent = Math.max(20, Math.min(100, ratio * 100));
                const opacityStep = sorted.length > 1 ? index / (sorted.length - 1) : 0;
                const opacity = Math.max(0.5, 1 - opacityStep * 0.5);

                return (
                  <RepeatDduduBarRow
                    key={`repeat-${item.repeatDduduId}`}
                    item={item}
                    widthPercent={widthPercent}
                    opacity={opacity}
                    goalColor={goalColor}
                    onPress={handlePressRow}
                  />
                );
              })}
            </View>
          )}
        </View>
      </View>

      <RepeatDduduSheet
        bottomSheetRef={ref}
        onClose={handleCloseRepeatSheet}
        onDismiss={() => setSelectedRepeatDdudu(undefined)}
        repeatDdudu={selectedRepeatDdudu}
        sheetTitle="반복 수정"
        submitLabel="반복 수정"
        onSubmit={handleSubmitRepeatDdudu}
      />
    </>
  );
}

export type { RepeatDduduStatsSectionProps };
export default RepeatDduduStatsSection;
