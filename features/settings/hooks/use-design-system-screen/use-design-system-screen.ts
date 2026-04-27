import { useEffect, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";

import { useToast } from "@/components/toast/hooks";
import { handleGetAppVariant, handleIsDesignTokenLabEnabled } from "@/constants/app-variant";
import {
  type DesignSystemTokenKey,
  type ThemeColorMap,
  type ThemeMode,
  getThemeColorMapWithOverrides,
  getThemeDesignTokenEntries,
} from "@/constants/theme";
import { handleSaveDesignSystemSnapshot } from "@/utils";

const HEX_COLOR_REGEX = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const BASE_THEME_NAME = "wireframe";
const MODE_OPTIONS: ThemeMode[] = ["light", "dark"];

type DesignSystemThemeName = string;
type DesignSystemTokenOverrideMap = Partial<Record<DesignSystemTokenKey, string>>;
type DesignSystemOverridesByTheme = Record<
  DesignSystemThemeName,
  Record<ThemeMode, DesignSystemTokenOverrideMap>
>;

const PURPOSE_BY_PREFIX: { prefix: string; purpose: string }[] = [
  { prefix: "role.surface.", purpose: "레이아웃 배경/표면 계층" },
  { prefix: "role.text.", purpose: "기본 텍스트 계층" },
  { prefix: "role.border.", purpose: "보더/구분선 계층" },
  { prefix: "role.icon.", purpose: "아이콘 기본/보조 계층" },
  { prefix: "role.status.", purpose: "상태 표현(success/warning/error/info)" },
  { prefix: "ui.button.", purpose: "버튼 컴포넌트 별칭 토큰" },
  { prefix: "ui.arrow.", purpose: "화살표 컨트롤 별칭 토큰" },
  { prefix: "ui.header.", purpose: "헤더 영역 별칭 토큰" },
  { prefix: "ui.icon.", purpose: "UI 아이콘 별칭 토큰" },
  { prefix: "ui.checkbox.", purpose: "체크박스 별칭 토큰" },
  { prefix: "ui.input.", purpose: "입력 필드 별칭 토큰" },
  { prefix: "ui.card.", purpose: "카드 컴포넌트 별칭 토큰" },
];

const DESCRIPTION_BY_SUFFIX: { suffix: string; description: string }[] = [
  { suffix: ".canvas", description: "페이지 최외곽 배경" },
  { suffix: ".panel", description: "섹션/패널 배경" },
  { suffix: ".card", description: "카드형 컨테이너 배경" },
  { suffix: ".subtle", description: "약한 강조 배경/선" },
  { suffix: ".muted", description: "비활성/보조 톤 배경" },
  { suffix: ".choiceSelected", description: "선택 상태 배경" },
  { suffix: ".choiceUnselected", description: "미선택 상태 배경" },
  { suffix: ".inverse", description: "역상 대비 색상" },
  { suffix: ".primary", description: "가장 높은 우선순위 텍스트" },
  { suffix: ".secondary", description: "중간 우선순위 텍스트" },
  { suffix: ".tertiary", description: "보조 우선순위 텍스트" },
  { suffix: ".invalid", description: "유효성 오류 표현" },
  { suffix: ".default", description: "기본 상태 표현" },
  { suffix: ".strong", description: "강조 상태 보더/경계" },
  { suffix: ".checkboxCheck", description: "체크박스 체크 아이콘" },
  { suffix: ".checkboxUncheck", description: "체크박스 언체크 아이콘" },
  { suffix: ".success", description: "성공 상태 표시" },
  { suffix: ".warning", description: "경고 상태 표시" },
  { suffix: ".error", description: "오류 상태 표시" },
  { suffix: ".info", description: "정보 상태 표시" },
  { suffix: ".bg", description: "배경 색상 슬롯" },
  { suffix: ".text", description: "텍스트 색상 슬롯" },
  { suffix: ".border", description: "보더 색상 슬롯" },
  { suffix: ".icon", description: "아이콘 색상 슬롯" },
  { suffix: ".check", description: "체크 상태 슬롯" },
  { suffix: ".uncheck", description: "언체크 상태 슬롯" },
  { suffix: ".placeholder", description: "입력 placeholder 색상" },
];

const createEmptyModeOverrides = (): Record<ThemeMode, DesignSystemTokenOverrideMap> => ({
  light: {},
  dark: {},
});

const createDefaultOverrides = (): DesignSystemOverridesByTheme => ({
  [BASE_THEME_NAME]: createEmptyModeOverrides(),
});

const handleResolvePurpose = (key: DesignSystemTokenKey): string => {
  const matched = PURPOSE_BY_PREFIX.find((item) => key.startsWith(item.prefix));
  return matched?.purpose ?? "공통 UI 색상 토큰";
};

const handleResolveDescription = (key: DesignSystemTokenKey): string => {
  const matched = DESCRIPTION_BY_SUFFIX.find((item) => key.endsWith(item.suffix));
  return matched?.description ?? "컴포넌트 스타일 슬롯 색상";
};

const handleNormalizeHex = (value: string): string | null => {
  const trimmed = value.trim();
  const matched = trimmed.match(HEX_COLOR_REGEX);

  if (!matched) {
    return null;
  }

  const rawHex = matched[1].toUpperCase();
  const normalizedHex =
    rawHex.length === 3
      ? rawHex
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : rawHex;

  return `#${normalizedHex}`;
};

const hasOwnTokenDraft = (
  values: Partial<Record<DesignSystemTokenKey, string>>,
  key: DesignSystemTokenKey,
) => Object.prototype.hasOwnProperty.call(values, key);

export interface DesignSystemTokenItem {
  key: DesignSystemTokenKey;
  value: string;
  purpose: string;
  description: string;
  isOverridden: boolean;
}

export type DesignSystemMobileSection = "list" | "application";

function useDesignSystemScreen() {
  const { width } = useWindowDimensions();
  const appVariant = handleGetAppVariant();
  const isDesignTokenLabEnabled = handleIsDesignTokenLabEnabled();
  const { createToast } = useToast();
  const [themeOptions, setThemeOptions] = useState<DesignSystemThemeName[]>([BASE_THEME_NAME]);
  const [selectedThemeName, setSelectedThemeName] =
    useState<DesignSystemThemeName>(BASE_THEME_NAME);
  const [selectedMode, setSelectedMode] = useState<ThemeMode>("light");
  const [overridesByTheme, setOverridesByTheme] =
    useState<DesignSystemOverridesByTheme>(createDefaultOverrides);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [draftTokenValues, setDraftTokenValues] = useState<
    Partial<Record<DesignSystemTokenKey, string>>
  >({});
  const [focusedTokenInputId, setFocusedTokenInputId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTokenKey, setSelectedTokenKey] = useState<DesignSystemTokenKey | null>(null);
  const [selectedMobileSection, setSelectedMobileSection] =
    useState<DesignSystemMobileSection>("list");
  const isWideLayout = width >= 768;
  const modeOverrides = useMemo(() => {
    return overridesByTheme[selectedThemeName]?.[selectedMode] ?? {};
  }, [overridesByTheme, selectedMode, selectedThemeName]);
  const colorMap = useMemo<ThemeColorMap>(() => {
    return getThemeColorMapWithOverrides(
      {
        themeName: BASE_THEME_NAME,
        mode: selectedMode,
      },
      modeOverrides,
    );
  }, [modeOverrides, selectedMode]);

  const tokens = useMemo<DesignSystemTokenItem[]>(() => {
    const entries = getThemeDesignTokenEntries(
      {
        themeName: BASE_THEME_NAME,
        mode: selectedMode,
      },
      modeOverrides,
    );

    return entries.map((entry) => ({
      key: entry.key,
      value: entry.value,
      purpose: handleResolvePurpose(entry.key),
      description: handleResolveDescription(entry.key),
      isOverridden: Boolean(modeOverrides[entry.key]),
    }));
  }, [modeOverrides, selectedMode]);

  const filteredTokens = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) {
      return tokens;
    }

    return tokens.filter((token) => {
      return (
        token.key.toLowerCase().includes(keyword) ||
        token.purpose.toLowerCase().includes(keyword) ||
        token.description.toLowerCase().includes(keyword)
      );
    });
  }, [searchKeyword, tokens]);

  const selectedToken = useMemo(() => {
    if (!selectedTokenKey) {
      return null;
    }

    return tokens.find((token) => token.key === selectedTokenKey) ?? null;
  }, [selectedTokenKey, tokens]);

  useEffect(() => {
    const hasSelectedFilteredToken = filteredTokens.some((token) => token.key === selectedTokenKey);
    const nextTokenKey = filteredTokens[0]?.key ?? null;

    if (!selectedTokenKey || !hasSelectedFilteredToken) {
      setSelectedTokenKey(nextTokenKey);
    }
  }, [filteredTokens, selectedTokenKey]);

  const handleEnsureThemeOverrides = (
    themeName: DesignSystemThemeName,
    currentOverrides: DesignSystemOverridesByTheme,
  ) => {
    return currentOverrides[themeName] ?? createEmptyModeOverrides();
  };

  const handleSetSandboxToken = (key: DesignSystemTokenKey, value: string) => {
    setOverridesByTheme((previous) => {
      const themeOverrides = handleEnsureThemeOverrides(selectedThemeName, previous);
      const modeTokenOverrides = themeOverrides[selectedMode] ?? {};

      return {
        ...previous,
        [selectedThemeName]: {
          ...themeOverrides,
          [selectedMode]: {
            ...modeTokenOverrides,
            [key]: value,
          },
        },
      };
    });
  };

  const handleSetThemeName = (themeName: DesignSystemThemeName) => {
    setSelectedThemeName(themeName);
    setDraftTokenValues({});
    setFocusedTokenInputId(null);
  };

  const handleSetMode = (mode: ThemeMode) => {
    setSelectedMode(mode);
    setDraftTokenValues({});
    setFocusedTokenInputId(null);
  };

  const handleAddTheme = () => {
    setThemeOptions((previous) => {
      let nextIndex = 1;
      let nextThemeName = `custom-${nextIndex}`;

      while (previous.includes(nextThemeName)) {
        nextIndex += 1;
        nextThemeName = `custom-${nextIndex}`;
      }

      setOverridesByTheme((currentOverrides) => ({
        ...currentOverrides,
        [nextThemeName]: createEmptyModeOverrides(),
      }));
      setSelectedThemeName(nextThemeName);
      setDraftTokenValues({});
      setFocusedTokenInputId(null);

      return [...previous, nextThemeName];
    });
  };

  const handleChangeSearchKeyword = (value: string) => {
    setSearchKeyword(value);
  };

  const handleSelectToken = (key: DesignSystemTokenKey) => {
    setSelectedTokenKey(key);
  };

  const handleSetMobileSection = (section: DesignSystemMobileSection) => {
    setSelectedMobileSection(section);
  };

  const handleFocusTokenInput = (inputId: string) => {
    setFocusedTokenInputId(inputId);
  };

  const handleCloseTokenPalette = () => {
    setFocusedTokenInputId(null);
  };

  const handleChangeDraftTokenValue = (key: DesignSystemTokenKey, value: string) => {
    setDraftTokenValues((previous) => ({
      ...previous,
      [key]: value,
    }));

    const normalized = handleNormalizeHex(value);

    if (normalized) {
      handleSetSandboxToken(key, normalized);
    }
  };

  const handleCommitTokenValue = (key: DesignSystemTokenKey) => {
    if (!hasOwnTokenDraft(draftTokenValues, key)) {
      setFocusedTokenInputId(null);
      return;
    }

    const draftValue = draftTokenValues[key] ?? "";
    const trimmedValue = draftValue.trim();

    if (!trimmedValue) {
      setOverridesByTheme((previous) => {
        const themeOverrides = handleEnsureThemeOverrides(selectedThemeName, previous);
        const modeTokenOverrides = themeOverrides[selectedMode] ?? {};
        const { [key]: removed, ...nextModeTokenOverrides } = modeTokenOverrides;

        return {
          ...previous,
          [selectedThemeName]: {
            ...themeOverrides,
            [selectedMode]: nextModeTokenOverrides,
          },
        };
      });
      setDraftTokenValues((previous) => {
        const { [key]: removed, ...next } = previous;
        return next;
      });
      setFocusedTokenInputId(null);
      return;
    }

    const normalized = handleNormalizeHex(trimmedValue);

    if (!normalized) {
      createToast("HEX 색상(3자리 또는 6자리) 형식으로 입력하세요.", { type: "warning" });
      return;
    }

    handleSetSandboxToken(key, normalized);
    setDraftTokenValues((previous) => ({
      ...previous,
      [key]: normalized,
    }));
    setFocusedTokenInputId(null);
  };

  const handleResetTokenValue = (key: DesignSystemTokenKey) => {
    setOverridesByTheme((previous) => {
      const themeOverrides = handleEnsureThemeOverrides(selectedThemeName, previous);
      const modeTokenOverrides = themeOverrides[selectedMode] ?? {};
      const { [key]: removed, ...nextModeTokenOverrides } = modeTokenOverrides;

      return {
        ...previous,
        [selectedThemeName]: {
          ...themeOverrides,
          [selectedMode]: nextModeTokenOverrides,
        },
      };
    });
    setDraftTokenValues((previous) => {
      const { [key]: removed, ...next } = previous;
      return next;
    });
    setFocusedTokenInputId(null);
  };

  const handleSelectPaletteColor = (key: DesignSystemTokenKey, value: string) => {
    const normalized = handleNormalizeHex(value);

    if (!normalized) {
      return;
    }

    handleSetSandboxToken(key, normalized);
    setDraftTokenValues((previous) => ({
      ...previous,
      [key]: normalized,
    }));
    setFocusedTokenInputId(null);
  };

  const handleResetAllTokenValues = () => {
    setOverridesByTheme((previous) => {
      const themeOverrides = handleEnsureThemeOverrides(selectedThemeName, previous);

      return {
        ...previous,
        [selectedThemeName]: {
          ...themeOverrides,
          [selectedMode]: {},
        },
      };
    });
    setDraftTokenValues({});
    setFocusedTokenInputId(null);
    createToast("현재 sandbox 모드의 토큰 오버라이드를 초기화했습니다.", { type: "safe" });
  };

  const handleExportSnapshot = async () => {
    if (isExporting) {
      return;
    }

    try {
      setIsExporting(true);
      const result = await handleSaveDesignSystemSnapshot({
        appVariant,
        themeName: selectedThemeName,
        mode: selectedMode,
        capturedAt: new Date().toISOString(),
        sandboxOnly: true,
        overrides: modeOverrides,
        resolvedTokens: {
          role: colorMap.role,
          ui: colorMap.ui,
        },
      });

      createToast(`토큰 스냅샷 저장 완료: ${result.fileName}`, {
        type: "safe",
      });
    } catch (error) {
      createToast(`토큰 스냅샷 저장 실패: ${(error as Error).message}`, {
        type: "danger",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    appVariant,
    colorMap,
    isDesignTokenLabEnabled,
    themeOptions,
    modeOptions: MODE_OPTIONS,
    selectedThemeName,
    selectedMode,
    isWideLayout,
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
    handleGetTokenInputValue: (tokenKey: DesignSystemTokenKey, fallbackValue: string) => {
      if (hasOwnTokenDraft(draftTokenValues, tokenKey)) {
        return draftTokenValues[tokenKey] ?? "";
      }

      return fallbackValue;
    },
  };
}

export default useDesignSystemScreen;
