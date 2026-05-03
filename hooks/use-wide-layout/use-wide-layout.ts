import { useWindowDimensions } from "react-native";

export const WIDE_LAYOUT_BREAKPOINT = 768;

function useWideLayout() {
  const { width, height } = useWindowDimensions();
  const isWideLayout = width > WIDE_LAYOUT_BREAKPOINT;

  return {
    width,
    height,
    isWideLayout,
  };
}

export default useWideLayout;
