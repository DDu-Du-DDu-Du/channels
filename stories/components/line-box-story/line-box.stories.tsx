import type { Meta, StoryObj } from "@storybook/react";

import LineBoxView from "./components/line-box-view/line-box-view";

const meta = {
  title: "components/LineBox",
  component: LineBoxView,
} satisfies Meta<typeof LineBoxView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
