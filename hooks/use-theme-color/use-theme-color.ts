import { type ReactNode, createContext, createElement, useContext, useMemo } from "react";

import { handleIsDesignTokenLabEnabled } from "@/constants/app-variant";
import {
  type ThemeColorMap,
  type ThemeColorTokenKey,
  type ThemeMode,
  type ThemeName,
  type ThemeTokenContext,
  getThemeColorMap,
  getThemeColorMapWithOverrides,
  getThemeColorToken as resolveThemeColorToken,
} from "@/constants/theme";
import { useDesignTokenStore, useSettingsStore } from "@/stores";

type ThemeContextInput = Partial<ThemeTokenContext>;

const DesignTokenPreviewContext = createContext<ThemeColorMap | null>(null);

export const DesignTokenPreviewProvider = ({
  children,
  colorMap,
}: {
  children: ReactNode;
  colorMap: ThemeColorMap;
}) => {
  return createElement(DesignTokenPreviewContext.Provider, { value: colorMap }, children);
};

const resolveContext = (
  context: ThemeContextInput | undefined,
  isDarkMode: boolean,
): Pick<ThemeTokenContext, "themeName" | "mode"> => {
  return {
    themeName: context?.themeName ?? "wireframe",
    mode: context?.mode ?? (isDarkMode ? "dark" : "light"),
  };
};

const resolveThemeColorMap = (
  context: Pick<ThemeTokenContext, "themeName" | "mode">,
  overridesByTheme: ReturnType<typeof useDesignTokenStore.getState>["overridesByTheme"],
): ThemeColorMap => {
  if (!handleIsDesignTokenLabEnabled()) {
    return getThemeColorMap(context);
  }

  const overrides = overridesByTheme[context.themeName]?.[context.mode];

  if (!overrides || Object.keys(overrides).length === 0) {
    return getThemeColorMap(context);
  }

  return getThemeColorMapWithOverrides(context, overrides);
};

export const useThemeColorMap = (context?: ThemeContextInput): ThemeColorMap => {
  const previewColorMap = useContext(DesignTokenPreviewContext);
  const isDarkMode = useSettingsStore((state) => state.display.isDarkMode);
  const overridesByTheme = useDesignTokenStore((state) => state.overridesByTheme);
  const contextThemeName = context?.themeName;
  const contextMode = context?.mode;

  return useMemo(() => {
    if (previewColorMap) {
      return previewColorMap;
    }

    const resolved = resolveContext({ themeName: contextThemeName, mode: contextMode }, isDarkMode);

    return resolveThemeColorMap(resolved, overridesByTheme);
  }, [contextMode, contextThemeName, isDarkMode, overridesByTheme, previewColorMap]);
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
  const colorMap = useThemeColorMap(context);

  return useMemo(() => {
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
  }, [colorMap, key]);
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
