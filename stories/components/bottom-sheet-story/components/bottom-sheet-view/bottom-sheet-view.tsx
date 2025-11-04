import { Pressable, Text, View } from "react-native";

import { SpoqaText } from "@/components";
import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import { useBottomSheetAction } from "@/hooks";

export interface BottomSheetViewProps {
  defaultHeight?: string | number;
  maxHeight?: string | number;
  onClose?: () => void;
}

function BottomSheetView({
  defaultHeight = "35%",
  maxHeight = "80%",
  onClose,
}: BottomSheetViewProps) {
  const { ref, openSheet, closeSheet, snapToDefault, snapToMax } = useBottomSheetAction();

  return (
    <View className="flex-1 items-center justify-center">
      <Pressable
        onPress={openSheet}
        className="px-4 py-2 bg-example_gray_700 rounded-radius10"
      >
        <Text className="text-white">Open BottomSheet</Text>
      </Pressable>

      <BottomSheet
        ref={ref}
        defaultHeight={defaultHeight}
        maxHeight={maxHeight}
        onClose={onClose}
      >
        <View className="p-[16px] gap-[12px]">
          <SpoqaText
            weight="semiBold"
            className="text-size15 text-center mb-[8px]"
          >
            Bottom Sheet Content
          </SpoqaText>
          <View className="flex-row justify-center gap-[12px]">
            <Pressable
              onPress={snapToDefault}
              className="px-3 py-2 bg-example_gray_100 rounded-radius10"
            >
              <SpoqaText className="text-size13">Default</SpoqaText>
            </Pressable>
            <Pressable
              onPress={snapToMax}
              className="px-3 py-2 bg-example_gray_100 rounded-radius10"
            >
              <SpoqaText className="text-size13">Max</SpoqaText>
            </Pressable>
            <Pressable
              onPress={() => closeSheet()}
              className="px-3 py-2 bg-example_gray_100 rounded-radius10"
            >
              <SpoqaText className="text-size13">Close</SpoqaText>
            </Pressable>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

export default BottomSheetView;
