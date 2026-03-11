import { useMemo } from "react";
import { View } from "react-native";

import { AnimatedSwitch, DraggableFlatList } from "@/components";
import { useMenuActivationToggles } from "@/features/settings/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { DragIcon } from "@/icons";
import { MenuActivationKey } from "@/stores/use-settings-store/use-settings-store";
import { remToPx } from "@/utils";

import { SettingsRow } from "../../../settings-row";

export interface MenuActivationDraggableListProps {
  isValidationEnabled?: boolean;
  onValidationError?: () => void;
}

interface MenuActivationListItem {
  id: MenuActivationKey;
  label: string;
  isToggle: boolean;
  priority: number;
  handleValueChange: (next: boolean) => void;
}

function MenuActivationDraggableList({
  isValidationEnabled = true,
  onValidationError,
}: MenuActivationDraggableListProps) {
  const offBackgroundColor = useThemeColorToken("role.surface.subtle");
  const onBackgroundColor = useThemeColorToken("ui.button.primary.bg");
  const thumbColor = useThemeColorToken("role.surface.canvas");
  const { calendar, dashboard, stats, priorities, handleReorderMenuActivation } =
    useMenuActivationToggles({
      isValidationEnabled,
      onValidationError,
    });

  const data = useMemo<MenuActivationListItem[]>(
    () =>
      [
        {
          id: "calendar" as MenuActivationKey,
          label: "캘린더",
          isToggle: calendar.isToggle,
          priority: priorities.calendar,
          handleValueChange: calendar.handleValueChange,
        },
        {
          id: "dashboard" as MenuActivationKey,
          label: "대시보드",
          isToggle: dashboard.isToggle,
          priority: priorities.dashboard,
          handleValueChange: dashboard.handleValueChange,
        },
        {
          id: "stats" as MenuActivationKey,
          label: "통계",
          isToggle: stats.isToggle,
          priority: priorities.stats,
          handleValueChange: stats.handleValueChange,
        },
      ].sort((a, b) => a.priority - b.priority),
    [calendar, dashboard, priorities.calendar, priorities.dashboard, priorities.stats, stats],
  );

  const rowHeight = remToPx(5.2);

  const handleDragEnd = ({ data: nextData }: { data: MenuActivationListItem[] }) => {
    handleReorderMenuActivation(nextData.map((item) => item.id));
  };

  const renderItem = ({ item }: { item: MenuActivationListItem }) => (
    <View className="px-[2.4rem]">
      <SettingsRow
        label={item.label}
        leftContent={
          <View className="mr-[0.2rem]">
            <DragIcon size={12} />
          </View>
        }
        rightContent={
          <AnimatedSwitch
            size="large"
            value={item.isToggle}
            onValueChange={item.handleValueChange}
            offBackgroundColor={offBackgroundColor}
            onBackgroundColor={onBackgroundColor}
            offThumbColor={thumbColor}
            onThumbColor={thumbColor}
          />
        }
      />
    </View>
  );

  return (
    <DraggableFlatList
      data={data}
      itemHeight={rowHeight}
      itemSpacing={0}
      renderItem={renderItem}
      onDragEnd={handleDragEnd}
      scrollEnabled={false}
    />
  );
}

export default MenuActivationDraggableList;
