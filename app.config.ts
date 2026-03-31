import type { ConfigContext, ExpoConfig } from "expo/config";

// Provide typed Expo config with environment awareness
const getEnv = () => ({
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "",
  storybookEnabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true",
  kakaoNativeKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_KEY ?? "",
  kakaoJSKey: process.env.EXPO_PUBLIC_KAKAO_JS_KEY ?? "",
  kakaoRestKey: process.env.EXPO_PUBLIC_KAKAO_REST_KEY ?? "",
  fcmApiKey: process.env.EXPO_PUBLIC_FCM_API_KEY ?? "",
  fcmAuthDomain: process.env.EXPO_PUBLIC_FCM_AUTH_DOMAIN ?? "",
  fcmProjectId: process.env.EXPO_PUBLIC_FCM_PROJECT_ID ?? "",
  fcmStorageBucket: process.env.EXPO_PUBLIC_FCM_STORAGE_BUCKET ?? "",
  fcmMessagingSenderId: process.env.EXPO_PUBLIC_FCM_MESSAGING_SENDER_ID ?? "",
  fcmAppId: process.env.EXPO_PUBLIC_FCM_APP_ID ?? "",
  fcmMeasurementId: process.env.EXPO_PUBLIC_FCM_MEASUREMENT_ID ?? "",
  fcmVapId: process.env.EXPO_PUBLIC_FCM_VAP_ID ?? "",
});

const defineConfig = ({ config }: ConfigContext): ExpoConfig => {
  const env = getEnv();

  return {
    ...config,
    name: "channels",
    slug: "channels",
    scheme: "channels",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    newArchEnabled: true,
    userInterfaceStyle: "automatic",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ddudu.channels",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
      output: env.storybookEnabled ? "single" : "static",
    },
    plugins: [
      "expo-router",
      [
        "expo-build-properties",
        {
          android: {
            extraMavenRepos: ["https://devrepo.kakao.com/nexus/content/groups/public/"],
          },
        },
      ],
      [
        "@react-native-kakao/core",
        {
          nativeAppKey: env.kakaoNativeKey,
          android: {
            authCodeHandlerActivity: true,
          },
          ios: {
            handleKakaoOpenUrl: true,
          },
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          faceIDPermission: "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
        },
      ],
    ],
    experiments: {
      reactCompiler: true,
      typedRoutes: true,
      tsconfigPaths: true,
    },
    extra: {
      ...config.extra,
      env,
    },
  };
};

export default defineConfig;
