import { useCallback } from "react";

import { Href, useLocalSearchParams, useRouter } from "expo-router";

const getStringParam = (param?: string | string[]) => {
  if (Array.isArray(param)) {
    return param[0];
  }

  return param;
};

function usePageHeaderBackRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ backHref?: string | string[] }>();
  const backHref = getStringParam(params.backHref);

  const handlePressBack = useCallback(() => {
    if (backHref) {
      router.replace(backHref as Href);
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  }, [backHref, router]);

  return { handlePressBack };
}

export default usePageHeaderBackRoute;
