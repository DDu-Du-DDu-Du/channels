import { Pressable, ScrollView, View } from "react-native";

import { SpoqaText, TextInput } from "@/components";
import { useDesignSystemScreen } from "@/features/settings/hooks";
import type { DesignSystemMobileSection } from "@/features/settings/hooks/use-design-system-screen/use-design-system-screen";
import { DesignTokenPreviewProvider } from "@/hooks/use-theme-color";

import DesignTokenApplicationSection from "./design-token-application-section";
import DesignTokenColorInput from "./design-token-color-input";

const MOBILE_SECTION_OPTIONS: { label: string; value: DesignSystemMobileSection }[] = [
  { label: "Token List", value: "list" },
  { label: "Application", value: "application" },
];

function DesignSystemScreen() {
  const {
    appVariant,
    colorMap,
    isWideLayout,
    modeOptions,
    selectedMode,
    selectedThemeName,
    themeOptions,
    searchKeyword,
    filteredTokens,
    selectedTokenKey,
    selectedToken,
    selectedMobileSection,
    focusedTokenInputId,
    isExporting,
    handleAddTheme,
    handleSetThemeName,
    handleSetMode,
    handleSelectToken,
    handleSetMobileSection,
    handleFocusTokenInput,
    handleCloseTokenPalette,
    handleChangeSearchKeyword,
    handleChangeDraftTokenValue,
    handleCommitTokenValue,
    handleResetTokenValue,
    handleResetAllTokenValues,
    handleSelectPaletteColor,
    handleExportSnapshot,
    handleGetTokenInputValue,
  } = useDesignSystemScreen();

  const tokenListContent = (
    <>
      <View className="mb-[1rem]">
        <SpoqaText className="text-size13 text-role-text-secondary dark:text-role-dark-text-secondary">
          총 {filteredTokens.length}개 토큰
        </SpoqaText>
      </View>

      {filteredTokens.map((token) => {
        const inputValue = handleGetTokenInputValue(token.key, token.value);
        const isSelected = selectedTokenKey === token.key;
        const tokenListInputId = `list:${token.key}`;

        return (
          <View
            key={token.key}
            className={`mb-[1rem] rounded-radius10 border p-[1.2rem] ${
              isSelected
                ? "border-role-border-strong bg-role-surface-subtle dark:border-role-dark-border-strong dark:bg-role-dark-surface-subtle"
                : "border-role-border-subtle bg-role-surface-card dark:border-role-dark-border-subtle dark:bg-role-dark-surface-card"
            }`}
          >
            <Pressable onPress={() => handleSelectToken(token.key)}>
              <View className="flex-row items-center gap-[0.8rem]">
                <View
                  className="size-[1.6rem] rounded-circle border border-role-border-subtle dark:border-role-dark-border-subtle"
                  style={{ backgroundColor: token.value }}
                />
                <SpoqaText className="flex-1 text-size13">{token.key}</SpoqaText>
                {token.isOverridden ? (
                  <View className="rounded-circle bg-role-status-warning px-[0.8rem] py-[0.2rem] dark:bg-role-dark-status-warning">
                    <SpoqaText className="text-size10 text-role-text-inverse dark:text-role-dark-text-inverse">
                      override
                    </SpoqaText>
                  </View>
                ) : null}
              </View>

              <SpoqaText className="mt-[0.6rem] text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
                용도: {token.purpose}
              </SpoqaText>
              <SpoqaText className="mt-[0.2rem] text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
                설명: {token.description}
              </SpoqaText>
            </Pressable>

            <View className="mt-[0.8rem]">
              <DesignTokenColorInput
                inputId={tokenListInputId}
                tokenKey={token.key}
                value={inputValue}
                isPaletteOpen={focusedTokenInputId === tokenListInputId}
                handleFocus={handleFocusTokenInput}
                handleClosePalette={handleCloseTokenPalette}
                handleChangeText={handleChangeDraftTokenValue}
                handleCommit={handleCommitTokenValue}
                handleReset={handleResetTokenValue}
                handleSelectPaletteColor={handleSelectPaletteColor}
              />
            </View>
          </View>
        );
      })}
    </>
  );
  const applicationSection = (
    <DesignTokenApplicationSection
      selectedToken={selectedToken}
      isWideLayout={isWideLayout}
      focusedTokenInputId={focusedTokenInputId}
      handleGetTokenInputValue={handleGetTokenInputValue}
      handleFocusTokenInput={handleFocusTokenInput}
      handleCloseTokenPalette={handleCloseTokenPalette}
      handleChangeDraftTokenValue={handleChangeDraftTokenValue}
      handleCommitTokenValue={handleCommitTokenValue}
      handleResetTokenValue={handleResetTokenValue}
      handleSelectPaletteColor={handleSelectPaletteColor}
    />
  );

  return (
    <DesignTokenPreviewProvider colorMap={colorMap}>
      <View className="flex-1 px-[2.4rem] pb-[2.8rem]">
        <View className="mb-[1.2rem] rounded-radius10 border border-role-border-subtle bg-role-surface-card p-[1.2rem] dark:border-role-dark-border-subtle dark:bg-role-dark-surface-card">
          <SpoqaText className="text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
            app_variant: {appVariant}
          </SpoqaText>
          <SpoqaText className="mt-[0.4rem] text-size13 text-role-text-secondary dark:text-role-dark-text-secondary">
            role/ui 토큰은 이 화면의 sandbox 안에서만 동적 오버라이드됩니다.
          </SpoqaText>
        </View>

        {!isWideLayout ? (
          <View className="mb-[1.2rem] flex-row rounded-radius10 border border-role-border-subtle bg-role-surface-card p-[0.3rem] dark:border-role-dark-border-subtle dark:bg-role-dark-surface-card">
            {MOBILE_SECTION_OPTIONS.map((option) => {
              const isActive = selectedMobileSection === option.value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleSetMobileSection(option.value)}
                  className={`flex-1 items-center rounded-radius10 py-[0.8rem] ${
                    isActive ? "bg-role-surface-subtle dark:bg-role-dark-surface-subtle" : ""
                  }`}
                >
                  <SpoqaText
                    className={`text-size12 ${
                      isActive
                        ? "text-role-text-primary dark:text-role-dark-text-primary"
                        : "text-role-text-secondary dark:text-role-dark-text-secondary"
                    }`}
                  >
                    {option.label}
                  </SpoqaText>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <View className="mb-[1.2rem] gap-[0.8rem]">
          <View className="flex-row flex-wrap gap-[0.8rem]">
            {themeOptions.map((themeName) => {
              const isActive = selectedThemeName === themeName;

              return (
                <Pressable
                  key={themeName}
                  onPress={() => handleSetThemeName(themeName)}
                  className={`rounded-circle border px-[1.2rem] py-[0.6rem] ${
                    isActive
                      ? "border-role-border-strong bg-role-surface-subtle dark:border-role-dark-border-strong dark:bg-role-dark-surface-subtle"
                      : "border-role-border-subtle bg-role-surface-card dark:border-role-dark-border-subtle dark:bg-role-dark-surface-card"
                  }`}
                >
                  <SpoqaText className="text-size12">{themeName}</SpoqaText>
                </Pressable>
              );
            })}
            <Pressable
              onPress={handleAddTheme}
              className="size-[3.2rem] items-center justify-center rounded-circle border border-role-border-subtle bg-role-surface-card dark:border-role-dark-border-subtle dark:bg-role-dark-surface-card"
              accessibilityRole="button"
              accessibilityLabel="디자인 시스템 sandbox theme 추가"
            >
              <SpoqaText className="text-size16 text-role-text-primary dark:text-role-dark-text-primary">
                +
              </SpoqaText>
            </Pressable>
          </View>

          <View className="flex-row gap-[0.8rem]">
            {modeOptions.map((mode) => {
              const isActive = selectedMode === mode;

              return (
                <Pressable
                  key={mode}
                  onPress={() => handleSetMode(mode)}
                  className={`rounded-circle border px-[1.2rem] py-[0.6rem] ${
                    isActive
                      ? "border-role-border-strong bg-role-surface-subtle dark:border-role-dark-border-strong dark:bg-role-dark-surface-subtle"
                      : "border-role-border-subtle bg-role-surface-card dark:border-role-dark-border-subtle dark:bg-role-dark-surface-card"
                  }`}
                >
                  <SpoqaText className="text-size12">{mode}</SpoqaText>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            value={searchKeyword}
            placeholder="토큰 검색 (예: role.text.primary)"
            onChangeText={handleChangeSearchKeyword}
            className="h-[4.6rem] rounded-radius10 text-size13"
          />

          <View className="flex-row gap-[0.8rem]">
            <Pressable
              onPress={handleResetAllTokenValues}
              className="flex-1 items-center rounded-radius10 border border-role-border-subtle bg-role-surface-card py-[1rem] dark:border-role-dark-border-subtle dark:bg-role-dark-surface-card"
            >
              <SpoqaText className="text-size13">현재 모드 초기화</SpoqaText>
            </Pressable>
            <Pressable
              onPress={handleExportSnapshot}
              className="flex-1 items-center rounded-radius10 border border-role-border-subtle bg-role-surface-card py-[1rem] dark:border-role-dark-border-subtle dark:bg-role-dark-surface-card"
            >
              <SpoqaText className="text-size13">
                {isExporting ? "저장 중..." : "캡쳐(JSON 저장)"}
              </SpoqaText>
            </Pressable>
          </View>
        </View>

        {isWideLayout ? (
          <View className="min-h-0 flex-1 flex-row gap-[1.2rem]">
            <View
              className="min-h-0"
              style={{ flexBasis: "40%", flexGrow: 0, flexShrink: 1 }}
            >
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
              >
                {tokenListContent}
              </ScrollView>
            </View>
            <View
              className="min-h-0"
              style={{ flexBasis: "60%", flexGrow: 0, flexShrink: 1 }}
            >
              {applicationSection}
            </View>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
          >
            {selectedMobileSection === "list" ? tokenListContent : applicationSection}
          </ScrollView>
        )}
      </View>
    </DesignTokenPreviewProvider>
  );
}

export default DesignSystemScreen;
