import { Pressable, View } from "react-native";

import { SpoqaText, TextInput } from "@/components";
import { COLOR_LIST } from "@/components/color-sheet/color-sheet.constant";
import type { DesignSystemTokenKey } from "@/constants/theme";
import { useThemeColorToken } from "@/hooks/use-theme-color";

interface DesignTokenColorInputProps {
  inputId: string;
  tokenKey: DesignSystemTokenKey;
  value: string;
  isPaletteOpen: boolean;
  handleFocus: (inputId: string) => void;
  handleClosePalette: () => void;
  handleChangeText: (key: DesignSystemTokenKey, value: string) => void;
  handleCommit: (key: DesignSystemTokenKey) => void;
  handleReset: (key: DesignSystemTokenKey) => void;
  handleSelectPaletteColor: (key: DesignSystemTokenKey, value: string) => void;
}

function DesignTokenColorInput({
  inputId,
  tokenKey,
  value,
  isPaletteOpen,
  handleFocus,
  handleClosePalette,
  handleChangeText,
  handleCommit,
  handleReset,
  handleSelectPaletteColor,
}: DesignTokenColorInputProps) {
  const panelBackgroundColor = useThemeColorToken("role.surface.panel");
  const subtleBackgroundColor = useThemeColorToken("role.surface.subtle");
  const subtleBorderColor = useThemeColorToken("role.border.subtle");
  const defaultBorderColor = useThemeColorToken("role.border.default");
  const strongBorderColor = useThemeColorToken("role.border.strong");
  const secondaryTextColor = useThemeColorToken("role.text.secondary");
  const normalizedValue = value.trim().toUpperCase();

  return (
    <View>
      <View className="flex-row items-center gap-[0.8rem]">
        <View className="flex-1">
          <TextInput
            value={value}
            onFocus={() => handleFocus(inputId)}
            onChangeText={(nextValue) => handleChangeText(tokenKey, nextValue)}
            onSubmitEditing={() => handleCommit(tokenKey)}
            autoCapitalize="characters"
            autoCorrect={false}
            className="h-[4.2rem] rounded-radius10 text-size12"
          />
        </View>
        <Pressable
          onPress={() => handleCommit(tokenKey)}
          className="rounded-radius10 border border-role-border-subtle bg-role-surface-subtle px-[1rem] py-[0.8rem] dark:border-role-dark-border-subtle dark:bg-role-dark-surface-subtle"
        >
          <SpoqaText className="text-size12">적용</SpoqaText>
        </Pressable>
        <Pressable
          onPress={() => handleReset(tokenKey)}
          className="rounded-radius10 border border-role-border-subtle bg-role-surface-subtle px-[1rem] py-[0.8rem] dark:border-role-dark-border-subtle dark:bg-role-dark-surface-subtle"
        >
          <SpoqaText className="text-size12">리셋</SpoqaText>
        </Pressable>
      </View>

      {isPaletteOpen ? (
        <View
          className="mt-[0.8rem] rounded-radius10 border p-[1rem]"
          style={{
            backgroundColor: panelBackgroundColor,
            borderColor: subtleBorderColor,
          }}
        >
          <View className="mb-[0.8rem] flex-row items-center justify-between">
            <SpoqaText
              className="text-size12"
              style={{ color: secondaryTextColor }}
            >
              팔레트
            </SpoqaText>
            <Pressable
              onPress={handleClosePalette}
              className="rounded-circle px-[0.8rem] py-[0.3rem]"
              style={{ backgroundColor: subtleBackgroundColor }}
            >
              <SpoqaText
                className="text-size10"
                style={{ color: secondaryTextColor }}
              >
                닫기
              </SpoqaText>
            </Pressable>
          </View>
          <View className="flex-row flex-wrap gap-[0.6rem]">
            {COLOR_LIST.map((color) => {
              const isSelected = normalizedValue === color;

              return (
                <Pressable
                  key={color}
                  onPress={() => handleSelectPaletteColor(tokenKey, color)}
                  className="size-[2.8rem] rounded-circle border"
                  style={{
                    backgroundColor: color,
                    borderColor: isSelected ? strongBorderColor : defaultBorderColor,
                    borderWidth: isSelected ? 2 : 1,
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`색상 ${color} 선택`}
                />
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}

export default DesignTokenColorInput;
