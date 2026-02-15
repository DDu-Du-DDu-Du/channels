import type { Meta, StoryObj } from "@storybook/react";

import ButtonView from "./button-view";

const meta = {
  title: "components/Button",
  component: ButtonView,
  argTypes: {
    label: { control: "text" },
    onPress: { action: "onPress" },
  },
  args: {
    label: "목표 등록",
  },
} satisfies Meta<typeof ButtonView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
