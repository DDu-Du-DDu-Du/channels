import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { MyButton } from "./Button";

import { fn } from "storybook/test";

const meta = {
  title: "MyButton",
  component: MyButton,
  args: {
    text: "Hello world",
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof MyButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    onPress: fn(),
  },
};
