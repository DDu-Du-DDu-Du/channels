import type { StorybookConfig } from "@storybook/react-native-web-vite";

const main: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: ["@storybook/addon-docs", "@chromatic-com/storybook"],

  framework: {
    name: "@storybook/react-native-web-vite",
    options: {},
  },
};

export default main;
