import type { DesignSystemTokenKey, ThemeMode, ThemeName } from "@/constants/theme";

import { create } from "zustand";

export type ThemeTokenOverrideMap = Partial<Record<DesignSystemTokenKey, string>>;

type OverridesByTheme = Record<ThemeName, Record<ThemeMode, ThemeTokenOverrideMap>>;

interface DesignTokenState {
  selectedThemeName: ThemeName;
  selectedMode: ThemeMode;
  overridesByTheme: OverridesByTheme;
  lastUpdatedAt: number | null;
}

interface DesignTokenAction {
  handleSetThemeName: (themeName: ThemeName) => void;
  handleSetMode: (mode: ThemeMode) => void;
  handleSetToken: (key: DesignSystemTokenKey, value: string) => void;
  handleResetToken: (key: DesignSystemTokenKey) => void;
  handleResetAllTokens: () => void;
}

type DesignTokenStore = DesignTokenState & DesignTokenAction;

const createDefaultOverrides = (): OverridesByTheme => ({
  wireframe: {
    light: {},
    dark: {},
  },
});

const useDesignTokenStore = create<DesignTokenStore>((set) => ({
  selectedThemeName: "wireframe",
  selectedMode: "light",
  overridesByTheme: createDefaultOverrides(),
  lastUpdatedAt: null,

  handleSetThemeName: (themeName) =>
    set({
      selectedThemeName: themeName,
    }),

  handleSetMode: (mode) =>
    set({
      selectedMode: mode,
    }),

  handleSetToken: (key, value) =>
    set((state) => {
      const { selectedThemeName, selectedMode, overridesByTheme } = state;
      const currentThemeOverrides = overridesByTheme[selectedThemeName];
      const currentModeOverrides = currentThemeOverrides[selectedMode];

      return {
        overridesByTheme: {
          ...overridesByTheme,
          [selectedThemeName]: {
            ...currentThemeOverrides,
            [selectedMode]: {
              ...currentModeOverrides,
              [key]: value,
            },
          },
        },
        lastUpdatedAt: Date.now(),
      };
    }),

  handleResetToken: (key) =>
    set((state) => {
      const { selectedThemeName, selectedMode, overridesByTheme } = state;
      const currentThemeOverrides = overridesByTheme[selectedThemeName];
      const currentModeOverrides = currentThemeOverrides[selectedMode];
      const { [key]: removed, ...nextModeOverrides } = currentModeOverrides;

      return {
        overridesByTheme: {
          ...overridesByTheme,
          [selectedThemeName]: {
            ...currentThemeOverrides,
            [selectedMode]: nextModeOverrides,
          },
        },
        lastUpdatedAt: removed ? Date.now() : state.lastUpdatedAt,
      };
    }),

  handleResetAllTokens: () =>
    set((state) => {
      const { selectedThemeName, selectedMode, overridesByTheme } = state;
      const currentThemeOverrides = overridesByTheme[selectedThemeName];

      return {
        overridesByTheme: {
          ...overridesByTheme,
          [selectedThemeName]: {
            ...currentThemeOverrides,
            [selectedMode]: {},
          },
        },
        lastUpdatedAt: Date.now(),
      };
    }),
}));

export default useDesignTokenStore;
