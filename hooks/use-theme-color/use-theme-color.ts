import { useMemo } from "react";

import {
  type ThemeColorMap,
  type ThemeColorTokenKey,
  type ThemeMode,
  type ThemeName,
  type ThemeTokenContext,
  getThemeColorMap,
  getThemeColorToken as resolveThemeColorToken,
} from "@/constants/theme";
import { useSettingsStore } from "@/stores";

type ThemeContextInput = Partial<ThemeTokenContext>;

const resolveContext = (
  context: ThemeContextInput | undefined,
  isDarkMode: boolean,
): Pick<ThemeTokenContext, "themeName" | "mode"> => {
  return {
    themeName: context?.themeName ?? "wireframe",
    mode: context?.mode ?? (isDarkMode ? "dark" : "light"),
  };
};

export const useThemeColorMap = (context?: ThemeContextInput): ThemeColorMap => {
  const isDarkMode = useSettingsStore((state) => state.display.isDarkMode);
  const contextThemeName = context?.themeName;
  const contextMode = context?.mode;

  return useMemo(() => {
    const resolved = resolveContext({ themeName: contextThemeName, mode: contextMode }, isDarkMode);

    return getThemeColorMap(resolved);
  }, [contextMode, contextThemeName, isDarkMode]);
};

/** @deprecated Use getThemeColorToken instead. */
export const getThemeColor = (
  key: ThemeColorTokenKey,
  context?: { themeName?: ThemeName; mode?: ThemeMode },
): string => {
  return resolveThemeColorToken(key, context);
};

export const getThemeColorToken = getThemeColor;

export const useThemeColorToken = (
  key: ThemeColorTokenKey,
  context?: ThemeContextInput,
): string => {
  const isDarkMode = useSettingsStore((state) => state.display.isDarkMode);
  const contextThemeName = context?.themeName;
  const contextMode = context?.mode;

  return useMemo(() => {
    const resolved = resolveContext({ themeName: contextThemeName, mode: contextMode }, isDarkMode);

    return resolveThemeColorToken(key, resolved);
  }, [contextMode, contextThemeName, isDarkMode, key]);
};

export const useThemeColorTokenGetter = (context?: ThemeContextInput) => {
  const colorMap = useThemeColorMap(context);

  return (key: ThemeColorTokenKey) => {
    const value = key.split(".").reduce<unknown>((current, segment) => {
      if (!current || typeof current !== "object") {
        return undefined;
      }

      return (current as Record<string, unknown>)[segment];
    }, colorMap);

    if (typeof value !== "string") {
      throw new Error(`[theme] invalid token key: ${key}`);
    }

    return value;
  };
};

/** @deprecated Use useThemeColorToken instead. */
export const useThemeColor = (key: ThemeColorTokenKey, context?: ThemeContextInput): string => {
  return useThemeColorToken(key, context);
};
