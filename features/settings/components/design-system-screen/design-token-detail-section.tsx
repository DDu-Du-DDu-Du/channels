import { View } from "react-native";

import { SpoqaText } from "@/components";
import type { DesignSystemTokenKey } from "@/constants/theme";
import type { DesignSystemTokenItem } from "@/features/settings/hooks/use-design-system-screen/use-design-system-screen";

import DesignTokenColorInput from "./design-token-color-input";
import DesignTokenComponentPreviewList from "./design-token-component-preview-list";

interface DesignTokenDetailSectionProps {
  token: DesignSystemTokenItem | null;
  focusedTokenInputId: string | null;
  handleGetTokenInputValue: (tokenKey: DesignSystemTokenKey, fallbackValue: string) => string;
  handleFocusTokenInput: (inputId: string) => void;
  handleCloseTokenPalette: () => void;
  handleChangeDraftTokenValue: (tokenKey: DesignSystemTokenKey, value: string) => void;
  handleCommitTokenValue: (tokenKey: DesignSystemTokenKey) => void;
  handleResetTokenValue: (tokenKey: DesignSystemTokenKey) => void;
  handleSelectPaletteColor: (tokenKey: DesignSystemTokenKey, value: string) => void;
}

function DesignTokenDetailSection({
  token,
  focusedTokenInputId,
  handleGetTokenInputValue,
  handleFocusTokenInput,
  handleCloseTokenPalette,
  handleChangeDraftTokenValue,
  handleCommitTokenValue,
  handleResetTokenValue,
  handleSelectPaletteColor,
}: DesignTokenDetailSectionProps) {
  if (!token) {
    return (
      <View className="rounded-radius10 border border-role-border-subtle bg-role-surface-card p-[1.2rem] dark:border-role-dark-border-subtle dark:bg-role-dark-surface-card">
        <SpoqaText className="text-size13 text-role-text-secondary dark:text-role-dark-text-secondary">
          토큰을 선택하세요.
        </SpoqaText>
      </View>
    );
  }

  const inputValue = handleGetTokenInputValue(token.key, token.value);
  const detailInputId = `detail:${token.key}`;

  return (
    <View className="gap-[1.2rem]">
      <View className="rounded-radius10 border border-role-border-subtle bg-role-surface-card p-[1.2rem] dark:border-role-dark-border-subtle dark:bg-role-dark-surface-card">
        <View className="flex-row items-center gap-[0.8rem]">
          <View
            className="size-[2rem] rounded-circle border border-role-border-subtle dark:border-role-dark-border-subtle"
            style={{ backgroundColor: token.value }}
          />
          <View className="flex-1">
            <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
              {token.key}
            </SpoqaText>
            <SpoqaText className="mt-[0.3rem] text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
              {token.value}
            </SpoqaText>
          </View>
          {token.isOverridden ? (
            <View className="rounded-circle bg-role-status-warning px-[0.8rem] py-[0.2rem] dark:bg-role-dark-status-warning">
              <SpoqaText className="text-size10 text-role-text-inverse dark:text-role-dark-text-inverse">
                override
              </SpoqaText>
            </View>
          ) : null}
        </View>

        <SpoqaText className="mt-[0.8rem] text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
          용도: {token.purpose}
        </SpoqaText>
        <SpoqaText className="mt-[0.2rem] text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
          설명: {token.description}
        </SpoqaText>

        <View className="mt-[1rem]">
          <DesignTokenColorInput
            inputId={detailInputId}
            tokenKey={token.key}
            value={inputValue}
            isPaletteOpen={focusedTokenInputId === detailInputId}
            handleFocus={handleFocusTokenInput}
            handleClosePalette={handleCloseTokenPalette}
            handleChangeText={handleChangeDraftTokenValue}
            handleCommit={handleCommitTokenValue}
            handleReset={handleResetTokenValue}
            handleSelectPaletteColor={handleSelectPaletteColor}
          />
        </View>
      </View>

      <View>
        <SpoqaText className="mb-[0.8rem] text-size13 text-role-text-primary dark:text-role-dark-text-primary">
          적용 컴포넌트
        </SpoqaText>
        <DesignTokenComponentPreviewList tokenKey={token.key} />
      </View>
    </View>
  );
}

export default DesignTokenDetailSection;
