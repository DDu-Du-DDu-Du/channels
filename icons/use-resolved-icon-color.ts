import { useThemeColorToken } from "@/hooks/use-theme-color";

type IconTone =
  | "default"
  | "muted"
  | "inverse"
  | "status-success"
  | "status-warning"
  | "status-error";

const DEFAULT_TONE_COLORS = new Set([
  "#1f1f1f",
  "#212121",
  "#292d32",
  "#0f0f0f",
  "#020202",
  "#000000",
  "black",
]);
const MUTED_TONE_COLORS = new Set(["#d9d9d9", "#b5b5b5", "#9c9c9c", "#8e8e8e"]);
const INVERSE_TONE_COLORS = new Set(["#ffffff", "white", "#f9fafb"]);
const SUCCESS_TONE_COLORS = new Set(["#a8d86f", "#35cb72", "#4ade80"]);
const WARNING_TONE_COLORS = new Set(["#fdb541", "#f59e0b", "#fbbf24"]);
const ERROR_TONE_COLORS = new Set(["#ed4044", "#f87171", "#ef4444"]);

const getToneColor = (tone: IconTone, colors: Record<IconTone, string>): string => {
  return colors[tone];
};

export const useResolvedIconColor = (
  color: string | undefined,
  tone: IconTone = "default",
): string => {
  const colors: Record<IconTone, string> = {
    default: useThemeColorToken("role.icon.default"),
    muted: useThemeColorToken("role.icon.muted"),
    inverse: useThemeColorToken("role.icon.inverse"),
    "status-success": useThemeColorToken("role.status.success"),
    "status-warning": useThemeColorToken("role.status.warning"),
    "status-error": useThemeColorToken("role.status.error"),
  };

  if (!color) {
    return getToneColor(tone, colors);
  }

  const normalized = color.toLowerCase();

  if (DEFAULT_TONE_COLORS.has(normalized)) {
    return colors.default;
  }

  if (MUTED_TONE_COLORS.has(normalized)) {
    return colors.muted;
  }

  if (INVERSE_TONE_COLORS.has(normalized)) {
    return colors.inverse;
  }

  if (SUCCESS_TONE_COLORS.has(normalized)) {
    return colors["status-success"];
  }

  if (WARNING_TONE_COLORS.has(normalized)) {
    return colors["status-warning"];
  }

  if (ERROR_TONE_COLORS.has(normalized)) {
    return colors["status-error"];
  }

  return color;
};
