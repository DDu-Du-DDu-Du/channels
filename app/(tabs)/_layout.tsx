import { useEffect } from "react";

import { MainHeader, MainTabBar } from "@/components";
import { useMenuActivationTabRouting } from "@/hooks";

import { Tabs, usePathname, useRouter } from "expo-router";

export default function TabsLayout() {
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
        headerShown: true,
        header: () => <MainHeader />,
        tabBarShowLabel: false,
      }}
      tabBar={() => <MainTabBar sortedActiveMenuKeys={sortedActiveMenuKeys} />}
    >
      <Tabs.Screen
        name="landing"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="announcement/index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="announcement/[id]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="todo"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="goal/index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="goal/create"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="goal/editor"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="notification/index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="settings/display"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="settings/menu-activation"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="settings/app-connection"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="stats/select"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="stats/[id]"
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
              name="stats/index"
              options={{ title: "Stats" }}
            />
          </Tabs.Protected>
        );
      })}
    </Tabs>
  );
}
