import type { ToastType } from "@/components/toast/toast-provider.type";

export interface UseToastTypeColorProps {
  type: ToastType;
}

function useToastTypeColor({ type }: UseToastTypeColorProps) {
  switch (type) {
    case "alert":
      return "#FB923C"; // example_orange_500 approx
    case "safe":
      return "#86EFAC"; // example_green_100 approx
    case "warning":
      return "#F59E0B"; // example_yellow_500 approx
    case "danger":
      return "#EF4444"; // example_red_500 approx
    default:
      return "#FB923C";
  }
}

export default useToastTypeColor;
