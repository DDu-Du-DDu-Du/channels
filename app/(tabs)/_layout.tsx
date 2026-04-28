import { useEffect } from "react";

import { MainTabBar } from "@/components";
import { handleIsDesignTokenLabEnabled } from "@/constants";
import { useMenuActivationTabRouting } from "@/hooks";

import Constants from "expo-constants";
import { Tabs, usePathname, useRouter } from "expo-router";

export default function TabsLayout() {
  const isDesignTokenLabEnabled = handleIsDesignTokenLabEnabled();
  console.log("app variant?", Constants.expoConfig?.extra?.appVariant, isDesignTokenLabEnabled);
  const router = useRouter();
  const pathname = usePathname();
  const { menuActivation, sortedActiveMenuKeys, handleGetRedirectHref } =
    useMenuActivationTabRouting();

  useEffect(() => {
    const redirectHref = handleGetRedirectHref(pathname);
    if (!redirectHref) {
      return;
    }

    if (pathname.startsWith(redirectHref)) {
      return;
    }

    router.replace(redirectHref);
  }, [handleGetRedirectHref, pathname, router]);

  return (
    <Tabs
      initialRouteName="landing"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={() => <MainTabBar sortedActiveMenuKeys={sortedActiveMenuKeys} />}
    >
      <Tabs.Screen
        name="landing"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="announcement"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="todo"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="goal"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="notification"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="settings"
        options={{ href: null }}
      />

      {sortedActiveMenuKeys.map((key) => {
        if (key === "calendar") {
          return (
            <Tabs.Protected
              key={key}
              guard={menuActivation.calendar.isActivated}
            >
              <Tabs.Screen
                name="feed/index"
                initialParams={{ view: "list" }}
                options={{ title: "Feed" }}
              />
            </Tabs.Protected>
          );
        }

        if (key === "dashboard") {
          return (
            <Tabs.Protected
              key={key}
              guard={menuActivation.dashboard.isActivated}
            >
              <Tabs.Screen
                name="dashboard/index"
                options={{ title: "Dashboard" }}
              />
            </Tabs.Protected>
          );
        }

        return (
          <Tabs.Protected
            key={key}
            guard={menuActivation.stats.isActivated}
          >
            <Tabs.Screen
              name="stats"
              options={{ title: "Stats" }}
            />
          </Tabs.Protected>
        );
      })}
    </Tabs>
  );
}
