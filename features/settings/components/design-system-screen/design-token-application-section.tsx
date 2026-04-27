import { ScrollView, View } from "react-native";

import { SpoqaText } from "@/components";
import type { DesignSystemTokenKey } from "@/constants/theme";
import type { DesignSystemTokenItem } from "@/features/settings/hooks/use-design-system-screen/use-design-system-screen";

import DesignTokenDetailSection from "./design-token-detail-section";

interface DesignTokenApplicationSectionProps {
  selectedToken: DesignSystemTokenItem | null;
  isWideLayout: boolean;
  focusedTokenInputId: string | null;
  handleGetTokenInputValue: (tokenKey: DesignSystemTokenKey, fallbackValue: string) => string;
  handleFocusTokenInput: (inputId: string) => void;
  handleCloseTokenPalette: () => void;
  handleChangeDraftTokenValue: (key: DesignSystemTokenKey, value: string) => void;
  handleCommitTokenValue: (key: DesignSystemTokenKey) => void;
  handleResetTokenValue: (key: DesignSystemTokenKey) => void;
  handleSelectPaletteColor: (key: DesignSystemTokenKey, value: string) => void;
}

function DesignTokenApplicationSection({
  selectedToken,
  isWideLayout,
  focusedTokenInputId,
  handleGetTokenInputValue,
  handleFocusTokenInput,
  handleCloseTokenPalette,
  handleChangeDraftTokenValue,
  handleCommitTokenValue,
  handleResetTokenValue,
  handleSelectPaletteColor,
}: DesignTokenApplicationSectionProps) {
  const content = (
    <View>
      <View className="mb-[1rem]">
        <SpoqaText
          weight="semiBold"
          className="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
        >
          Design Token Application
        </SpoqaText>
        <SpoqaText className="mt-[0.3rem] text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
          선택된 토큰이 실제 컴포넌트에 적용된 모습을 확인합니다.
        </SpoqaText>
      </View>

      <DesignTokenDetailSection
        token={selectedToken}
        focusedTokenInputId={focusedTokenInputId}
        handleGetTokenInputValue={handleGetTokenInputValue}
        handleFocusTokenInput={handleFocusTokenInput}
        handleCloseTokenPalette={handleCloseTokenPalette}
        handleChangeDraftTokenValue={handleChangeDraftTokenValue}
        handleCommitTokenValue={handleCommitTokenValue}
        handleResetTokenValue={handleResetTokenValue}
        handleSelectPaletteColor={handleSelectPaletteColor}
      />
    </View>
  );

  if (isWideLayout) {
    return (
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    );
  }

  return content;
}

export default DesignTokenApplicationSection;
