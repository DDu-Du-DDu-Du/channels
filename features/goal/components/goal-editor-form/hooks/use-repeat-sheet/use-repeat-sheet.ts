import { useBottomSheetAction } from "@/hooks";

function useRepeatSheet() {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();

  const handlePressOpenRepeatSheet = () => {
    openSheet();
  };

  return {
    ref,
    closeSheet,
    handlePressOpenRepeatSheet,
  };
}

export default useRepeatSheet;
