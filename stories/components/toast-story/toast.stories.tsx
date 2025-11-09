import type { Meta, StoryObj } from "@storybook/react";

import { ToastView } from "./components";

const meta = {
  title: "components/Toast",
  component: ToastView,
  parameters: {
    notes: `\n## Toast (Zustand + Reanimated)\n\n- Fades in up from bottom, fades out in place.\n- Max visible 4; the 5th pushes up and oldest fades out.\n- Uses RN StyleSheet for Animated views (no className).\n    `,
  },
} satisfies Meta<typeof ToastView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
