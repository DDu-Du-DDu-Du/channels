const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const { withNativeWind } = require("nativewind/metro");
const { withStorybook } = require("@storybook/react-native/metro/withStorybook");

const config = withStorybook(withNativeWind(defaultConfig, { input: "./global.css" }), {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true",
});

const previousEnhanceMiddleware = config.server?.enhanceMiddleware;

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, server) => {
    const nextMiddleware = previousEnhanceMiddleware
      ? previousEnhanceMiddleware(middleware, server)
      : middleware;

    return (request, response, next) => {
      response.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
      response.setHeader("Cross-Origin-Opener-Policy", "same-origin");

      return nextMiddleware(request, response, next);
    };
  },
};

config.resolver.unstable_conditionNames = ["browser", "require", "react-native"];
if (!config.resolver.assetExts.includes("wasm")) {
  config.resolver.assetExts.push("wasm");
}

module.exports = config;
