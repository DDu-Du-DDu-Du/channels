import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";

import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { AddListIcon, CalendarIcon, ListIcon, MainFeedIcon, TimelineIcon } from "@/icons";
import type { MenuActivationKey } from "@/stores/use-settings-store/use-settings-store";

import { Href, usePathname, useRouter } from "expo-router";

interface MainTabBarProps {
  sortedActiveMenuKeys: MenuActivationKey[];
}

type TabItem = {
  type: "tab";
  key: MenuActivationKey;
  label: string;
  href: "/feed" | "/dashboard" | "/stats";
};

type ActionItem = {
  type: "action";
  key: "menu-view" | "more";
  label: "메뉴 보기" | "더보기";
};

const MENU_META: Record<MenuActivationKey, Omit<TabItem, "type" | "key">> = {
  calendar: {
    label: "피드",
    href: "/feed",
  },
  dashboard: {
    label: "대시보드",
    href: "/dashboard",
  },
  stats: {
    label: "통계",
    href: "/stats",
  },
};

function MainTabBar({ sortedActiveMenuKeys }: MainTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMoreExpanded, setIsMoreExpanded] = useState(false);
  const activeColor = useThemeColorToken("ui.button.primary.bg");
  const inactiveColor = useThemeColorToken("ui.icon.muted");

  const tabItems: TabItem[] = sortedActiveMenuKeys.map((key) => ({
    type: "tab",
    key,
    label: MENU_META[key].label,
    href: MENU_META[key].href,
  }));

  const isOverFour = tabItems.length >= 5;
  const actionItem: ActionItem = isOverFour
    ? { type: "action", key: "more", label: "더보기" }
    : { type: "action", key: "menu-view", label: "메뉴 보기" };

  const slotItems: (TabItem | ActionItem)[] = isOverFour
    ? [...tabItems.slice(0, 4), actionItem]
    : [...tabItems, actionItem];
  const extendedItems = useMemo<TabItem[]>(() => tabItems.slice(4), [tabItems]);

  const handlePressTab = (href: TabItem["href"]) => {
    router.replace(href as Href);
  };

  const handlePressMenuAction = () => {
    router.push("/settings/menu-activation");
  };

  const handlePressMoreAction = () => {
    setIsMoreExpanded((prev) => !prev);
  };

  const renderTabIcon = (item: TabItem, isFocused: boolean) => {
    const color = isFocused ? activeColor : inactiveColor;
    const opacity = isFocused ? 1 : 0.45;

    if (item.key === "calendar") {
      return (
        <View style={{ opacity }}>
          <CalendarIcon
            size={20}
            stroke={color}
            strokeWidth={2}
          />
        </View>
      );
    }

    if (item.key === "dashboard") {
      return (
        <View style={{ opacity }}>
          <MainFeedIcon
            size={18}
            fill={color}
          />
        </View>
      );
    }

    return (
      <View style={{ opacity }}>
        <TimelineIcon
          size={20}
          stroke={color}
        />
      </View>
    );
  };

  return (
    <View className="border-t border-role-border-subtle bg-role-surface-panel px-[1rem] pb-[0.9rem] pt-[0.6rem] dark:border-role-dark-border-subtle dark:bg-role-dark-surface-panel">
      <View className="flex-row items-center justify-center">
        {slotItems.map((item) => {
          if (item.type === "action") {
            return (
              <Pressable
                key={item.key}
                onPress={item.key === "more" ? handlePressMoreAction : handlePressMenuAction}
                className="items-center justify-center"
                style={{ flex: 1 }}
              >
                {item.key === "more" ? (
                  <AddListIcon
                    size={20}
                    fill={inactiveColor}
                  />
                ) : (
                  <ListIcon
                    size={18}
                    fill={inactiveColor}
                  />
                )}
                <SpoqaText className="mt-[0.3rem] text-size11 text-role-text-tertiary dark:text-role-dark-text-tertiary">
                  {item.label}
                </SpoqaText>
              </Pressable>
            );
          }

          const isFocused = pathname.startsWith(item.href);
          const textColorClassName = isFocused
            ? "text-ui-button-primary-bg dark:text-ui-dark-button-primary-bg"
            : "text-role-text-tertiary dark:text-role-dark-text-tertiary";

          return (
            <Pressable
              key={item.key}
              onPress={() => handlePressTab(item.href)}
              className="items-center justify-center"
              style={{ flex: 1 }}
            >
              {renderTabIcon(item, isFocused)}
              <SpoqaText className={`mt-[0.3rem] text-size11 ${textColorClassName}`}>
                {item.label}
              </SpoqaText>
            </Pressable>
          );
        })}
      </View>

      {isOverFour && isMoreExpanded ? (
        <View className="mt-[0.8rem] flex-row items-center justify-center border-t border-role-border-subtle pt-[0.8rem] dark:border-role-dark-border-subtle">
          {extendedItems.map((item) => {
            const isFocused = pathname.startsWith(item.href);
            const textColorClassName = isFocused
              ? "text-ui-button-primary-bg dark:text-ui-dark-button-primary-bg"
              : "text-role-text-tertiary dark:text-role-dark-text-tertiary";

            return (
              <Pressable
                key={`extended-${item.key}`}
                onPress={() => handlePressTab(item.href)}
                className="items-center justify-center"
                style={{ flex: 1 }}
              >
                {renderTabIcon(item, isFocused)}
                <SpoqaText className={`mt-[0.3rem] text-size11 ${textColorClassName}`}>
                  {item.label}
                </SpoqaText>
              </Pressable>
            );
          })}

          <Pressable
            onPress={handlePressMenuAction}
            className="items-center justify-center"
            style={{ flex: 1 }}
          >
            <ListIcon
              size={18}
              fill={inactiveColor}
            />
            <SpoqaText className="mt-[0.3rem] text-size11 text-role-text-tertiary dark:text-role-dark-text-tertiary">
              메뉴 보기
            </SpoqaText>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

export default MainTabBar;
