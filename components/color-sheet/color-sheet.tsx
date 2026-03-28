import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";

import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import { useBottomSheetAction } from "@/hooks";

import { COLOR_LIST } from "./color-sheet.constant";
import { ColorPickController } from "./components";

interface ColorPickForm {
  color: string;
}

export interface ColorSheetProps {
  isShow: boolean;
  pickedColor: string;
  disabled?: boolean;
  onClick: (color: string) => void;
  onClose: () => void;
}

function ColorSheet({ isShow, pickedColor, disabled, onClick, onClose }: ColorSheetProps) {
  const { ref, openSheet, closeSheet } = useBottomSheetAction();
  const methods = useForm<ColorPickForm>({ defaultValues: { color: pickedColor } });

  useEffect(() => {
    if (isShow) {
      openSheet();
    }
  }, [isShow, openSheet]);

  useEffect(() => {
    methods.reset({ color: pickedColor });
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [pickedColor]);

  return (
    <BottomSheet
      ref={ref}
      onClose={onClose}
      fitContent
    >
      <FormProvider {...methods}>
        <View className="items-center bg-role-surface-panel p-[2rem] dark:bg-role-dark-surface-panel">
          <ColorPickController
            list={COLOR_LIST}
            disabled={disabled}
            onPick={(c) => {
              onClick(c);
              closeSheet();
            }}
          />
        </View>
      </FormProvider>
    </BottomSheet>
  );
}

export default ColorSheet;
