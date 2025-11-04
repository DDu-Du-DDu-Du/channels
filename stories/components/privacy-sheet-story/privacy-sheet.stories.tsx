import type { Meta, StoryObj } from "@storybook/react";

import { PrivacySheetView } from "./components";

const meta = {
  title: "components/PrivacySheet",
  component: PrivacySheetView,
  parameters: {
    notes: `
## PrivacySheet

Props
- goalPrivacy: PUBLIC | FOLLOWER | PRIVATE (initial value)

Usage
- Tap the button to open. Select an option, then press 확인.
    `,
  },
  argTypes: {
    goalPrivacy: { control: "inline-radio", options: ["PUBLIC", "FOLLOWER", "PRIVATE"] },
    onClose: { action: "onClose" },
    onClick: { action: "onClick" },
  },
} satisfies Meta<typeof PrivacySheetView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    goalPrivacy: "PUBLIC",
  },
};

export const Public: Story = {
  args: {
    goalPrivacy: "PUBLIC",
  },
};

export const Follower: Story = {
  args: {
    goalPrivacy: "FOLLOWER",
  },
};

export const Private: Story = {
  args: {
    goalPrivacy: "PRIVATE",
  },
};
