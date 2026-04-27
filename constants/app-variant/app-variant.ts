import Constants from "expo-constants";

export type AppVariant = "development" | "preview" | "production";

const resolveAppVariant = (): AppVariant => {
  const candidate = Constants.expoConfig?.extra?.appVariant;

  if (candidate === "development" || candidate === "preview" || candidate === "production") {
    return candidate;
  }

  return "production";
};

export const handleGetAppVariant = (): AppVariant => resolveAppVariant();
export const handleIsDevelopmentVariant = (): boolean => handleGetAppVariant() === "development";
export const handleIsPreviewVariant = (): boolean => handleGetAppVariant() === "preview";
export const handleIsDesignTokenLabEnabled = (): boolean => {
  return handleIsDevelopmentVariant() || handleIsPreviewVariant();
};

export const APP_VARIANT = handleGetAppVariant();
export const isDevelopmentVariant = handleIsDevelopmentVariant();
export const isPreviewVariant = handleIsPreviewVariant();
export const isDesignTokenLabEnabled = handleIsDesignTokenLabEnabled();
