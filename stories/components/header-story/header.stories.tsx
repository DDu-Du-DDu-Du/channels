import type { Meta, StoryObj } from "@storybook/react";

import { HeaderView } from "./components";

const meta = {
  title: "components/Header",
  component: HeaderView,
  parameters: {
    notes: `\n## Header\n\n- Absolute top bar with left/right buttons.\n- Left button action is passed via onPressLeft.\n- Optional right button icon + action.\n- Optional label press handler.\n    `,
  },
  argTypes: {
    onPressLeft: { action: "onPressLeft" },
    rightButtonFn: { action: "rightButtonFn" },
    onPressLabel: { action: "onPressLabel" },
    headerLabel: { control: "text" },
    showRight: { control: "boolean" },
  },
  args: {
    headerLabel: "제목",
    showRight: false,
  },
} satisfies Meta<typeof HeaderView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRightButton: Story = {
  args: {
    showRight: true,
  },
};

export const WithLabelPress: Story = {
  args: {
    onPressLabel: () => {},
  },
};
