import { COLOR_LIST } from "../../components/color-sheet/color-sheet.constant";

export type ThemeName = "wireframe";
export type ThemeMode = "light" | "dark";

export interface ThemeTokenContext {
  themeName: ThemeName;
  mode: ThemeMode;
}

type Primitive = string | number | boolean | null | undefined;

type DotNestedKeys<T> = T extends Primitive
  ? never
  : {
      [K in Extract<keyof T, string>]: T[K] extends Primitive
        ? K
        : `${K}` | `${K}.${DotNestedKeys<T[K]>}`;
    }[Extract<keyof T, string>];

type RolePalette = {
  surface: {
    canvas: string;
    panel: string;
    card: string;
    subtle: string;
    muted: string;
    inverse: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  border: {
    default: string;
    subtle: string;
    strong: string;
  };
  icon: {
    default: string;
    muted: string;
    inverse: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
};

const FOUNDATION = {
  neutral: {
    0: "#FFFFFF",
    50: "#F7F7F7",
    100: "#F1F1F1",
    200: "#E5E5E5",
    300: "#D6D6D6",
    400: "#BDBDBD",
    500: "#9F9F9F",
    600: "#747474",
    700: "#505050",
    800: "#3A3A3A",
    900: "#1F1F1F",
    950: "#121212",
  },
  social: {
    kakao: {
      yellow: "#FEE500",
    },
  },
} as const;

const PALETTE_COLOR_SHEET = COLOR_LIST.reduce<Record<string, string>>((acc, color, index) => {
  const key = `sheet${String(index + 1).padStart(2, "0")}`;
  acc[key] = color;

  return acc;
}, {});

const ROLE_PALETTE_BY_THEME: Record<ThemeName, Record<ThemeMode, RolePalette>> = {
  wireframe: {
    light: {
      surface: {
        canvas: FOUNDATION.neutral[0],
        panel: FOUNDATION.neutral[50],
        card: FOUNDATION.neutral[100],
        subtle: FOUNDATION.neutral[200],
        muted: FOUNDATION.neutral[300],
        inverse: FOUNDATION.neutral[900],
      },
      text: {
        primary: FOUNDATION.neutral[900],
        secondary: FOUNDATION.neutral[700],
        tertiary: FOUNDATION.neutral[600],
        inverse: FOUNDATION.neutral[0],
      },
      border: {
        default: FOUNDATION.neutral[300],
        subtle: FOUNDATION.neutral[200],
        strong: FOUNDATION.neutral[500],
      },
      icon: {
        default: FOUNDATION.neutral[700],
        muted: FOUNDATION.neutral[500],
        inverse: FOUNDATION.neutral[0],
      },
      status: {
        success: "#35CB72",
        warning: "#F59E0B",
        error: "#ED4044",
        info: "#5C9FA3",
      },
    },
    dark: {
      surface: {
        canvas: FOUNDATION.neutral[800],
        panel: FOUNDATION.neutral[700],
        card: FOUNDATION.neutral[600],
        subtle: FOUNDATION.neutral[500],
        muted: FOUNDATION.neutral[400],
        inverse: FOUNDATION.neutral[0],
      },
      text: {
        primary: FOUNDATION.neutral[50],
        secondary: FOUNDATION.neutral[200],
        tertiary: FOUNDATION.neutral[300],
        inverse: FOUNDATION.neutral[900],
      },
      border: {
        default: FOUNDATION.neutral[500],
        subtle: FOUNDATION.neutral[600],
        strong: FOUNDATION.neutral[300],
      },
      icon: {
        default: FOUNDATION.neutral[100],
        muted: FOUNDATION.neutral[300],
        inverse: FOUNDATION.neutral[900],
      },
      status: {
        success: "#4ADE80",
        warning: "#FBBF24",
        error: "#F87171",
        info: "#7DD3FC",
      },
    },
  },
};

const UI_ALIAS_ROLE_PATHS = {
  button: {
    primary: {
      bg: "surface.muted",
      text: "text.primary",
      border: "border.default",
    },
    secondary: {
      bg: "surface.panel",
      text: "text.secondary",
      border: "border.default",
    },
  },
  arrow: {
    bg: "surface.subtle",
    icon: "icon.default",
    border: "border.default",
  },
  header: {
    bg: "surface.card",
    text: "text.primary",
  },
} as const;

const DOMAIN_ALIAS_ROLE_PATHS = {
  feed: {
    headerBg: "surface.card",
  },
  stats: {
    badgeBg: "surface.panel",
  },
} as const;

const getFromRolePath = (role: RolePalette, path: string): string => {
  const value = path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, role);

  if (typeof value !== "string") {
    throw new Error(`[theme] unresolved role path: ${path}`);
  }

  return value;
};

const resolveAliasTree = (
  role: RolePalette,
  aliases: Record<string, unknown>,
): Record<string, unknown> => {
  const next: Record<string, unknown> = {};

  Object.entries(aliases).forEach(([key, value]) => {
    if (typeof value === "string") {
      next[key] = getFromRolePath(role, value);
      return;
    }

    next[key] = resolveAliasTree(role, value as Record<string, unknown>);
  });

  return next;
};

export type ThemeColorMap = {
  neutral: typeof FOUNDATION.neutral;
  role: RolePalette;
  ui: {
    button: {
      primary: {
        bg: string;
        text: string;
        border: string;
      };
      secondary: {
        bg: string;
        text: string;
        border: string;
      };
    };
    arrow: {
      bg: string;
      icon: string;
      border: string;
    };
    header: {
      bg: string;
      text: string;
    };
  };
  domain: {
    feed: {
      headerBg: string;
    };
    stats: {
      badgeBg: string;
    };
  };
  social: typeof FOUNDATION.social;
  palette: {
    colorSheet: Record<string, string>;
  };
};

export type ThemeColorTokenKey = DotNestedKeys<ThemeColorMap>;

const themeColorMapCache = new Map<string, ThemeColorMap>();

export const getThemeColorMap = (context?: Partial<ThemeTokenContext>): ThemeColorMap => {
  const themeName = context?.themeName ?? "wireframe";
  const mode = context?.mode ?? "light";
  const cacheKey = `${themeName}:${mode}`;

  const cached = themeColorMapCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const role = ROLE_PALETTE_BY_THEME[themeName][mode];

  const colorMap: ThemeColorMap = {
    neutral: FOUNDATION.neutral,
    role,
    ui: resolveAliasTree(role, UI_ALIAS_ROLE_PATHS) as ThemeColorMap["ui"],
    domain: resolveAliasTree(role, DOMAIN_ALIAS_ROLE_PATHS) as ThemeColorMap["domain"],
    social: FOUNDATION.social,
    palette: {
      colorSheet: PALETTE_COLOR_SHEET,
    },
  };

  themeColorMapCache.set(cacheKey, colorMap);

  return colorMap;
};

const resolveTokenValueByPath = (colorMap: ThemeColorMap, key: ThemeColorTokenKey): string => {
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

export const getThemeColorToken = (
  key: ThemeColorTokenKey,
  context?: Partial<ThemeTokenContext>,
): string => {
  const colorMap = getThemeColorMap(context);

  return resolveTokenValueByPath(colorMap, key);
};

export const createTailwindColorTokens = (context?: Partial<ThemeTokenContext>): ThemeColorMap => {
  return getThemeColorMap(context);
};
