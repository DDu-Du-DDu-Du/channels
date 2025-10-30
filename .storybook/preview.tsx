import { TanstackProvider } from "@/providers";
import type { Preview } from "@storybook/react-native";

const preview: Preview = {
  decorators: [
    (Story, { args }) => {
      return (
        <TanstackProvider>
          <Story args={args} />
        </TanstackProvider>
      );
    },
  ],

  parameters: {
    // actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
    },
  },

  tags: ["autodocs"],
};

export default preview;
