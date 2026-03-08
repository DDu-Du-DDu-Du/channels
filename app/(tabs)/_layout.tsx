import { useEffect } from "react";

import { MainHeader } from "@/components";
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
      initialRouteName="index"
      screenOptions={{
        headerShown: true,
        header: () => <MainHeader />,
      }}
    >
      <Tabs.Screen
        name="index"
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
