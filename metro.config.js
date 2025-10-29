const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const { withNativeWind } = require("nativewind/metro");
const { withStorybook } = require("@storybook/react-native/metro/withStorybook");

const config = withStorybook(withNativeWind(defaultConfig, { input: "./global.css" }), {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true",
});

module.exports = config;
