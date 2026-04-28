import * as dotenv from "dotenv";
import type { ConfigContext, ExpoConfig } from "expo/config";

dotenv.config();

const defineConfig = ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: "Modoo",
    owner: "mo-doo",
    slug: "modoo",
    scheme: "modoo",
    version: "0.1.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.modoo.channels",
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
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
      output: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true" ? "single" : "static",
    },
    plugins: [
      "@react-native-community/datetimepicker",
      "expo-font",
      "expo-image",
      [
        "expo-router",
        {
          headers: {
            "Cross-Origin-Embedder-Policy": "credentialless",
            "Cross-Origin-Opener-Policy": "same-origin",
          },
        },
      ],
      "expo-sqlite",
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
          nativeAppKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_KEY,
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
      appVariant: process.env.APP_VARIANT ?? "production",
      storybookEnabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true",
      kakaoNativeKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_KEY,
      kakaoJSKey: process.env.EXPO_PUBLIC_KAKAO_JS_KEY,
      kakaoRestKey: process.env.EXPO_PUBLIC_KAKAO_REST_KEY,
      fcmApiKey: process.env.EXPO_PUBLIC_FCM_API_KEY,
      fcmAuthDomain: process.env.EXPO_PUBLIC_FCM_AUTH_DOMAIN,
      fcmProjectId: process.env.EXPO_PUBLIC_FCM_PROJECT_ID,
      fcmStorageBucket: process.env.EXPO_PUBLIC_FCM_STORAGE_BUCKET,
      fcmMessagingSenderId: process.env.EXPO_PUBLIC_FCM_MESSAGING_SENDER_ID,
      fcmAppId: process.env.EXPO_PUBLIC_FCM_APP_ID,
      fcmMeasurementId: process.env.EXPO_PUBLIC_FCM_MEASUREMENT_ID,
      fcmVapId: process.env.EXPO_PUBLIC_FCM_VAP_ID,
      eas: {
        projectId: "2c613032-ff04-4bfd-9b55-ea49ee9d641c",
      },
    },
  };
};

export default defineConfig;
