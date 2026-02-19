import { useState } from "react";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";

export const MAIN_HEADER_SIDEBAR_DURATION = 220;

function useMainHeaderSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarProgress = useSharedValue(0);

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
    sidebarProgress.value = withTiming(1, {
      duration: MAIN_HEADER_SIDEBAR_DURATION,
      easing: Easing.linear,
    });
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    sidebarProgress.value = withTiming(0, {
      duration: MAIN_HEADER_SIDEBAR_DURATION,
      easing: Easing.linear,
    });
  };

  const handleToggleSidebar = () => {
    if (isSidebarOpen) {
      handleCloseSidebar();
      return;
    }

    handleOpenSidebar();
  };

  return {
    isSidebarOpen,
    sidebarProgress,
    handleOpenSidebar,
    handleCloseSidebar,
    handleToggleSidebar,
  };
}

export default useMainHeaderSidebar;
