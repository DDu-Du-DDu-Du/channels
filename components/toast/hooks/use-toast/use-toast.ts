import { useCallback } from "react";

import { useToastStore } from "@/components/toast/store";

function useToast() {
  const createToast = useToastStore((s) => s.createToast);
  const create = useCallback(
    (message: string, options?: Parameters<typeof createToast>[1]) => {
      createToast(message, options);
    },
    [createToast],
  );

  return { createToast: create };
}

export default useToast;
