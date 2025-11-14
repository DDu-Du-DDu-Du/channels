import type { Meta, StoryObj } from "@storybook/react";

import TimeStampView from "./components/time-stamp-view/time-stamp-view";

const meta = {
  title: "components/TimeStamp",
  component: TimeStampView,
  argTypes: {
    label: { control: "text" },
  },
  args: {
    label: "09:00",
  },
} satisfies Meta<typeof TimeStampView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
