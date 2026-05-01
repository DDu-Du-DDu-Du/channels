import { Pressable, ScrollView, View } from "react-native";

import { SpoqaText } from "@/components";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { SearchIcon } from "@/icons";

import type { DashboardStatusFilterType } from "../../hooks";

interface DashboardFilterBarProps {
  selectedStatus: DashboardStatusFilterType;
  onSelectStatus: (status: DashboardStatusFilterType) => void;
  onPressMoveTo: () => void;
  onPressSearch: () => void;
}

function DashboardFilterBar({
  selectedStatus,
  onSelectStatus,
  onPressMoveTo,
  onPressSearch,
}: DashboardFilterBarProps) {
  const iconStroke = useThemeColorToken("ui.icon.default");

  const renderStatusButton = (label: string, status: DashboardStatusFilterType) => {
    const isSelected = selectedStatus === status;

    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => onSelectStatus(status)}
        className={`h-[3.8rem] items-center justify-center rounded-circle px-[1.6rem] ${
          isSelected
            ? "bg-[#E9E9E9] dark:bg-role-dark-surface-canvas"
            : "border border-role-border-subtle bg-transparent dark:border-role-dark-border-subtle"
        }`}
      >
        <SpoqaText
          weight="medium"
          className="text-size14 text-role-text-secondary dark:text-role-dark-text-secondary"
          numberOfLines={1}
        >
          {label}
        </SpoqaText>
      </Pressable>
    );
  };

  return (
    <View className="h-[7.2rem] flex-row items-center justify-between border-b border-role-border-subtle px-[1.6rem] dark:border-role-dark-border-subtle">
      <ScrollView
        horizontal
        className="min-w-0 flex-1"
        contentContainerStyle={{ alignItems: "center", columnGap: 8 }}
        showsHorizontalScrollIndicator={false}
      >
        {renderStatusButton("All", "ALL")}
        {renderStatusButton("Complete", "COMPLETE")}
        {renderStatusButton("Incomplete", "UNCOMPLETED")}
        <Pressable
          accessibilityRole="button"
          onPress={onPressMoveTo}
          className="h-[3.8rem] items-center justify-center rounded-circle border border-role-border-subtle bg-transparent px-[1.6rem] dark:border-role-dark-border-subtle"
        >
          <SpoqaText
            weight="medium"
            className="text-size14 text-role-text-secondary dark:text-role-dark-text-secondary"
            numberOfLines={1}
          >
            Move to
          </SpoqaText>
        </Pressable>
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={onPressSearch}
        className="ml-[1.2rem] h-[3.8rem] w-[3.8rem] items-center justify-center"
      >
        <SearchIcon
          size={22}
          stroke={iconStroke}
        />
      </Pressable>
    </View>
  );
}

export default DashboardFilterBar;
