import { useCallback } from "react";

import { useRouter } from "expo-router";

function usePageHeaderBackRoute() {
  const router = useRouter();

  const handlePressBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  }, [router]);

  return { handlePressBack };
}

export default usePageHeaderBackRoute;
