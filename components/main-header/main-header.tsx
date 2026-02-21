import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";

import { OutsidePressBackdrop, SpoqaText } from "@/components";
import { NotificationIcon, SettingsIcon } from "@/icons";
import { remToPx } from "@/utils";

import { HamburgerToggle } from "./components";
import { MAIN_HEADER_SIDEBAR_DURATION, useMainHeaderSidebar } from "./hooks";

import { Href, usePathname, useRouter } from "expo-router";

const FALLBACK_HEADER_HEIGHT = remToPx("6.3rem");
const SIDEBAR_MENU_ITEMS: { key: string; label: string; route: "/feed" | "/stats" }[] = [
  { key: "feed", label: "투두", route: "/feed" },
  { key: "stats", label: "통계", route: "/stats" },
];

function MainHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const { isSidebarOpen, sidebarProgress, handleCloseSidebar, handleToggleSidebar } =
    useMainHeaderSidebar();

  const resolvedHeaderHeight = headerHeight === 0 ? FALLBACK_HEADER_HEIGHT : headerHeight;
  const sidebarWidth = useMemo(() => Math.min(300, width * 0.85), [width]);
  const sidebarHeight = useMemo(
    () => Math.max(0, height - resolvedHeaderHeight),
    [height, resolvedHeaderHeight],
  );

  const headerTitle = useMemo(() => {
    if (pathname.includes("/stats")) {
      return "통계";
    }

    return "투두";
  }, [pathname]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sidebarProgress.value, [0, 1], [0, 0.35]),
  }));

  const sidebarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(sidebarProgress.value, [0, 1], [-sidebarWidth, 0]) }],
  }));

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleNavigateAfterSidebarClose = (route: "/feed" | "/stats") => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    handleCloseSidebar();

    closeTimerRef.current = setTimeout(() => {
      router.replace(route);
    }, MAIN_HEADER_SIDEBAR_DURATION);
  };

  const handleHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;
    setHeaderHeight((prevHeight) => (prevHeight !== nextHeight ? nextHeight : prevHeight));
  }, []);

  const handlePressNotification = () => {
    router.push("/notification" as Href);
  };

  return (
    <View style={styles.root}>
      <OutsidePressBackdrop
        open={isSidebarOpen}
        onOutsidePress={handleCloseSidebar}
      >
        <View
          className="pt-[2rem] pb-[1.5rem] px-[2.4rem] bg-main flex flex-row justify-between items-center"
          style={styles.headerLayer}
          onLayout={handleHeaderLayout}
        >
          <View className="flex flex-row items-center gap-[1.2rem]">
            <HamburgerToggle
              isOpen={isSidebarOpen}
              onPress={handleToggleSidebar}
            />
            <SpoqaText
              weight="bold"
              className="text-white text-size20"
            >
              {headerTitle}
            </SpoqaText>
          </View>
          <View className="flex flex-row justify-end gap-[0.8rem]">
            <Pressable
              onPress={handlePressNotification}
              hitSlop={8}
              className="size-[2.4rem] items-center justify-center"
            >
              <NotificationIcon stroke="#FFFFFF" />
            </Pressable>
            <Pressable
              hitSlop={8}
              className="size-[2.4rem] items-center justify-center"
            >
              <SettingsIcon stroke="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </OutsidePressBackdrop>

      <OutsidePressBackdrop
        open={isSidebarOpen}
        onOutsidePress={handleCloseSidebar}
      >
        <View
          pointerEvents={isSidebarOpen ? "auto" : "none"}
          style={[styles.overlayContainer, { width, height }]}
        >
          <Animated.View style={[styles.backdropLayer, backdropAnimatedStyle]}>
            <Pressable
              onPress={handleCloseSidebar}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.sidebarLayer,
              { width: sidebarWidth, height: sidebarHeight, top: resolvedHeaderHeight },
              sidebarAnimatedStyle,
            ]}
          >
            <FlatList
              data={SIDEBAR_MENU_ITEMS}
              keyExtractor={(item) => item.key}
              contentContainerStyle={styles.sidebarListContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  className="py-[1rem]"
                  onPress={() => handleNavigateAfterSidebarClose(item.route)}
                >
                  <SpoqaText
                    weight="semiBold"
                    className="text-size18 text-main_black"
                  >
                    {item.label}
                  </SpoqaText>
                </Pressable>
              )}
            />
          </Animated.View>
        </View>
      </OutsidePressBackdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "relative",
  },
  headerLayer: {
    zIndex: 30,
    elevation: 30,
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 20,
    elevation: 20,
  },
  backdropLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
    zIndex: 10,
    elevation: 10,
  },
  sidebarLayer: {
    position: "absolute",
    left: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 20,
    elevation: 20,
  },
  sidebarListContent: {
    paddingHorizontal: remToPx("2rem"),
    paddingTop: remToPx("2rem"),
    paddingBottom: remToPx("3rem"),
  },
});

export default MainHeader;
