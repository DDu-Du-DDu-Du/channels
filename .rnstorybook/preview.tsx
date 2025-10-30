import { Platform } from "react-native";

import { TanstackProvider } from "@/providers";
import { withBackgrounds } from "@storybook/addon-ondevice-backgrounds";
import type { Preview } from "@storybook/react-native";

// fix for actions on web
if (Platform.OS === "web") {
  // @ts-ignore
  global.ProgressTransitionRegister = {};
  // @ts-ignore
  global.UpdatePropsManager = {};
}

const preview: Preview = {
  decorators: [
    withBackgrounds,
    (Story, { args }) => {
      return (
        <TanstackProvider>
          <Story args={args} />
        </TanstackProvider>
      );
    },
  ],

  parameters: {
    backgrounds: {
      default: "plain",
      values: [
        { name: "plain", value: "white" },
        { name: "warm", value: "hotpink" },
        { name: "cool", value: "deepskyblue" },
      ],
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
    },
  },
};

export default preview;
