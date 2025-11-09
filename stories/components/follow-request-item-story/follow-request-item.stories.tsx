import type { Meta, StoryObj } from "@storybook/react";

import { FollowRequestItemView } from "./components";

const meta = {
  title: "components/FollowRequestItem",
  component: FollowRequestItemView,
  parameters: {
    notes: `\n## FollowRequestItem\n\n- Shows avatar, request text, relative time, and action buttons.\n    `,
  },
  argTypes: {
    onFollowRequestCheck: { action: "onFollowRequestCheck" },
    followRequestAt: { control: "text" },
  },
  args: {
    followRequestAt: new Date().toISOString(),
  },
} satisfies Meta<typeof FollowRequestItemView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
